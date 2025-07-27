from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_server_running():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Workout API is running!"}

def test_create_and_get_user():
    user_data = {"name": "Test User"}
    create_response = client.post("/api/users", json=user_data)
    create_data = create_response.json()
    assert create_response.status_code == 200
    assert "id" in create_data
    assert create_data["id"] == 2
    assert create_data["name"] == user_data["name"]

    get_response = client.get("/api/users")
    users = get_response.json()
    assert get_response.status_code == 200

    created_user = next((user for user in users if user["id"] == create_data["id"]),None)
    assert created_user is not None
    assert created_user["name"] == user_data["name"]
