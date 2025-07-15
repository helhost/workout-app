from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

def setup_database():
    
    database_url = os.getenv("DATABASE_URL")
    engine = create_engine(database_url)

    Base = declarative_base()

    class User(Base):
        __tablename__ = 'Users'
        id = Column(Integer,primary_key=True)
        name = Column(String(64))

    Base.metadata.create_all(engine)

    print("db initialized")

    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()
    user = User(name="John Doe")
    session.add(user)
    session.commit()

    print("session started, user added, and session closed")

    users = session.query(User).all()
    for user in users:
        print(f"name: {user.name}, id: {user.id}")
