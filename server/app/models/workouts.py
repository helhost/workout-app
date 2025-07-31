from pydantic import BaseModel
from typing import List

# ------------------------------------
# ----------- Subset -----------------
# ------------------------------------

class SubsetData(BaseModel):
    reps: int
    subset_number: int
    weight: float

class SubsetCreate(SubsetData):
    set_id: int


# ------------------------------------
# ------------- Set ------------------
# ------------------------------------


class SetData(BaseModel):
    exercise_name: str
    set_number: int
    sub_sets: List[SubsetData] = []

class SetCreate(SetData):
    exercise_id: int

# ------------------------------------
# ----------- Exercise ---------------
# ------------------------------------



class ExerciseData(BaseModel):
    exercise_number: int
    sets: List[SetData] = []

class ExerciseCreate(ExerciseData):
    workout_id: int

# ------------------------------------
# ----------- Workout ----------------
# ------------------------------------


class WorkoutData(BaseModel):
    user_id: int
    exercises: List[ExerciseData] = []

class WorkoutCreate(WorkoutData):
    class Config:
        from_attributes=True
