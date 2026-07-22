from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class VehicleBase(BaseModel):
    make: str
    model: str
    year: int = Field(default=2024, ge=1900, le=2027)
    category: str
    price: float = Field(..., gt=0)
    quantity: int = Field(default=1, ge=0)
    description: Optional[str] = None
    image_url: Optional[str] = None

class VehicleCreate(VehicleBase):
    pass

class VehicleUpdate(BaseModel):
    make: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    category: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[int] = None
    description: Optional[str] = None
    image_url: Optional[str] = None

class VehicleRestock(BaseModel):
    quantity: int = Field(..., gt=0, description="Amount to restock")

class VehicleOut(VehicleBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
