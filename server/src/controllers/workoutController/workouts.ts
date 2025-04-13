import { Request, Response } from 'express';
import {
    createWorkout,
    getUserWorkouts,
    getWorkoutById,
    updateWorkout,
    startWorkout,
    endWorkout,
    deleteWorkout
} from '../../services/workoutService';

// Create a new workout
export const createWorkoutController = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const userId = req.user.id;
        const { name, date, notes } = req.body;

        // Basic validation
        if (!name || !date) {
            res.status(400).json({ error: 'Workout name and date are required' });
            return
        }

        const workout = await createWorkout(userId, {
            name,
            date: new Date(date),
            notes,
            completed: false
        });

        res.status(201).json({
            message: 'Workout created successfully',
            workout
        });
    } catch (error) {
        console.error('Create workout error:', error);
        res.status(500).json({ error: 'Failed to create workout' });
    }
};

// Get all workouts for the authenticated user
export const getUserWorkoutsController = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const userId = req.user.id;

        // Parse query parameters
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
        const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
        const completed = req.query.completed !== undefined
            ? req.query.completed === 'true'
            : undefined;

        // Parse date range if provided
        let startDate, endDate;
        if (req.query.startDate) {
            startDate = new Date(req.query.startDate as string);
        }
        if (req.query.endDate) {
            endDate = new Date(req.query.endDate as string);
        }

        const result = await getUserWorkouts(userId, {
            limit,
            offset,
            completed,
            startDate,
            endDate
        });

        res.json({
            message: 'Workouts retrieved successfully',
            ...result
        });
    } catch (error) {
        console.error('Get workouts error:', error);
        res.status(500).json({ error: 'Failed to retrieve workouts' });
    }
};

// Get a single workout by ID
export const getWorkoutByIdController = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const userId = req.user.id;
        const { workoutId } = req.params;

        try {
            const workout = await getWorkoutById(workoutId, userId);
            res.json({
                message: 'Workout retrieved successfully',
                workout
            });
        } catch (error: any) {
            if (error.message === 'Workout not found') {
                res.status(404).json({ error: 'Workout not found' });
                return
            }
            throw error;
        }
    } catch (error) {
        console.error('Get workout error:', error);
        res.status(500).json({ error: 'Failed to retrieve workout' });
    }
};

// Update a workout
export const updateWorkoutController = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const userId = req.user.id;
        const { workoutId } = req.params;
        const { name, date, notes, completed } = req.body;

        // At least one field should be provided for update
        if (!name && date === undefined && notes === undefined && completed === undefined) {
            res.status(400).json({ error: 'At least one field to update is required' });
            return
        }

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (date !== undefined) updateData.date = new Date(date);
        if (notes !== undefined) updateData.notes = notes;
        if (completed !== undefined) updateData.completed = completed;

        try {
            const workout = await updateWorkout(workoutId, userId, updateData);
            res.json({
                message: 'Workout updated successfully',
                workout
            });
        } catch (error: any) {
            if (error.message === 'Workout not found') {
                res.status(404).json({ error: 'Workout not found' });
                return
            }
            throw error;
        }
    } catch (error) {
        console.error('Update workout error:', error);
        res.status(500).json({ error: 'Failed to update workout' });
    }
};

// Start a workout
export const startWorkoutController = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const userId = req.user.id;
        const { workoutId } = req.params;

        try {
            const workout = await startWorkout(workoutId, userId);
            res.json({
                message: 'Workout started successfully',
                workout
            });
        } catch (error: any) {
            if (error.message === 'Workout not found') {
                res.status(404).json({ error: 'Workout not found' });
                return
            }
            if (error.message === 'Workout has already been started') {
                res.status(400).json({ error: 'Workout has already been started' });
                return
            }
            throw error;
        }
    } catch (error) {
        console.error('Start workout error:', error);
        res.status(500).json({ error: 'Failed to start workout' });
    }
};

// End a workout
export const endWorkoutController = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const userId = req.user.id;
        const { workoutId } = req.params;

        try {
            const workout = await endWorkout(workoutId, userId);
            res.json({
                message: 'Workout completed successfully',
                workout
            });
        } catch (error: any) {
            if (error.message === 'Workout not found') {
                res.status(404).json({ error: 'Workout not found' });
                return
            }
            if (error.message === 'Workout has not been started yet') {
                res.status(400).json({ error: 'Workout has not been started yet' });
                return
            }
            if (error.message === 'Workout has already been ended') {
                res.status(400).json({ error: 'Workout has already been ended' });
                return
            }
            throw error;
        }
    } catch (error) {
        console.error('End workout error:', error);
        res.status(500).json({ error: 'Failed to end workout' });
    }
};

// Delete a workout
export const deleteWorkoutController = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const userId = req.user.id;
        const { workoutId } = req.params;

        try {
            await deleteWorkout(workoutId, userId);
            res.json({
                message: 'Workout deleted successfully'
            });
        } catch (error: any) {
            if (error.message === 'Workout not found') {
                res.status(404).json({ error: 'Workout not found' });
                return
            }
            throw error;
        }
    } catch (error) {
        console.error('Delete workout error:', error);
        res.status(500).json({ error: 'Failed to delete workout' });
    }
};