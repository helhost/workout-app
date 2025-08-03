import { beforeAll } from "vitest";
import { usersAPI, workoutsAPI } from "@/api";
import type { WorkoutCreate } from "@/types"
import workoutData from './data/workout.json'

beforeAll(async () => {
  const user = await usersAPI.createUser({ name: "Test User" });
  const newWorkout: WorkoutCreate = workoutData.workout;
  newWorkout.user_id = user.id

  const workout = await workoutsAPI.createWorkout(newWorkout);

  (globalThis as any).TEST_USER = user;
  (globalThis as any).TEST_WORKOUT = workout;
});
