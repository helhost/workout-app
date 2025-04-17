import { PrismaTypes } from ".";

export namespace Workout {
    export type MuscleGroup = PrismaTypes.MuscleGroup;

    export type DropsetSubSet = Omit<PrismaTypes.DropsetSubSet, 'id' | 'dropsetId' | 'createdAt' | 'updatedAt'>;

    export type Dropset = Omit<PrismaTypes.Dropset, 'id' | 'exerciseId' | 'createdAt' | 'updatedAt'> & {
        subSets: DropsetSubSet[];
    };

    export type ExerciseSet = Omit<PrismaTypes.ExerciseSet, 'id' | 'exerciseId' | 'createdAt' | 'updatedAt'>;

    export type Exercise = Omit<PrismaTypes.Exercise, 'workoutId' | 'supersetId' | 'createdAt' | 'updatedAt'> & {
        sets: ExerciseSet[];
        dropsets: Dropset[];
        type: 'exercise';
    };

    export type Superset = Omit<PrismaTypes.Superset, 'workoutId' | 'createdAt' | 'updatedAt'> & {
        exercises: Exercise[];
        type: 'superset';
    };

    export type WorkoutItem = Exercise | Superset;

    export type WorkoutFull = Omit<PrismaTypes.Workout, 'userId' | 'createdAt' | 'updatedAt'> & {
        items: WorkoutItem[];
    };

    export type WorkoutSummary = Pick<PrismaTypes.Workout, 'id' | 'name' | 'createdAt' | 'completed'> & {
        duration?: number;
        exerciseCount?: number;
        setCount?: number;
        totalVolume?: number;
    };

    export type BaseWorkout = PrismaTypes.Workout;

    // Input types for creating and updating entities
    export type SupersetData = {
        notes?: string;
        order: number;
    };

    export type ExerciseData = {
        name: string;
        muscleGroup: MuscleGroup;
        notes?: string;
        order: number;
    };

    export type DropsetData = {
        notes?: string;
        order: number;
        subSets: DropsetSubSet[];
    };
}