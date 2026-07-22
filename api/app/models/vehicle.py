from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from datetime import datetime
from app.database import Base

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    make = Column(String(50), index=True, nullable=False)
    model = Column(String(50), index=True, nullable=False)
    year = Column(Integer, nullable=False, default=2024)
    category = Column(String(50), index=True, nullable=False)  # SUV, Sedan, Luxury, Electric, Sports
    price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
