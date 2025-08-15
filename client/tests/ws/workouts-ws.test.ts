import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { workoutsAPI } from "@/api";
import { connectWS, disconnectWS } from "@/ws-client";
import type { Workout, Exercise, Set } from "@/types";
import workoutData from "../data/workout.json";

describe("Workouts websockets", () => {
  beforeAll(async () => {
    await connectWS();
  });

  afterAll(() => {
    disconnectWS();
  });

  test("workout subscription receives update when exercise is created", async () => {
    const workout: Workout = (globalThis as any).TEST_WORKOUT;

    const message = new Promise((resolve) => {
      workoutsAPI.subscribeToWorkout(workout.id, (payload) => resolve(payload));
    });

    // create an exercise under this workout to trigger the WS event
    await workoutsAPI.createExercise({
      ...workoutData.workout.exercises[0],
      workout_id: workout.id,
    });

    const payload = await message;
    expect(payload).toBeDefined();
  });

  test("exercise subscription receives update when set is created", async () => {
    const exercise: Exercise = (globalThis as any).TEST_WORKOUT.exercises[0];

    const message = new Promise((resolve) => {
      workoutsAPI.subscribeToExercise(exercise.id, (payload) => resolve(payload));
    });

    // create a set under this exercise to trigger the WS event
    await workoutsAPI.createSet({
      ...workoutData.workout.exercises[0].sets[0],
      exercise_id: exercise.id,
    });

    const payload = await message;
    expect(payload).toBeDefined();
  });

  test("set subscription receives update when subset is created", async () => {
    const set: Set = (globalThis as any).TEST_WORKOUT.exercises[0].sets[0];

    const message = new Promise((resolve) => {
      workoutsAPI.subscribeToSet(set.id, (payload) => resolve(payload));
    });

    // create a subset under this set to trigger the WS event
    await workoutsAPI.createSubset({
      ...workoutData.workout.exercises[0].sets[0].subsets[0],
      set_id: set.id,
    });

    const payload = await message;
    expect(payload).toBeDefined();
  });
});
