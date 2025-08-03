import { workoutsAPI } from "@/api"
import type { Workout, WorkoutCreate, ExerciseCreate, SetCreate, SubsetCreate } from "@/types"
import { test, expect, describe } from "vitest"
import workoutData from '../data/workout.json'

describe("Workout API Integration", () => {
  test("can fetch all workouts", async () => {
    const workouts = await workoutsAPI.getWorkouts();
    expect(workouts).toBeDefined();
    expect(Array.isArray(workouts)).toBeTruthy();

    for (let i = 0; i < workouts.length; i++) {
      expect(typeof workouts[i].id).toBe("number");
      expect(typeof workouts[i].user_id).toBe("number");
      expect(Array.isArray(workouts[i].exercises)).toBeTruthy();
    };
  });

  test("can create new workout", async () => {
    const newWorkout: WorkoutCreate = workoutData.workout;
    const workout = await workoutsAPI.createWorkout(newWorkout);

    expect(typeof workout.id).toBe("number");
    expect(workout.user_id).toEqual(newWorkout.user_id);
    expect(workout.exercises.length).toBe(newWorkout.exercises.length);

    for (let i = 0; i < workout.exercises.length; i++) {
      const returnedExercise = workout.exercises[i];
      const expectedExercise = newWorkout.exercises[i];

      expect(returnedExercise.exercise_number).toBe(expectedExercise.exercise_number);
      expect(returnedExercise.sets.length).toBe(expectedExercise.sets.length);

      for (let j = 0; j < returnedExercise.sets.length; j++) {
        const returnedSet = returnedExercise.sets[j];
        const expectedSet = expectedExercise.sets[j];

        expect(returnedSet.set_number).toBe(expectedSet.set_number);
        expect(returnedSet.exercise_name).toBe(expectedSet.exercise_name);
        expect(returnedSet.subsets.length).toBe(expectedSet.subsets.length);

        for (let k = 0; k < returnedSet.subsets.length; k++) {
          const returnedSubset = returnedSet.subsets[k];
          const expectedSubset = expectedSet.subsets[k];

          expect(returnedSubset.reps).toBe(expectedSubset.reps);
          expect(returnedSubset.weight).toBe(expectedSubset.weight);
          expect(returnedSubset.subset_number).toBe(expectedSubset.subset_number);
        }
      }
    }
  });

});


describe("Exercise API Integration", () => {

  test("can create new exercise", async () => {
    const workout: Workout = (globalThis as any).TEST_WORKOUT;
    const workout_id = workout.id
    const newExercise: ExerciseCreate = { ...workoutData.workout.exercises[0], workout_id: workout_id };
    const exercise = await workoutsAPI.createExercise(newExercise);

    expect(typeof exercise.id).toBe("number");
    expect(exercise.workout_id).toEqual(workout_id);
    expect(exercise.sets.length).toBe(newExercise.sets.length);

    for (let i = 0; i < exercise.sets.length; i++) {
      const returnedSet = exercise.sets[i];
      const expectedSet = newExercise.sets[i];

      expect(returnedSet.set_number).toBe(expectedSet.set_number);
      expect(returnedSet.exercise_name).toBe(expectedSet.exercise_name);
      expect(returnedSet.subsets.length).toBe(expectedSet.subsets.length);

      for (let j = 0; j < returnedSet.subsets.length; j++) {
        const returnedSubset = returnedSet.subsets[j];
        const expectedSubset = expectedSet.subsets[j];

        expect(returnedSubset.reps).toBe(expectedSubset.reps);
        expect(returnedSubset.weight).toBe(expectedSubset.weight);
        expect(returnedSubset.subset_number).toBe(expectedSubset.subset_number);
      }
    }
  });

});


describe("Set API Integration", () => {

  test("can create new set", async () => {
    const workout: Workout = (globalThis as any).TEST_WORKOUT;
    const exercise_id = workout.exercises[0].id;
    const newSet: SetCreate = { ...workoutData.workout.exercises[0].sets[0], exercise_id: exercise_id };
    const set = await workoutsAPI.createSet(newSet);

    expect(typeof set.id).toBe("number");
    expect(set.exercise_id).toEqual(exercise_id);
    expect(set.subsets.length).toBe(set.subsets.length);

    for (let i = 0; i < set.subsets.length; i++) {
      const returnedSubset = set.subsets[i];
      const expectedSubset = newSet.subsets[i];

      expect(returnedSubset.reps).toBe(expectedSubset.reps);
      expect(returnedSubset.weight).toBe(expectedSubset.weight);
      expect(returnedSubset.subset_number).toBe(expectedSubset.subset_number);
    }
  });

});


describe("Subset API Integration", () => {

  test("can create new Subset", async () => {
    const workout: Workout = (globalThis as any).TEST_WORKOUT;
    const set_id = workout.exercises[0].sets[0].id;
    const newSubset: SubsetCreate = { ...workoutData.workout.exercises[0].sets[0].subsets[0], set_id: set_id };
    const subset = await workoutsAPI.createSubset(newSubset);

    expect(typeof subset.id).toBe("number");
    expect(subset.set_id).toEqual(set_id);
    expect(subset.reps).toBe(newSubset.reps);
    expect(subset.weight).toBe(newSubset.weight);
    expect(subset.subset_number).toBe(newSubset.subset_number);
  });

});
