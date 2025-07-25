from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
import os

database_url = os.getenv("DATABASE_URL")
if not database_url:
    exit(1)
engine = create_engine(database_url)
Base = declarative_base()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def setup_database():
    Base.metadata.create_all(engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
