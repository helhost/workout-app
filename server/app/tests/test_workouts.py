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


def test_get_workouts_initially_empty():
    response = client.get("/api/workouts")
    assert response.status_code == 200
    assert "workouts" in response.json()

def test_create_and_get_workouts():
    create_response = client.post("/api/workouts", json=test_data["workout"])
    assert create_response.status_code == 200

    create_data = create_response.json()
    assert "workout" in create_data
    assert "id" in create_data["workout"]

    workout_id = create_data["workout"]["id"]

    get_response = client.get(f"/api/workouts/{workout_id}")
    assert get_response.status_code == 200

    get_data = get_response.json()
    assert "workout" in get_data
    assert get_data["workout"]["id"] == workout_id


def test_workout_structure_integrity():
    create_response = client.post("/api/workouts", json=test_data["workout"])
    workout_data = create_response.json()["workout"]
    
    assert "exercises" in workout_data
    assert "user_id" in workout_data
    assert len(workout_data["exercises"]) == 3
    
    first_exercise = workout_data["exercises"][0]
    assert "sets" in first_exercise
    assert "exercise_number" in first_exercise
    assert len(first_exercise["sets"]) == 3
    
    first_set = first_exercise["sets"][0]
    assert "exercise_name" in first_set
    assert first_set["exercise_name"] == "Bench Press"
    assert "sub_sets" in first_set
    assert "set_number" in first_set
    assert len(first_set["sub_sets"]) == 1
    
    first_subset = first_set["sub_sets"][0]
    assert "reps" in first_subset
    assert "weight" in first_subset
    assert "subset_number" in first_subset
    assert first_subset["reps"] == 10
    assert first_subset["weight"] == 80.0
    assert first_subset["subset_number"] == 1


def test_create_exercise_for_existing_workout():
    create_response = client.post("/api/workouts", json=test_data["workout"])
    workout_id = create_response.json()["workout"]["id"]
    
    new_exercise = {
        "exercise_number": 1,
        "sets": [
            {
                "set_number": 1,
                "exercise_name": "Deadlifts",
                "sub_sets": [
                    {"reps": 5, "weight": 140.0, "subset_number": 1}
                ]
            }
        ]
    }

    exercise_response = client.post(f"/api/workouts/{workout_id}/exercises", json=new_exercise)
    assert exercise_response.status_code == 200

    exercise_data = exercise_response.json()
    assert "exercise" in exercise_data
    assert "id" in exercise_data["exercise"]


def test_create_exercise_for_nonexistent_workout():
    new_exercise = {
        "exercise_number": 1,
        "sets": [
            {
                "set_number": 1,
                "exercise_name": "Deadlifts",
                "sub_sets": [
                    {"reps": 5, "weight": 140.0, "subset_number": 1}
                ]
            }
        ]
    }

    response = client.post("/api/workouts/999999/exercises", json=new_exercise)
    assert response.status_code == 404
    assert "Workout not found" in response.json()["detail"]


def test_get_individual_exercise():
    create_response = client.post("/api/workouts", json=test_data["workout"])
    workout_data = create_response.json()["workout"]
    exercise_id = workout_data["exercises"][0]["id"]

    exercise_response = client.get(f"/api/exercises/{exercise_id}")
    assert exercise_response.status_code == 200

    exercise_data = exercise_response.json()
    assert "exercise" in exercise_data
    assert exercise_data["exercise"]["id"] == exercise_id

def test_get_nonexistent_exercise():
    response = client.get("/api/exercises/999999")
    assert response.status_code == 404
    assert "Exercise not found" in response.json()["detail"]


def test_create_set_for_existing_exercise():
    create_response = client.post("/api/workouts", json=test_data["workout"])
    workout_data = create_response.json()["workout"]
    workout_id = workout_data["id"]
    exercise_id = workout_data["exercises"][0]["id"]
    
    new_set = {
        "set_number" : 1,
        "exercise_name": "Bench Press",
        "sub_sets": [
            {"reps": 12, "weight": 75.0, "subset_number": 1}
        ]
    }
    
    set_response = client.post(f"/api/workouts/{workout_id}/exercises/{exercise_id}/sets", json=new_set)
    assert set_response.status_code == 200
    
    set_data = set_response.json()
    assert "set" in set_data
    assert "id" in set_data["set"]


def test_create_set_for_nonexistent_exercise():
    new_set = {
        "set_number": 1,
        "exercise_name": "Bench Press",
        "sub_sets": [
            {"reps": 12, "weight": 75.0}
        ]
    }

    response = client.post("/api/workouts/999999/exercises/999999/sets", json=new_set)
    assert response.status_code == 404
    assert "Exercise not found" in response.json()["detail"]


def test_get_individual_set():
    create_response = client.post("/api/workouts", json=test_data["workout"])
    workout_data = create_response.json()["workout"]
    set_id = workout_data["exercises"][0]["sets"][0]["id"]
    
    set_response = client.get(f"/api/sets/{set_id}")
    assert set_response.status_code == 200
    
    set_data = set_response.json()
    assert "set" in set_data
    assert set_data["set"]["id"] == set_id


def test_get_nonexistent_set():
    response = client.get("/api/sets/999999")
    assert response.status_code == 404
    assert "Set not found" in response.json()["detail"]


def test_create_subset_for_existing_set():
    create_response = client.post("/api/workouts", json=test_data["workout"])
    workout_data = create_response.json()["workout"]
    workout_id = workout_data["id"]
    exercise_id = workout_data["exercises"][0]["id"]
    set_id = workout_data["exercises"][0]["sets"][0]["id"]

    new_subset = {"reps": 15, "weight": 70.0, "subset_number": 1}

    subset_response = client.post(f"/api/workouts/{workout_id}/exercises/{exercise_id}/sets/{set_id}/subset", json=new_subset)
    assert subset_response.status_code == 200

    subset_data = subset_response.json()
    assert "subset" in subset_data
    assert "id" in subset_data["subset"]


def test_get_individual_subset():
    create_response = client.post("/api/workouts", json=test_data["workout"])
    workout_data = create_response.json()["workout"]
    subset_id = workout_data["exercises"][0]["sets"][0]["sub_sets"][0]["id"]
    
    subset_response = client.get(f"/api/subsets/{subset_id}")
    assert subset_response.status_code == 200
    
    subset_data = subset_response.json()
    assert "subset" in subset_data
    assert subset_data["subset"]["id"] == subset_id


def test_get_nonexistent_subset():
    response = client.get("/api/subsets/999999")
    assert response.status_code == 404
    assert "Subset not found" in response.json()["detail"]


def test_get_all_workouts_after_creation():
    client.post("/api/workouts", json=test_data["workout"])
    
    response = client.get("/api/workouts")
    assert response.status_code == 200
    
    data = response.json()
    assert "workouts" in data
    assert len(data["workouts"]) >= 1
