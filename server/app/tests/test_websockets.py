from tests.util import create_workout, subscribe_and_listen, retrieve_workout
import pytest

@pytest.fixture(scope="module")
def data():
    return retrieve_workout()

def test_workout_created_user_broadcast(data):
    with subscribe_and_listen("users:1") as ws:
        created = create_workout(data)
        message = ws.receive_json()

    assert message["type"] == "workout_created"
    assert message["data"]["user_id"] == created["user_id"]
