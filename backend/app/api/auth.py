from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models.user import User
from app.schemas.auth import UserRegister, UserLogin, UserOut, Token
from app.core.security import get_password_hash, verify_password, create_access_token, get_current_user
from app.core.response import api_response

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserRegister, db: Session = Depends(get_db)):
    existing_username = db.query(User).filter(User.username == user_in.username).first()
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    existing_email = db.query(User).filter(User.email == user_in.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed_pwd = get_password_hash(user_in.password)
    new_user = User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=hashed_pwd,
        role=user_in.role if user_in.role in ["admin", "customer"] else "customer"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    user_data = UserOut.model_validate(new_user).model_dump(mode="json")
    return api_response(
        status_code=status.HTTP_201_CREATED,
        message="User registered successfully",
        data=user_data
    )

@router.post("/login")
def login_user(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        or_(User.username == login_data.username_or_email, User.email == login_data.username_or_email)
    ).first()

    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    access_token = create_access_token({"sub": user.username, "role": user.role})
    user_out = UserOut.model_validate(user).model_dump(mode="json")

    return api_response(
        status_code=status.HTTP_200_OK,
        message="User logged in successfully",
        data={
            "access_token": access_token,
            "token_type": "bearer",
            "user": user_out
        }
    )

@router.get("/me")
def read_current_user(current_user: User = Depends(get_current_user)):
    user_data = UserOut.model_validate(current_user).model_dump(mode="json")
    return api_response(
        status_code=status.HTTP_200_OK,
        message="Current user profile retrieved successfully",
        data=user_data
    )
