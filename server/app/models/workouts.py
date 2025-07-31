from pydantic import BaseModel
from typing import List

class SubsetData(BaseModel):
    reps: int
    subset_number: int
    weight: float

class SetData(BaseModel):
    exercise_name: str
    set_number: int
    sub_sets: List[SubsetData] = []

class ExerciseData(BaseModel):
    exercise_number: int
    sets: List[SetData] = []

class WorkoutData(BaseModel):
    user_id: int
    exercises: List[ExerciseData] = []

class SubsetCreate(SubsetData):
    set_id: int

    class Config:
        from_attributes=True

class SetCreate(SetData):
    exercise_id: int

    class Config:
        from_attributes=True

class ExerciseCreate(ExerciseData):
    workout_id: int

    class Config:
        from_attributes=True

class WorkoutCreate(WorkoutData):
    class Config:
        from_attributes=True
