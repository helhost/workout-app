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
    workout_id = create_workout(data)["id"]

    with subscribe_and_listen("users:1") as ws:
        created = client.post(f"/api/exercises", json={**data["workout"]["exercises"][0], "workout_id":workout_id}).json()
        message = ws.receive_json()

    assert message["type"] == "exercise_created"
    assert message["data"]["workout_id"] == created["workout_id"]


def test_set_created_user_broadcast(data):
    workout_data = create_workout(data)
    exercise_id = workout_data["exercises"][0]["id"]

    with subscribe_and_listen("users:1") as ws:
        created = client.post(f"/api/sets", json={**data["workout"]["exercises"][0]["sets"][0], "exercise_id":exercise_id}).json()
        message = ws.receive_json()

    assert message["type"] == "set_created"
    assert message["data"]["exercise_id"] == created["exercise_id"]


def test_subset_created_user_broadcast(data):
    workout_data = create_workout(data)
    set_id = workout_data["exercises"][0]["sets"][0]["id"]

    with subscribe_and_listen("users:1") as ws:
        created = client.post(f"/api/subsets", json={**data["workout"]["exercises"][0]["sets"][0]["subsets"][0], "set_id":set_id}).json()
        message = ws.receive_json()

    assert message["type"] == "subset_created"
    assert message["data"]["set_id"] == created["set_id"]
