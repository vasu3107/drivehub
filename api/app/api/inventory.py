from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.vehicle import Vehicle
from app.models.user import User
from app.models.transaction import Transaction
from app.schemas.vehicle import VehicleOut, VehicleRestock
from app.core.security import get_current_user, get_current_admin_user
from app.core.response import api_response

router = APIRouter(prefix="/vehicles", tags=["Inventory"])

@router.post("/{vehicle_id}/purchase")
def purchase_vehicle(
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
    
    if vehicle.quantity <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Out of stock! Vehicle quantity is 0."
        )
    
    vehicle.quantity -= 1
    
    txn = Transaction(
        user_id=current_user.id,
        vehicle_id=vehicle.id,
        type="purchase",
        quantity=1
    )
    db.add(txn)
    db.commit()
    db.refresh(vehicle)

    vehicle_data = VehicleOut.model_validate(vehicle).model_dump(mode="json")
    return api_response(
        status_code=status.HTTP_200_OK,
        message=f"Successfully purchased {vehicle.year} {vehicle.make} {vehicle.model}",
        data={
            "quantity": vehicle.quantity,
            "vehicle": vehicle_data
        }
    )

@router.post("/{vehicle_id}/restock")
def restock_vehicle(
    vehicle_id: int,
    restock_data: VehicleRestock,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )
    
    vehicle.quantity += restock_data.quantity

    txn = Transaction(
        user_id=admin_user.id,
        vehicle_id=vehicle.id,
        type="restock",
        quantity=restock_data.quantity
    )
    db.add(txn)
    db.commit()
    db.refresh(vehicle)

    vehicle_data = VehicleOut.model_validate(vehicle).model_dump(mode="json")
    return api_response(
        status_code=status.HTTP_200_OK,
        message=f"Restocked successfully! Added {restock_data.quantity} units.",
        data={
            "quantity": vehicle.quantity,
            "vehicle": vehicle_data
        }
    )
