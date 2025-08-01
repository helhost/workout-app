from tests.util import create_workout, subscribe_and_listen, retrieve_workout
import pytest

@pytest.fixture(scope="module")
def data():
    return retrieve_workout()

def test_workout_created_user_broadcast(data):
    ws = subscribe_and_listen("users:1")

    created = create_workout(data)

    message =ws.receive_json()

    assert message["type"] == "workout_created"
    assert message["data"]["id"] == created["id"]
