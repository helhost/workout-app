from sqlalchemy import Column, Integer, String
from database import Base 

class User(Base):
    __tablename__ = 'Users'
    id = Column(Integer,primary_key=True)
    name = Column(String(64))
