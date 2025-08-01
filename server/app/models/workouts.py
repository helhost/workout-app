from pydantic import BaseModel
from typing import List

# ---------- Subset ----------
class SubsetData(BaseModel):
    reps: int
    subset_number: int
    weight: float

    class Config:
        from_attributes = True

class SubsetCreate(SubsetData):
    set_id: int


# ---------- Set ----------
class SetData(BaseModel):
    exercise_name: str
    set_number: int
    subsets: List[SubsetData] = []

    class Config:
        from_attributes = True

class SetCreate(SetData):
    exercise_id: int


# ---------- Exercise ----------
class ExerciseData(BaseModel):
    exercise_number: int
    sets: List[SetData] = []

    class Config:
        from_attributes = True

class ExerciseCreate(ExerciseData):
    workout_id: int


# ---------- Workout ----------
class WorkoutData(BaseModel):
    user_id: int
    exercises: List[ExerciseData] = []

    class Config:
        from_attributes = True

WorkoutCreate = WorkoutData
