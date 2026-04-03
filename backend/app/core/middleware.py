"""
Custom middleware for rate limiting and security headers.
"""

import time
from collections import defaultdict
from fastapi import Request, Response
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from typing import Dict, Tuple
import logging

from .config import settings

logger = logging.getLogger(__name__)


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Rate limiting middleware to prevent abuse.
    Tracks requests per client IP and endpoint.
    """
    
    def __init__(self, app):
        super().__init__(app)
        # Store: {client_ip: {endpoint: [(timestamp, count)]}}
        self.request_history: Dict[str, Dict[str, list]] = defaultdict(lambda: defaultdict(list))
        # Store for auth endpoints specifically
        self.auth_attempts: Dict[str, list] = defaultdict(list)
    
    async def dispatch(self, request: Request, call_next) -> Response:
        client_ip = self._get_client_ip(request)
        path = request.url.path
        
        # Check rate limits
        is_auth_endpoint = path in ["/api/v1/auth/login", "/api/v1/auth/register"]
        
        if is_auth_endpoint:
            # Stricter rate limit for auth endpoints
            allowed, retry_after = self._check_auth_rate_limit(client_ip)
            if not allowed:
                logger.warning(f"Rate limit exceeded for auth endpoint from {client_ip}")
                return JSONResponse(
                    status_code=429,
                    content={
                        "detail": "Too many authentication attempts. Please try again later.",
                        "retry_after": retry_after
                    }
                )
        else:
            # General rate limit
            allowed, retry_after = self._check_general_rate_limit(client_ip, path)
            if not allowed:
                logger.warning(f"Rate limit exceeded for {path} from {client_ip}")
                return JSONResponse(
                    status_code=429,
                    content={
                        "detail": "Rate limit exceeded. Please slow down.",
                        "retry_after": retry_after
                    }
                )
        
        # Process request
        response = await call_next(request)
        
        # Add rate limit headers
        response.headers["X-RateLimit-Limit"] = str(settings.RATE_LIMIT_PER_MINUTE)
        response.headers["X-RateLimit-Remaining"] = str(max(0, self._get_remaining_requests(client_ip, path)))
        
        return response
    
    def _get_client_ip(self, request: Request) -> str:
        """Extract client IP from request, considering proxies."""
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            return forwarded.split(",")[0].strip()
        return request.client.host if request.client else "unknown"
    
    def _check_auth_rate_limit(self, client_ip: str) -> Tuple[bool, int]:
        """Check rate limit for authentication endpoints."""
        now = time.time()
        window = 60  # 1 minute window
        
        # Clean old entries
        self.auth_attempts[client_ip] = [
            t for t in self.auth_attempts[client_ip] if now - t < window
        ]
        
        attempts = len(self.auth_attempts[client_ip])
        if attempts >= settings.RATE_LIMIT_AUTH_PER_MINUTE:
            retry_after = int(window - (now - self.auth_attempts[client_ip][0]))
            return False, max(1, retry_after)
        
        # Record this attempt
        self.auth_attempts[client_ip].append(now)
        return True, 0
    
    def _check_general_rate_limit(self, client_ip: str, path: str) -> Tuple[bool, int]:
        """Check general rate limit for other endpoints."""
        now = time.time()
        window = 60  # 1 minute window
        
        # Clean old entries
        self.request_history[client_ip][path] = [
            (t, c) for t, c in self.request_history[client_ip][path] if now - t < window
        ]
        
        requests = sum(c for _, c in self.request_history[client_ip][path])
        if requests >= settings.RATE_LIMIT_PER_MINUTE:
            oldest = min(t for t, _ in self.request_history[client_ip][path])
            retry_after = int(window - (now - oldest))
            return False, max(1, retry_after)
        
        # Record this request
        self.request_history[client_ip][path].append((now, 1))
        return True, 0
    
    def _get_remaining_requests(self, client_ip: str, path: str) -> int:
        """Get remaining requests for current window."""
        now = time.time()
        window = 60
        
        requests = sum(
            c for t, c in self.request_history[client_ip][path] 
            if now - t < window
        )
        return max(0, settings.RATE_LIMIT_PER_MINUTE - requests)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Middleware to add security headers to all responses.
    """
    
    async def dispatch(self, request: Request, call_next) -> Response:
        response = await call_next(request)
        
        # Security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        
        # Remove server information (use del to avoid pop on MutableHeaders)
        if "Server" in response.headers:
            del response.headers["Server"]
        if "X-Powered-By" in response.headers:
            del response.headers["X-Powered-By"]
        
        return response


class RequestValidationMiddleware(BaseHTTPMiddleware):
    """
    Middleware to validate incoming requests for security.
    """
    
    async def dispatch(self, request: Request, call_next) -> Response:
        # Block suspicious user agents
        user_agent = request.headers.get("User-Agent", "")
        if not user_agent or any(bad in user_agent.lower() for bad in ["sqlmap", "nikto", "nmap"]):
            logger.warning(f"Blocked suspicious request from {request.client.host}")
            return JSONResponse(
                status_code=403,
                content={"detail": "Access denied"}
            )
        
        # Validate content type for POST/PUT/PATCH (except for OAuth2 token endpoint)
        if request.method in ["POST", "PUT", "PATCH"]:
            content_type = request.headers.get("Content-Type", "")
            # Allow JSON, multipart/form-data, and form-urlencoded (for OAuth2)
            allowed_types = ["application/json", "multipart/form-data", "application/x-www-form-urlencoded"]
            if not any(allowed in content_type for allowed in allowed_types):
                return JSONResponse(
                    status_code=415,
                    content={"detail": "Unsupported Media Type. Use application/json, multipart/form-data, or application/x-www-form-urlencoded"}
                )
        
        return await call_next(request)


class LoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware for detailed request/response logging.
    """
    
    async def dispatch(self, request: Request, call_next) -> Response:
        start_time = time.time()
        
        # Log request
        logger.info(
            f"Request: {request.method} {request.url.path} "
            f"from {request.client.host if request.client else 'unknown'}"
        )
        
        response = await call_next(request)
        
        # Log response
        process_time = time.time() - start_time
        logger.info(
            f"Response: {response.status_code} "
            f"in {process_time:.3f}s"
        )
        
        # Add timing header
        response.headers["X-Process-Time"] = str(round(process_time, 3))
        
        return response