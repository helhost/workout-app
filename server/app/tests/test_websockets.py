from tests.util import create_workout, subscribe_and_listen, retrieve_workout
from fastapi.testclient import TestClient
from main import app
import pytest

client = TestClient(app)

@pytest.fixture(scope="module")
def data():
    return retrieve_workout()

def test_workout_created_user_broadcast(data):
    with subscribe_and_listen("users:1") as ws:
        created = create_workout(data)
        message = ws.receive_json()

    assert message["type"] == "workout_created"
    assert message["data"]["user_id"] == created["user_id"]

def test_exercise_created_user_broadcast(data):
    with subscribe_and_listen("user:1") as ws:
        created = client.post(f"/api/exercises", json={**data["workout"]["exercises"][0], "workout_id":1}).json()
        message = ws.receive_json()

    assert message["type"] == "exercise_created"
    assert message["data"]["workout_id"] == created["workout_id"]
