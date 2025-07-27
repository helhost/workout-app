from fastapi.testclient import TestClient
from main import app

client = TestClient(app)
test_data = {
    "workout": {
        "user_id": 1,
        "exercises": [
            {
                "exercise_number": 1,
                "sets": [
                    {
                        "set_number": 1,
                        "exercise_name": "Bench Press",
                        "sub_sets": [
                            {"reps": 10, "weight": 80.0,"subset_number": 1}
                        ]
                    },
                    {
                        "set_number": 2,
                        "exercise_name": "Bench Press",
                        "sub_sets": [
                            {"reps": 8, "weight": 85.0,"subset_number": 1}
                        ]
                    },
                    {
                        "set_number": 3,
                        "exercise_name": "Bench Press",
                        "sub_sets": [
                            {"reps": 6, "weight": 90.0,"subset_number": 1}
                        ]
                    }
                ]
            },
            {
                "exercise_number": 2,
                "sets": [
                    {
                        "set_number": 1,
                        "exercise_name": "Squats",
                        "sub_sets": [
                            {"reps": 12, "weight": 100.0,"subset_number": 1}
                        ]
                    },
                    {
                        "set_number": 2,
                        "exercise_name": "Squats",
                        "sub_sets": [
                            {"reps": 10, "weight": 110.0,"subset_number": 1}
                        ]
                    },
                    {
                        "set_number": 3,
                        "exercise_name": "Squats",
                        "sub_sets": [
                            {"reps": 8, "weight": 120.0,"subset_number": 1},
                            {"reps": 8, "weight": 80.0,"subset_number": 2},
                            {"reps": 8, "weight": 40.0,"subset_number": 3},
                        ]
                    }
                ]
            },
            {
                "exercise_number": 3,
                "sets": [
                    {
                        "set_number": 1,
                        "exercise_name": "Pull-ups",
                        "sub_sets": [
                            {"reps": 8, "weight": 0.0,"subset_number": 1}
                        ]
                    },
                    {
                        "set_number": 2,
                        "exercise_name": "Chin-ups",
                        "sub_sets": [
                            {"reps": 8, "weight": 0.0,"subset_number": 1}
                        ]
                    },
                    {
                        "set_number": 3,
                        "exercise_name": "Pull-ups",
                        "sub_sets": [
                            {"reps": 8, "weight": 0.0,"subset_number": 1}
                        ]
                    },
                    {
                        "set_number": 4,
                        "exercise_name": "Chin-ups",
                        "sub_sets": [
                            {"reps": 8, "weight": 0.0,"subset_number": 1}
                        ]
                    },
                    {
                        "set_number": 5,
                        "exercise_name": "Pull-ups",
                        "sub_sets": [
                            {"reps": 8, "weight": 0.0,"subset_number": 1}
                        ]
                    },
                    {
                        "set_number": 6,
                        "exercise_name": "Chin-ups",
                        "sub_sets": [
                            {"reps": 8, "weight": 0.0,"subset_number": 1}
                        ]
                    },
                ]
            }
        ]
    }
}


def test_get_all_workouts_initially():
    response = client.get("/api/workouts")
    assert response.status_code == 200
    workouts = response.json()

    assert len(workouts) == 0


def test_create_and_get_workouts():
    # Create Workout
    create_response = client.post("/api/workouts", json=test_data["workout"])
    assert create_response.status_code == 200

    workout_id = create_response.json()["id"]

    # Retrieve the Workout
    get_response = client.get(f"/api/workouts/{workout_id}")
    assert get_response.status_code == 200

    get_workout = get_response.json()
    assert get_workout["id"] == workout_id


