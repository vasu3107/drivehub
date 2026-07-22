from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional

from app.database import get_db
from app.models.vehicle import Vehicle
from app.models.user import User
from app.schemas.vehicle import VehicleCreate, VehicleUpdate, VehicleOut
from app.core.security import get_current_user, get_current_admin_user
from app.core.response import api_response

router = APIRouter(prefix="/vehicles", tags=["Vehicles"])

@router.get("")
def get_all_vehicles(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    vehicles = db.query(Vehicle).order_by(Vehicle.created_at.desc()).all()
    vehicles_data = [VehicleOut.model_validate(v).model_dump(mode="json") for v in vehicles]
    return api_response(
        status_code=status.HTTP_200_OK,
        message=f"Retrieved {len(vehicles_data)} vehicles successfully",
        data=vehicles_data
    )

@router.get("/search")
def search_vehicles(
    q: Optional[str] = Query(None, description="Search keyword for make, model, or category"),
    make: Optional[str] = Query(None),
    model: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Vehicle)

    if q:
        search_pattern = f"%{q}%"
        query = query.filter(
            or_(
                Vehicle.make.ilike(search_pattern),
                Vehicle.model.ilike(search_pattern),
                Vehicle.category.ilike(search_pattern),
                Vehicle.description.ilike(search_pattern)
            )
        )
    if make:
        query = query.filter(Vehicle.make.ilike(f"%{make}%"))
    if model:
        query = query.filter(Vehicle.model.ilike(f"%{model}%"))
    if category and category != "All":
        query = query.filter(Vehicle.category.ilike(category))
    if min_price is not None:
        query = query.filter(Vehicle.price >= min_price)
    if max_price is not None:
        query = query.filter(Vehicle.price <= max_price)

    vehicles = query.order_by(Vehicle.price.asc()).all()
    vehicles_data = [VehicleOut.model_validate(v).model_dump(mode="json") for v in vehicles]
    return api_response(
        status_code=status.HTTP_200_OK,
        message=f"Found {len(vehicles_data)} matching vehicles",
        data=vehicles_data
    )

@router.get("/{vehicle_id}")
def get_vehicle_by_id(
    vehicle_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )
    vehicle_data = VehicleOut.model_validate(vehicle).model_dump(mode="json")
    return api_response(
        status_code=status.HTTP_200_OK,
        message="Vehicle details retrieved successfully",
        data=vehicle_data
    )

@router.post("", status_code=status.HTTP_201_CREATED)
def create_vehicle(
    vehicle_in: VehicleCreate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
):
    new_vehicle = Vehicle(**vehicle_in.model_dump())
    db.add(new_vehicle)
    db.commit()
    db.refresh(new_vehicle)
    vehicle_data = VehicleOut.model_validate(new_vehicle).model_dump(mode="json")
    return api_response(
        status_code=status.HTTP_201_CREATED,
        message="Vehicle created successfully",
        data=vehicle_data
    )

@router.put("/{vehicle_id}")
def update_vehicle(
    vehicle_id: int,
    vehicle_in: VehicleUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )
    
    update_data = vehicle_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(vehicle, field, value)
    
    db.commit()
    db.refresh(vehicle)
    vehicle_data = VehicleOut.model_validate(vehicle).model_dump(mode="json")
    return api_response(
        status_code=status.HTTP_200_OK,
        message="Vehicle details updated successfully",
        data=vehicle_data
    )

@router.delete("/{vehicle_id}")
def delete_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )
    
    db.delete(vehicle)
    db.commit()
    return api_response(
        status_code=status.HTTP_200_OK,
        message="Vehicle deleted successfully",
        data={"id": vehicle_id}
    )
