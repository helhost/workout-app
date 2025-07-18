from fastapi import APIRouter, Depends
from database import get_db
from sqlalchemy.orm import Session
from models import User
from pydantic import BaseModel

router = APIRouter()

@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return {"users":users}


class UserCreate(BaseModel):
    name: str

@router.post("/users")
def create_user(user_data: UserCreate, db: Session = Depends(get_db)):
    new_user = User(name=user_data.name)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"id":new_user.id, "name":new_user.name}

