// ------------ Subsets ------------

export type SubsetBase = {
  subset_number: number,
  reps: number,
  weight: number
}

export type Subset = SubsetBase & {
  id: number,
  set_id: number
}

export type SubsetCreate = SubsetBase & {
  set_id: number
}

// ------------ Sets ------------

export type SetBase = {
  created_at: string,
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
  created_at: string,
  exercise_number: number,
  sets: SetBase[]
}

export type Exercise = Omit<ExerciseBase, 'sets'> & {
  sets: Set[],
  id: number,
  workout_id: number
}

export type ExerciseCreate = ExerciseBase & {
  workout_id: number
}
// ------------ Workouts ------------

export type WorkoutBase = {
  created_at: string,
  type: string,
  exercises: ExerciseBase[]
}

export type Workout = Omit<WorkoutBase, 'exercises'> & {
  exercises: Exercise[],
  id: number,
  user_id: number
}

export type WorkoutCreate = WorkoutBase & {
  user_id: number
}
