"""Script to generate initial database migration."""

import sys
import os

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from alembic.config import Config
from alembic import command
from alembic.script import ScriptDirectory

# Get the backend directory
backend_dir = os.path.dirname(os.path.abspath(__file__))
alembic_cfg = Config(os.path.join(backend_dir, "alembic.ini"))

# Set the script location relative to backend
alembic_cfg.set_main_option("script_location", os.path.join(backend_dir, "alembic"))

# Generate the initial migration
print("Generating initial migration...")
command.revision(
    alembic_cfg,
    message="Initial migration - create users, attendance, and sessions tables",
    autogenerate=True
)
print("Migration generated successfully!")
print("\nNext steps:")
print("1. Review the generated migration file in backend/alembic/versions/")
print("2. Run: python -m alembic -c backend/alembic.ini upgrade head")