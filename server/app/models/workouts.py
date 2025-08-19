from pydantic import BaseModel, ConfigDict, Field
from typing import List, Literal
from datetime import datetime

# ---------- Subset ----------
class SubsetData(BaseModel):
    reps: int
    subset_number: int
    weight: float

    model_config = ConfigDict(from_attributes=True)


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
    subsets: List[SubsetData] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


class SetCreate(SetData):
    exercise_id: int


class SetRead(BaseModel):
    id: int
    exercise_id: int
    exercise_name: str
    set_number: int
    created_at: datetime
    subsets: List[SubsetRead] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


# ---------- Exercise ----------
class ExerciseData(BaseModel):
    exercise_number: int
    sets: List[SetData] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


class ExerciseCreate(ExerciseData):
    workout_id: int


class ExerciseRead(BaseModel):
    id: int
    workout_id: int
    exercise_number: int
    created_at: datetime
    sets: List[SetRead] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


# ---------- Workout ----------
WorkoutTypes = Literal[
    "Back",
    "Chest",
    "Legs",
    "Arms",
    "Shoulders",
    "Full Body",
    "Cardio",
    "Other"
]


class WorkoutData(BaseModel):
    user_id: int
    exercises: List[ExerciseData] = Field(default_factory=list)
    type: WorkoutTypes    # e.g., Back, Chest, etc.

    model_config = ConfigDict(from_attributes=True)


WorkoutCreate = WorkoutData


class WorkoutRead(BaseModel):
    id: int
    user_id: int
    created_at: datetime
    type: WorkoutTypes = Field(validation_alias="workout_type")
    exercises: List[ExerciseRead] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


class WorkoutSummary(BaseModel):
    user_id: int
    type: WorkoutTypes = Field(validation_alias="workout_type")
    total_exercises: int
    total_sets: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
