import { HttpClient } from "../http-client"
import type {
  Workout, WorkoutCreate,
  Exercise, ExerciseCreate,
  Set, SetCreate,
  Subset, SubsetCreate,
  ClientConfig
}
  from "@/types"


class WorkoutsAPI {
  private client: HttpClient

  constructor(config: ClientConfig) {
    this.client = new HttpClient(config)
  };

  // ------------ GET ------------

  public async getWorkouts() {
    return this.client.get<Workout[]>("/workouts")
  };

  public async getExercises(workout_id: number) {
    return this.client.get<Exercise[]>(`/exercises/${workout_id}`)
  };

  public async getSets(exercise_id: number) {
    return this.client.get<Set[]>(`/sets/${exercise_id}`)
  };

  public async getSubsets(set_id: number) {
    return this.client.get<Subset[]>(`/subsets/${set_id}`)
  };


  // ------------ POST ------------

  public async createWorkout(data: WorkoutCreate) {
    return this.client.post<Workout>("/workouts", data)
  };

  public async createExercise(data: ExerciseCreate) {
    return this.client.post<Exercise>("/exercises", data)
  };

  public async createSet(data: SetCreate) {
    return this.client.post<Set>("/sets", data)
  };

  public async createSubset(data: SubsetCreate) {
    return this.client.post<Subset>("/subsets", data)
  };

};

const workoutsAPI = new WorkoutsAPI({ baseURL: `${import.meta.env.VITE_API_URL}/api` })
export default workoutsAPI
