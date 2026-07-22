import sys
import os

# Add api directory to sys.path
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from app.main import app
from app.database import engine, Base
from app.seed import seed_database

# Initialize SQLite schema & seed exotic vehicles on Vercel Serverless cold start
try:
    Base.metadata.create_all(bind=engine)
    seed_database()
except Exception as e:
    print("Vercel cold start db init:", e)

# ASGI handler for Vercel Serverless Functions
app = app
