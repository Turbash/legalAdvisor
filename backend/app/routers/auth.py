from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.security import create_access_token
from app import models,database

router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

@router.post("/register")
def register_user(username: str, email: str, password: str, db: Session = Depends(database.get_db)):
    existing_user = db.query(models.User).filter((models.User.username == username)|(models.User.email == email)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    
    hashed_password = hash_password(password)
    new_user = models.User(username=username, email=email, password_hash=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"user_id": new_user.id})
    return {"access_token": token, "token_type": "bearer", "user_id": new_user.id}

@router.post("/login")
def login_user(username:str, password: str, db:Session = Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    token = create_access_token({"user_id": user.id})
    return {"access_token": token, "token_type": "bearer", "user_id": user.id}