def test_workout_structure_integrity():
    # Create Workout
    create_response = client.post("/api/workouts", json=test_data["workout"])
    workout_data = create_response.json()

    # Verify Workout
    assert "exercises" in workout_data
    assert "user_id" in workout_data
    assert len(workout_data["exercises"]) == 3

    # Verify Exercises
    first_exercise = workout_data["exercises"][0]
    assert "sets" in first_exercise
    assert "exercise_number" in first_exercise
    assert len(first_exercise["sets"]) == 3

    # Verify Sets
    first_set = first_exercise["sets"][0]
    assert "exercise_name" in first_set
    assert first_set["exercise_name"] == "Bench Press"
    assert "sub_sets" in first_set
    assert "set_number" in first_set
    assert len(first_set["sub_sets"]) == 1

    # Verify subsets
    first_subset = first_set["sub_sets"][0]
    assert "reps" in first_subset
    assert "weight" in first_subset
    assert "subset_number" in first_subset
    assert first_subset["reps"] == 10
    assert first_subset["weight"] == 80.0
    assert first_subset["subset_number"] == 1


def test_create_exercise_for_existing_workout():
    # Create Workout
    create_response = client.post("/api/workouts", json=test_data["workout"])
    assert create_response.status_code == 200
    workout_id = create_response.json()["id"]

    # Create Exercise
    exercise_response = client.post(f"/api/exercises", json={**test_data["workout"]["exercises"][0], "workout_id":workout_id})
    assert exercise_response.status_code == 200

    exercise_data = exercise_response.json()
    assert "id" in exercise_data


def test_create_exercise_for_nonexistent_workout():
    # Create Exercise (invalid)
    response = client.post("/api/exercises", json={**test_data["workout"]["exercises"][0], "workout_id": 999})
    assert response.status_code == 404
    assert "Workout not found" in response.json()["detail"]


def test_get_individual_exercise():
    # Create Workout
    create_response = client.post("/api/workouts", json=test_data["workout"])
    assert create_response.status_code == 200

    exercise_id = create_response.json()["exercises"][0]["id"]

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


def test_create_set_for_existing_exercise():
    # Create Workout
    create_response = client.post("/api/workouts", json=test_data["workout"])
    assert create_response.status_code == 200

    exercise_id = create_response.json()["exercises"][0]["id"]

    # Create Set
    set_response = client.post(f"/api/sets", json={**test_data["workout"]["exercises"][0]["sets"][0],"exercise_id":exercise_id})
    assert set_response.status_code == 200

    set_data = set_response.json()
    assert "id" in set_data


def test_create_set_for_nonexistent_exercise():
    # Create Set (invalid)
    response = client.post("/api/sets", json={**test_data["workout"]["exercises"][0]["sets"][0],"exercise_id":999})
    assert response.status_code == 404
    assert "Exercise not found" in response.json()["detail"]


def test_get_individual_set():
    # Create Workout
    create_response = client.post("/api/workouts", json=test_data["workout"])
    assert create_response.status_code == 200

    set_id = create_response.json()["exercises"][0]["sets"][0]["id"]

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


def test_create_subset_for_existing_set():
    # Create Workout
    create_response = client.post("/api/workouts", json=test_data["workout"])
    assert create_response.status_code == 200

    set_id = create_response.json()["exercises"][0]["sets"][0]["id"]

    # Create Subset
    subset_response = client.post(f"/api/subsets", json={**test_data["workout"]["exercises"][0]["sets"][0]["sub_sets"][0], 
                                                         "set_id": set_id})
    assert subset_response.status_code == 200

    subset_data = subset_response.json()
    assert "id" in subset_data


def test_get_individual_subset():
    # Create Workout
    create_response = client.post("/api/workouts", json=test_data["workout"])
    assert create_response.status_code == 200

    subset_id = create_response.json()["exercises"][0]["sets"][0]["sub_sets"][0]["id"]

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


def test_get_all_workouts_after_creation():
    # Create Workout
    create_response = client.post("/api/workouts", json=test_data["workout"])
    assert create_response.status_code == 200

    response = client.get("/api/workouts")
    assert response.status_code == 200

    data = response.json()
    assert len(data) == 1
