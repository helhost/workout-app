import pytest
from fastapi.testclient import TestClient
from main import app
from database import engine, Base

client = TestClient(app)

@pytest.fixture(autouse=True)
def clean_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
