from pydantic import BaseModel, ConfigDict
from typing import List
from datetime import datetime

# ---------- Subset ----------
class SubsetData(BaseModel):
    reps: int
    subset_number: int
    weight: float

    model_config = ConfigDict(from_attributes = True)

class SubsetCreate(SubsetData):
    set_id: int

class SubsetRead(SubsetData):
    id: int
    set_id: int
    created_at: datetime

# ---------- Set ----------
class SetData(BaseModel):
    exercise_name: str
    set_number: int
    subsets: List[SubsetData] = []

    model_config = ConfigDict(from_attributes = True)

class SetCreate(SetData):
    exercise_id: int

class SetRead(BaseModel):
    id: int
    exercise_id: int
    exercise_name: str
    set_number: int
    created_at: datetime
    subsets: List[SubsetRead] = []
    model_config = ConfigDict(from_attributes=True)


# ---------- Exercise ----------
class ExerciseData(BaseModel):
    exercise_number: int
    sets: List[SetData] = []

    model_config = ConfigDict(from_attributes = True)

class ExerciseCreate(ExerciseData):
    workout_id: int

class ExerciseRead(BaseModel):
    id: int
    workout_id: int
    exercise_number: int
    created_at: datetime
    sets: List[SetRead] = []
    model_config = ConfigDict(from_attributes=True)

# ---------- Workout ----------
class WorkoutData(BaseModel):
    user_id: int
    exercises: List[ExerciseData] = []

    model_config = ConfigDict(from_attributes = True)

WorkoutCreate = WorkoutData

class WorkoutRead(BaseModel):
    id: int
    user_id: int
    created_at: datetime
    exercises: List[ExerciseRead] = []
    model_config = ConfigDict(from_attributes=True)
