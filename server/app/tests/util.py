from fastapi.testclient import TestClient
from main import app
from contextlib import contextmanager
import json
import os

client = TestClient(app)

def retrieve_workout():
    curr_dir = os.path.dirname(__file__)
    json_path = os.path.join(curr_dir, "data", "workout.json")
    with open(json_path, 'r') as f:
        return json.load(f)

def create_workout(data):
    create_response = client.post("/api/workouts", json=data["workout"])
    return create_response.json()

@contextmanager
def subscribe_and_listen(resource:str):
    with client.websocket_connect("/ws") as ws:
        ws.send_json({"type": "subscribe", "resource": resource})
        yield ws
