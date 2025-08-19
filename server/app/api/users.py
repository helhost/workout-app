from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas.users import User
from models.users import UserCreate, UserRead
from ws_manager import websocket_manager

router = APIRouter()

@router.get("/users", response_model=list[UserRead])
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()

    return users

@router.post("/users", response_model=UserRead)
async def create_user(user_data: UserCreate, db: Session = Depends(get_db)):
    new_user = User(name=user_data.name)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    user_read = UserRead.model_validate(new_user, from_attributes=True)

    await websocket_manager.broadcast(
        resource="users",
        data={"type": "user_created", "data": user_read.model_dump(mode="json")}
    )

    return user_read
