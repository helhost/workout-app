import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { usersAPI, workoutsAPI } from "@/api";
import { connectWS, disconnectWS } from "@/ws-client";
import type { Workout, User } from "@/types";
import workoutData from "../data/workout.json";

describe("Users websockets", () => {
  beforeAll(async () => {
    await connectWS();
  });

  afterAll(() => {
    disconnectWS();
  });

  test("receives update when subset is created", async () => {
    const user: User = (globalThis as any).TEST_USER;
    const workout: Workout = (globalThis as any).TEST_WORKOUT;

    const message = new Promise((resolve) => {
      usersAPI.subscribeToUser(user.id, (payload) => resolve(payload));
    });

    const set = workout.exercises[0].sets[0];
    await workoutsAPI.createSubset({
      ...workoutData.workout.exercises[0].sets[0].subsets[0],
      set_id: set.id,
    });
    const payload = await message;
    expect(payload).toBeDefined();
  });
});
