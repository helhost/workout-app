// ------------ Subsets ------------

export type SubsetBase = {
  subset_number: number,
  reps: number,
  weight: number
}

export type Subset = SubsetBase & {
  created_at: string,
  id: number,
  set_id: number
}

export type SubsetCreate = SubsetBase & {
  set_id: number
}

// ------------ Sets ------------

export type SetBase = {
  set_number: number,
  exercise_name: string,
  subsets: SubsetBase[]
}

export type Set = Omit<SetBase, 'subsets'> & {
  created_at: string,
  subsets: Subset[],
  id: number,
  exercise_id: number
}

export type SetCreate = SetBase & {
  exercise_id: number
}

// ------------ Exercises ------------

export type ExerciseBase = {
  exercise_number: number,
  sets: SetBase[]
}

export type Exercise = Omit<ExerciseBase, 'sets'> & {
  created_at: string,
  name: string,
  sets: Set[],
  id: number,
  workout_id: number
}

export type ExerciseCreate = ExerciseBase & {
  workout_id: number
}
// ------------ Workouts ------------

export type WorkoutBase = {
  type: string,
  exercises: ExerciseBase[]
}

export type Workout = Omit<WorkoutBase, 'exercises'> & {
  created_at: string,
  exercises: Exercise[],
  id: number,
  user_id: number
}

export type WorkoutCreate = WorkoutBase & {
  user_id: number
}

export type WorkoutTypes =
  | "Back"
  | "Chest"
  | "Legs"
  | "Arms"
  | "Shoulders"
  | "Full Body"
  | "Cardio"
  | "Other";

export type WorkoutSummary = {
  workout_id: number
  user_id: number
  type: WorkoutTypes
  total_exercises: number
  total_sets: number
  created_at: string
}
