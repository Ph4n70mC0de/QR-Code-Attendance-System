"""Script to run database migrations."""

import sys
import os

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from alembic.config import Config

# Get the backend directory
backend_dir = os.path.dirname(os.path.abspath(__file__))
alembic_cfg = Config(os.path.join(backend_dir, "alembic.ini"))

# Set the script location relative to backend
alembic_cfg.set_main_option("script_location", os.path.join(backend_dir, "alembic"))

# Run the migration
print("Running database migrations...")
from alembic import command
command.upgrade(alembic_cfg, "head")
print("\nMigrations completed successfully!")