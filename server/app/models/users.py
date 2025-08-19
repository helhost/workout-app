from pydantic import BaseModel, ConfigDict
from datetime import datetime

class UserData(BaseModel):
    name:str

UserCreate = UserData

class UserRead(BaseModel):
    id: int
    name: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
