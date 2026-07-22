import sys
import os

# Add backend directory to sys.path so app imports work seamlessly
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../backend")))

from app.main import app
from app.seed import seed_database

# Auto-seed database on serverless cold start
try:
    seed_database()
except Exception as e:
    print("Cold start seed check:", e)
