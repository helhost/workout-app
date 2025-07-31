from fastapi import APIRouter, Depends, HTTPException
from database import get_db
from sqlalchemy.orm import Session
from schemas.workouts import Workout, Exercise, Set, Subset
from models.workouts import WorkoutCreate, ExerciseCreate, SetCreate, SubsetCreate
from sqlalchemy.orm import joinedload
from ws_manager import websocket_manager
from api.util import get_all_parents
router = APIRouter()



# Get requests
@router.get("/workouts")
def get_workouts(db: Session = Depends(get_db)):
    workouts = db.query(Workout).options(
        joinedload(Workout.exercises).joinedload(Exercise.sets).joinedload(Set.sub_sets)
    ).all()
    return workouts

@router.get("/workouts/{id}")
def get_workout(id:int, db: Session = Depends(get_db)):
    workout = db.query(Workout).options(
        joinedload(Workout.exercises).joinedload(Exercise.sets).joinedload(Set.sub_sets)
    ).filter(Workout.id == id).first()

    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    return workout

@router.get("/exercises/{id}")
def get_exercise(id:int, db: Session = Depends(get_db)):
    exercise = db.query(Exercise).options(
        joinedload(Exercise.sets).joinedload(Set.sub_sets)
    ).filter(Exercise.id == id).first()

    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")
    return exercise

@router.get("/sets/{id}")
def get_set(id:int, db: Session = Depends(get_db)):
    exercise_set = db.query(Set).options(
        joinedload(Set.sub_sets)
    ).filter(Set.id == id).first()

    if not exercise_set:
        raise HTTPException(status_code=404, detail="Set not found")
    return exercise_set

@router.get("/subsets/{id}")
def get_subset(id:int, db: Session = Depends(get_db)):
    subset = db.get(Subset,id)
    if not subset:
        raise HTTPException(status_code=404, detail="Subset not found")
    return subset


# Post requests
@router.post("/workouts")
async def create_workout(workout: WorkoutCreate, db: Session = Depends(get_db)):
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

    resources = get_all_parents(db=db, child_type="workouts", child_id=getattr(new_workout, "id"), result=[])
    print(f"resources{resources}")
    for resource in resources:
        await websocket_manager.broadcast(
            resource=resource,
            data={
                "type":"workout_created",
                "data": WorkoutCreate.model_validate(workout_with_relations, from_attributes=True).model_dump(mode="json")
          }
        )

    return workout_with_relations

@router.post("/exercises")
async def create_exercise(exercise: ExerciseCreate, db : Session = Depends(get_db)):
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

    resources = get_all_parents(db=db, child_type="exercises", child_id=getattr(new_exercise, "id"), result=[])
    print(f"resources{resources}")
    for resource in resources:
        await websocket_manager.broadcast(
            resource=resource,
            data={
                "type":"exercise_created",
                "data": ExerciseCreate.model_validate(exercise_with_relations, from_attributes=True).model_dump(mode="json")
          }
        )

    return exercise_with_relations

@router.post("/sets")
async def create_set(set_data: SetCreate, db: Session = Depends(get_db)):
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

    resources = get_all_parents(db=db, child_type="sets", child_id=getattr(new_set, "id"), result=[])
    print(f"resources{resources}")
    for resource in resources:
        await websocket_manager.broadcast(
            resource=resource,
            data={
                "type":"set_created",
                "data": SetCreate.model_validate(set_with_relations, from_attributes=True).model_dump(mode="json")
          }
        )
    return set_with_relations

@router.post("/subsets")
async def create_subset(subset: SubsetCreate, db: Session = Depends(get_db)):
    set_data = db.get(Set, subset.set_id)
    if not set_data:
        raise HTTPException(status_code=404, detail="Set not found")

    sub_set = Subset(reps = subset.reps, weight = subset.weight, set_id=subset.set_id, subset_number = subset.subset_number)

    db.add(sub_set)
    db.commit()
    db.refresh(sub_set)

    resources = get_all_parents(db=db, child_type="sub_sets", child_id=getattr(sub_set, "id"), result=[])
    print(f"resources{resources}")
    for resource in resources:
        await websocket_manager.broadcast(
            resource=resource,
            data={
                "type":"subset_created",
                "data": SubsetCreate.model_validate(sub_set, from_attributes=True).model_dump(mode="json")
          }
        )
    return sub_set
