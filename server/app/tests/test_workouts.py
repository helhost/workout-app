from fastapi.testclient import TestClient
from main import app
from tests.util import create_workout
from tests.util import retrieve_workout
import pytest

client = TestClient(app)

@pytest.fixture(scope="module")
def data():
    return retrieve_workout()


def test_get_all_workouts_initially():
    response = client.get("/api/workouts")
    assert response.status_code == 200
    workouts = response.json()

    assert len(workouts) == 0


def test_create_and_get_workouts(data):
    workout_id = create_workout(data)["id"]

    # Retrieve the Workout
    get_response = client.get(f"/api/workouts/{workout_id}")
    assert get_response.status_code == 200

    get_workout = get_response.json()
    assert get_workout["id"] == workout_id


def test_workout_structure_integrity(data):
    workout_data = create_workout(data)

    # Verify Workout
    assert "exercises" in workout_data
    assert "user_id" in workout_data
    assert "created_at" in workout_data
    assert workout_data["type"] == "Back"
    assert len(workout_data["exercises"]) == 3

    # Verify Exercises
    first_exercise = workout_data["exercises"][0]
    assert "sets" in first_exercise
    assert "created_at" in first_exercise
    assert "exercise_number" in first_exercise
    assert len(first_exercise["sets"]) == 3

    # Verify Sets
    first_set = first_exercise["sets"][0]
    assert "exercise_name" in first_set
    assert first_set["exercise_name"] == "Bench Press"
    assert "subsets" in first_set
    assert "created_at" in first_set
    assert "set_number" in first_set
    assert len(first_set["subsets"]) == 1

    # Verify subsets
    first_subset = first_set["subsets"][0]
    assert "reps" in first_subset
    assert "weight" in first_subset
    assert "subset_number" in first_subset
    assert "created_at" in first_subset
    assert first_subset["reps"] == 10
    assert first_subset["weight"] == 80.0
    assert first_subset["subset_number"] == 1

def test_workout_summary(data):
    workout_data = create_workout(data)

    w_response = client.get(f"/api/workouts/summary/{workout_data['id']}")
    assert w_response.status_code == 200

    w_summary = w_response.json()
    assert w_summary["user_id"] == workout_data["user_id"]
    assert w_summary["type"] == workout_data["type"]
    assert w_summary["total_exercises"] == len(workout_data["exercises"])
    assert w_summary["total_sets"] == sum(len(ex["sets"]) for ex in workout_data["exercises"])
    assert w_summary["created_at"] == workout_data["created_at"]


def test_create_exercise_for_existing_workout(data):
    workout_id = create_workout(data)["id"]

    # Create Exercise
    exercise_response = client.post(f"/api/exercises", json={**data["workout"]["exercises"][0], "workout_id":workout_id})
    assert exercise_response.status_code == 200

    exercise_data = exercise_response.json()
    assert "id" in exercise_data
    assert "created_at" in exercise_data


def test_create_exercise_for_nonexistent_workout(data):
    # Create Exercise (invalid)
    response = client.post("/api/exercises", json={**data["workout"]["exercises"][0], "workout_id": 999})
    assert response.status_code == 404
    assert "Workout not found" in response.json()["detail"]


def test_get_individual_exercise(data):
    workout_data = create_workout(data)
    exercise_id = workout_data["exercises"][0]["id"]

    # Retreive Exercise
    exercise_response = client.get(f"/api/exercises/{exercise_id}")
    assert exercise_response.status_code == 200

    exercise_data = exercise_response.json()
    assert exercise_data["id"] == exercise_id


def test_get_nonexistent_exercise():
    # Retrieve Exercise (invalid)
    response = client.get("/api/exercises/999")
    assert response.status_code == 404
    assert "Exercise not found" in response.json()["detail"]


def test_create_set_for_existing_exercise(data):
    workout_data = create_workout(data)
    exercise_id = workout_data["exercises"][0]["id"]

    # Create Set
    set_response = client.post(f"/api/sets", json={**data["workout"]["exercises"][0]["sets"][0],"exercise_id":exercise_id})
    assert set_response.status_code == 200

    set_data = set_response.json()
    assert "id" in set_data
    assert "created_at" in set_data


def test_create_set_for_nonexistent_exercise(data):
    # Create Set (invalid)
    response = client.post("/api/sets", json={**data["workout"]["exercises"][0]["sets"][0],"exercise_id":999})
    assert response.status_code == 404
    assert "Exercise not found" in response.json()["detail"]


def test_get_individual_set(data):
    workout_data = create_workout(data)
    set_id = workout_data["exercises"][0]["sets"][0]["id"]

    # Retreive Set
    set_response = client.get(f"/api/sets/{set_id}")
    assert set_response.status_code == 200

    set_data = set_response.json()
    assert set_data["id"] == set_id


def test_get_nonexistent_set():
    # Create Set (invalid)
    response = client.get("/api/sets/999")
    assert response.status_code == 404
    assert "Set not found" in response.json()["detail"]


def test_create_subset_for_existing_set(data):
    workout_data = create_workout(data)
    set_id = workout_data["exercises"][0]["sets"][0]["id"]

    # Create Subset
    subset_response = client.post(f"/api/subsets", json={**data["workout"]["exercises"][0]["sets"][0]["subsets"][0], 
                                                         "set_id": set_id})
    assert subset_response.status_code == 200

    subset_data = subset_response.json()
    assert "id" in subset_data
    assert "created_at" in subset_data


def test_get_individual_subset(data):
    workout_data = create_workout(data)
    subset_id = workout_data["exercises"][0]["sets"][0]["subsets"][0]["id"]

    # Retreive Subset
    subset_response = client.get(f"/api/subsets/{subset_id}")
    assert subset_response.status_code == 200

    subset_data = subset_response.json()
    assert subset_data["id"] == subset_id


def test_get_nonexistent_subset():
    # Create Subset (invalid)
    response = client.get("/api/subsets/999")
    assert response.status_code == 404
    assert "Subset not found" in response.json()["detail"]


def test_get_all_workouts_after_creation(data):
    workout_data = create_workout(data)
    response = client.get("/api/workouts")
    assert response.status_code == 200

    workout_data = response.json()
    assert len(workout_data) == 1
