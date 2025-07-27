from typing import List, Tuple, Dict, Type
from sqlalchemy.orm import Session
from schemas.workouts import Workout, Exercise, Set, Subset
from schemas.users import User

AnyModel = User | Workout | Exercise | Set | Subset

def get_data(db: Session, id: int, model:AnyModel) -> AnyModel:
    return db.get(model, id)

model_map: Dict[str, Tuple[str,Type[AnyModel]]]= {
    "sub_sets": ("subset_id", Subset),
    "sets": ("set_id", Set),
    "exercises": ("exercise_id", Exercise),
    "workouts": ("workout_id", Workout),
    "users" : ("user_id", User)
}

parent_map = {
    "sub_sets": "sets",
    "sets": "exercises",
    "exercises": "workouts",
    "workouts": "users"
}

def get_all_parents(db: Session, child_type: str, child_id: int, result: List[str]) -> List[str]: # ["exercise:1", "workout:1"]

    result.append(f"{child_type}:{child_id}")

    if child_type not in parent_map:
        return result

    parent_type = parent_map[child_type]

    # get parent id
    _, model = model_map[child_type]
    relation, _ = model_map[parent_type]
    response = get_data(db, child_id, model)

    if response is None:
        raise RuntimeError("Unexpected error")

    parent_id = getattr(response, relation)

    return get_all_parents(db=db, child_type=parent_type, child_id=parent_id, result=result)
