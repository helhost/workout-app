import pytest
from database import engine, Base
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

@pytest.fixture(autouse=True)
def clean_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    user_data = {"name": "Test User"}
    client.post("/api/users", json=user_data)
