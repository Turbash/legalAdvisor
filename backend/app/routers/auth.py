from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.security import create_access_token
from app import models,database
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel

class TokenOut(BaseModel):
    access_token: str
    token_type: str
    user_id: int

router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

@router.post("/register", response_model=TokenOut)
def register_user(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)) -> TokenOut:
    existing_user = db.query(models.User).filter((models.User.username == form_data.username)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")

    hashed_password = hash_password(form_data.password)
    new_user = models.User(username=form_data.username, password_hash=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"user_id": new_user.id})
    return TokenOut(access_token=token, token_type="bearer", user_id=new_user.id)

@router.post("/login", response_model=TokenOut)
def login_user(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)) -> TokenOut:
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    token = create_access_token({"user_id": user.id})
    return TokenOut(access_token=token, token_type="bearer", user_id=user.id)