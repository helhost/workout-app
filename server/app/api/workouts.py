from fastapi import APIRouter, Depends, HTTPException
from database import get_db
from sqlalchemy.orm import Session
from models.workouts import Workout, Exercise, Set, Subset
from pydantic import BaseModel
from typing import List

from sqlalchemy.orm import joinedload

router = APIRouter()


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

class SetCreate(SetData):
    exercise_id: int

class ExerciseCreate(ExerciseData):
    workout_id: int

WorkoutCreate = WorkoutData

# Get requests
@router.get("/workouts")
def get_workouts(db: Session = Depends(get_db)):
    workouts = db.query(Workout).options(
        joinedload(Workout.exercises).joinedload(Exercise.sets).joinedload(Set.sub_sets)
    ).all()
    return {"workouts":workouts}

@router.get("/workouts/{id}")
def get_workout(id:int, db: Session = Depends(get_db)):
    workout = db.query(Workout).options(
        joinedload(Workout.exercises).joinedload(Exercise.sets).joinedload(Set.sub_sets)
    ).filter(Workout.id == id).first()

    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    return {"workout": workout}

@router.get("/exercises/{id}")
def get_exercise(id:int, db: Session = Depends(get_db)):
    exercise = db.query(Exercise).options(
        joinedload(Exercise.sets).joinedload(Set.sub_sets)
    ).filter(Exercise.id == id).first()

    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")
    return {"exercise": exercise}

@router.get("/sets/{id}")
def get_set(id:int, db: Session = Depends(get_db)):
    exercise_set = db.query(Set).options(
        joinedload(Set.sub_sets)
    ).filter(Set.id == id).first()

    if not exercise_set:
        raise HTTPException(status_code=404, detail="Set not found")
    return {"set": exercise_set}

@router.get("/subsets/{id}")
def get_subset(id:int, db: Session = Depends(get_db)):
    subset = db.get(Subset,id)
    if not subset:
        raise HTTPException(status_code=404, detail="Subset not found")
    return {"subset": subset}


# Post requests
@router.post("/workouts")
def create_workout(workout: WorkoutCreate, db: Session = Depends(get_db)):
    new_workout = Workout(
        user_id = workout.user_id,
        exercises = [
            Exercise(
                exercise_number = ex.exercise_number,
                sets = [
                    Set(
                        exercise_name = set_data.exercise_name,
                        set_number = set_data.set_number,
                        sub_sets = [
                            Subset(reps = ss.reps, weight = ss.weight, subset_number=ss.subset_number)
                            for ss in set_data.sub_sets
                        ]
                    )
                    for set_data in ex.sets
                ]
            )
            for ex in workout.exercises
        ]
    )

    db.add(new_workout)
    db.commit()
    db.refresh(new_workout)
    
    workout_with_relations = db.query(Workout).options(
        joinedload(Workout.exercises).joinedload(Exercise.sets).joinedload(Set.sub_sets)
    ).filter(Workout.id == new_workout.id).first()

    return {"workout": workout_with_relations}

@router.post("/exercises")
def create_exercise(exercise: ExerciseCreate, db : Session = Depends(get_db)):
    workout = db.get(Workout,exercise.workout_id)
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")

    new_exercise = Exercise(
        workout_id = exercise.workout_id,
        exercise_number = exercise.exercise_number,
        sets = [
            Set(
                exercise_name = set_data.exercise_name,
                set_number = set_data.set_number,
                sub_sets = [
                    Subset(reps = ss.reps, weight = ss.weight, subset_number= ss.subset_number)
                    for ss in set_data.sub_sets
                ]
            )
            for set_data in exercise.sets
        ]
    )

    db.add(new_exercise)
    db.commit()
    db.refresh(new_exercise)

    exercise_with_relations = db.query(Exercise).options(
        joinedload(Exercise.sets).joinedload(Set.sub_sets)
    ).filter(Exercise.id == new_exercise.id).first()

    return {"exercise": exercise_with_relations}

@router.post("/sets")
def create_set(set_data: SetCreate, db: Session = Depends(get_db)):
    exercise = db.get(Exercise, set_data.exercise_id)
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")

    new_set = Set(
        exercise_id = set_data.exercise_id,
        exercise_name = set_data.exercise_name,
        set_number = set_data.set_number,
        sub_sets = [
            Subset(reps = ss.reps, weight = ss.weight, subset_number = ss.subset_number)
            for ss in set_data.sub_sets
        ]
    )

    db.add(new_set)
    db.commit()
    db.refresh(new_set)

    set_with_relations = db.query(Set).options(
        joinedload(Set.sub_sets)
    ).filter(Set.id == new_set.id).first()

    return {"set": set_with_relations}

@router.post("/subsets")
def create_subset(subset: SubsetCreate, db: Session = Depends(get_db)):
    set_data = db.get(Set, subset.set_id)
    if not set_data:
        raise HTTPException(status_code=404, detail="Set not found")

    sub_set = Subset(reps = subset.reps, weight = subset.weight, set_id=subset.set_id, subset_number = subset.subset_number)

    db.add(sub_set)
    db.commit()
    db.refresh(sub_set)
    return {"subset": sub_set}

