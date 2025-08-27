from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models,database
from pydantic import BaseModel
from app.security import get_current_user

class DeleteOut(BaseModel):
    detail: str

router = APIRouter(prefix="/users", tags=["users"])

@router.delete("/delete", response_model=DeleteOut)
def delete_user(user_id: int = Depends(get_current_user), db: Session = Depends(database.get_db)) -> DeleteOut:
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"detail": "User deleted successfully"}