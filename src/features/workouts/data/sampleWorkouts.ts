import { Workout, SuperSet } from '../types';

// Sample workout data for development and testing
export const sampleWorkouts: Workout[] = [
    {
        id: 'workout-1',
        name: 'Full Body Strength',
        date: '2025-03-25T08:00:00Z',
        completed: true,
        duration: 65,
        notes: 'Felt strong today. Increased weight on squats.',
        items: [
            {
                id: 'ex-1-1',
                name: 'Barbell Squat',
                muscleGroup: 'legs',
                sets: [
                    { id: 'set-1-1-1', weight: 135, reps: 10, completed: true },
                    { id: 'set-1-1-2', weight: 155, reps: 8, completed: true },
                    { id: 'set-1-1-3', weight: 175, reps: 6, completed: true },
                ]
            },
            // This is a superset
            {
                id: 'ss-1-2',
                type: 'superset',
                exercises: [
                    {
                        id: 'ss-1-2-ex-1',
                        name: 'Bench Press',
                        muscleGroup: 'chest',
                        sets: [
                            { id: 'ss-1-2-ex-1-set-1', weight: 135, reps: 8, completed: true },
                            { id: 'ss-1-2-ex-1-set-2', weight: 135, reps: 8, completed: true },
                            { id: 'ss-1-2-ex-1-set-3', weight: 135, reps: 6, completed: true },
                        ],
                        notes: 'Keep chest up, shoulders back'
                    },
                    {
                        id: 'ss-1-2-ex-2',
                        name: 'Lat Pulldown',
                        muscleGroup: 'back',
                        sets: [
                            { id: 'ss-1-2-ex-2-set-1', weight: 120, reps: 10, completed: true },
                            { id: 'ss-1-2-ex-2-set-2', weight: 120, reps: 10, completed: true },
                            { id: 'ss-1-2-ex-2-set-3', weight: 130, reps: 8, completed: true },
                        ],
                        notes: 'Pull to chest, focus on squeezing back'
                    }
                ]
            } as SuperSet
        ]
    },
    {
        id: 'workout-2',
        name: 'Upper Body Focus',
        date: '2025-03-27T17:30:00Z',
        completed: true,
        duration: 50,
        items: [
            {
                id: 'ex-2-1',
                name: 'Pull-ups',
                muscleGroup: 'back',
                sets: [
                    { id: 'set-2-1-1', weight: 0, reps: 8, completed: true },
                    { id: 'set-2-1-2', weight: 0, reps: 7, completed: true },
                    { id: 'set-2-1-3', weight: 0, reps: 6, completed: true },
                ]
            },
            {
                id: 'ex-2-2',
                name: 'Overhead Press',
                muscleGroup: 'shoulders',
                sets: [
                    { id: 'set-2-2-1', weight: 75, reps: 10, completed: true },
                    { id: 'set-2-2-2', weight: 85, reps: 8, completed: true },
                    { id: 'set-2-2-3', weight: 95, reps: 6, completed: true },
                ]
            }
        ]
    },
    {
        id: 'workout-3',
        name: 'Lower Body & Core',
        date: '2025-03-29T10:00:00Z',
        completed: false,
        items: [
            {
                id: 'ex-3-1',
                name: 'Romanian Deadlift',
                muscleGroup: 'legs',
                sets: [
                    { id: 'set-3-1-1', weight: 135, reps: 10, completed: false },
                    { id: 'set-3-1-2', weight: 155, reps: 8, completed: false },
                    { id: 'set-3-1-3', weight: 175, reps: 6, completed: false },
                ]
            },
            // Another superset example
            {
                id: 'ss-3-2',
                type: 'superset',
                exercises: [
                    {
                        id: 'ss-3-2-ex-1',
                        name: 'Dumbbell Curls',
                        muscleGroup: 'biceps',
                        sets: [
                            { id: 'ss-3-2-ex-1-set-1', weight: 25, reps: 12, completed: false },
                            { id: 'ss-3-2-ex-1-set-2', weight: 25, reps: 10, completed: false }
                        ]
                    },
                    {
                        id: 'ss-3-2-ex-2',
                        name: 'Planks',
                        muscleGroup: 'core',
                        sets: [
                            { id: 'ss-3-2-ex-2-set-1', weight: 0, reps: 30, completed: false },
                            { id: 'ss-3-2-ex-2-set-2', weight: 0, reps: 30, completed: false }
                        ],
                        notes: 'Reps are in seconds'
                    }
                ]
            } as SuperSet,
            {
                id: 'ex-3-3',
                name: 'Hanging Leg Raises',
                muscleGroup: 'core',
                sets: [
                    { id: 'set-3-3-1', weight: 0, reps: 15, completed: false },
                    { id: 'set-3-3-2', weight: 0, reps: 12, completed: false },
                ]
            }
        ]
    }
];

export default sampleWorkouts;