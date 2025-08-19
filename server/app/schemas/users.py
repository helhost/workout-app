from sqlalchemy import Column, Integer, String, DateTime
from database import Base 
from datetime import datetime, timezone

class User(Base):
    __tablename__ = 'Users'
    id = Column(Integer,primary_key=True)
    name = Column(String(64))
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
