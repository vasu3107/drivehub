import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "DriveHub Car Dealership Inventory System"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day
    
    # Use /tmp/drivehub.db when running in Vercel Serverless environment
    DATABASE_URL: str = "/tmp/drivehub.db" if os.environ.get("VERCEL") else "sqlite:///./drivehub.db"

    def get_database_url(self) -> str:
        if self.DATABASE_URL.startswith("sqlite") or "://" in self.DATABASE_URL:
            return self.DATABASE_URL
        return f"sqlite:///{self.DATABASE_URL}"

    class Config:
        case_sensitive = True

settings = Settings()
