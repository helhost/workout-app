import { Workout } from '../types';

// Sample workout data for development and testing
export const sampleWorkouts: Workout[] = [
    {
        id: 'workout-1',
        name: 'Full Body Strength',
        date: '2025-03-25T08:00:00Z',
        completed: true,
        duration: 65,
        notes: 'Felt strong today. Increased weight on squats.',
        exercises: [
            {
                id: 'ex-1-1',
                name: 'Barbell Squat',
                muscleGroup: 'legs',
                sets: [
                    { id: 'set-1-1-1', weight: 135, reps: 10, completed: true },
                    { id: 'set-1-1-2', weight: 155, reps: 8, completed: true },
                    { id: 'set-1-1-3', weight: 175, reps: 6, completed: true },
                ],
                restTimeSec: 120,
            },
            {
                id: 'ex-1-2',
                name: 'Bench Press',
                muscleGroup: 'chest',
                sets: [
                    { id: 'set-1-2-1', weight: 115, reps: 10, completed: true },
                    { id: 'set-1-2-2', weight: 135, reps: 8, completed: true },
                    { id: 'set-1-2-3', weight: 155, reps: 5, completed: true },
                ],
                restTimeSec: 90,
            },
        ],
    },
    {
        id: 'workout-2',
        name: 'Upper Body Focus',
        date: '2025-03-27T17:30:00Z',
        completed: true,
        duration: 50,
        exercises: [
            {
                id: 'ex-2-1',
                name: 'Pull-ups',
                muscleGroup: 'back',
                sets: [
                    { id: 'set-2-1-1', weight: 0, reps: 8, completed: true },
                    { id: 'set-2-1-2', weight: 0, reps: 7, completed: true },
                    { id: 'set-2-1-3', weight: 0, reps: 6, completed: true },
                ],
                restTimeSec: 90,
            },
            {
                id: 'ex-2-2',
                name: 'Overhead Press',
                muscleGroup: 'shoulders',
                sets: [
                    { id: 'set-2-2-1', weight: 75, reps: 10, completed: true },
                    { id: 'set-2-2-2', weight: 85, reps: 8, completed: true },
                    { id: 'set-2-2-3', weight: 95, reps: 6, completed: true },
                ],
                restTimeSec: 90,
            },
        ],
    },
    {
        id: 'workout-3',
        name: 'Lower Body & Core',
        date: '2025-03-29T10:00:00Z',
        completed: false,
        exercises: [
            {
                id: 'ex-3-1',
                name: 'Romanian Deadlift',
                muscleGroup: 'legs',
                sets: [
                    { id: 'set-3-1-1', weight: 135, reps: 10, completed: false },
                    { id: 'set-3-1-2', weight: 155, reps: 8, completed: false },
                    { id: 'set-3-1-3', weight: 175, reps: 6, completed: false },
                ],
                restTimeSec: 120,
            },
            {
                id: 'ex-3-2',
                name: 'Hanging Leg Raises',
                muscleGroup: 'core',
                sets: [
                    { id: 'set-3-3-1', weight: 0, reps: 15, completed: false },
                    { id: 'set-3-3-2', weight: 0, reps: 12, completed: false },
                ],
                restTimeSec: 60,
            },
        ],
    },
];

export default sampleWorkouts;