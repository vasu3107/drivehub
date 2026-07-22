import sys
import os

# Add backend directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../backend")))

from app.main import app
from app.database import engine, Base
from app.seed import seed_database

# Initialize database schema & seed demo data in /tmp/drivehub.db for Vercel Serverless environment
try:
    Base.metadata.create_all(bind=engine)
    seed_database()
except Exception as e:
    print("Vercel cold start db initialization:", e)

# Export FastAPI app as ASGI handler for Vercel
app = app
