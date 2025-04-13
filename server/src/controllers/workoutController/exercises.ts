import { Request, Response } from 'express';
import {
    addExerciseToWorkout,
    addExerciseToSuperset,
    updateExercise,
    deleteExercise
} from '../../services/workoutService';

// Add exercise to workout
export const addExerciseToWorkoutController = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const userId = req.user.id;
        const { workoutId } = req.params;
        const { name, muscleGroup, notes, isDropSet, order } = req.body;

        // Basic validation
        if (!name || !muscleGroup || order === undefined) {
            res.status(400).json({ error: 'Exercise name, muscle group, and order are required' });
            return
        }

        try {
            const exercise = await addExerciseToWorkout(workoutId, userId, {
                name,
                muscleGroup,
                notes,
                isDropSet: isDropSet || false,
                order
            });

            res.status(201).json({
                message: 'Exercise added to workout successfully',
                exercise
            });
        } catch (error: any) {
            if (error.message === 'Workout not found') {
                res.status(404).json({ error: 'Workout not found' });
                return
            }
            throw error;
        }
    } catch (error) {
        console.error('Add exercise error:', error);
        res.status(500).json({ error: 'Failed to add exercise to workout' });
    }
};

// Add exercise to superset
export const addExerciseToSupersetController = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const userId = req.user.id;
        const { supersetId } = req.params;
        const { name, muscleGroup, notes, isDropSet, order } = req.body;

        // Basic validation
        if (!name || !muscleGroup || order === undefined) {
            res.status(400).json({ error: 'Exercise name, muscle group, and order are required' });
            return
        }

        try {
            const exercise = await addExerciseToSuperset(supersetId, userId, {
                name,
                muscleGroup,
                notes,
                isDropSet: isDropSet || false,
                order
            });

            res.status(201).json({
                message: 'Exercise added to superset successfully',
                exercise
            });
        } catch (error: any) {
            if (error.message === 'Superset not found') {
                res.status(404).json({ error: 'Superset not found' });
                return
            }
            throw error;
        }
    } catch (error) {
        console.error('Add exercise to superset error:', error);
        res.status(500).json({ error: 'Failed to add exercise to superset' });
    }
};

// Update exercise
export const updateExerciseController = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const userId = req.user.id;
        const { exerciseId } = req.params;
        const { name, muscleGroup, notes, isDropSet, order } = req.body;

        // At least one field should be provided for update
        if (!name && muscleGroup === undefined && notes === undefined &&
            isDropSet === undefined && order === undefined) {
            res.status(400).json({ error: 'At least one field to update is required' });
            return
        }

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (muscleGroup !== undefined) updateData.muscleGroup = muscleGroup;
        if (notes !== undefined) updateData.notes = notes;
        if (isDropSet !== undefined) updateData.isDropSet = isDropSet;
        if (order !== undefined) updateData.order = order;

        try {
            const exercise = await updateExercise(exerciseId, userId, updateData);
            res.json({
                message: 'Exercise updated successfully',
                exercise
            });
        } catch (error: any) {
            if (error.message === 'Exercise not found') {
                res.status(404).json({ error: 'Exercise not found' });
                return
            }
            throw error;
        }
    } catch (error) {
        console.error('Update exercise error:', error);
        res.status(500).json({ error: 'Failed to update exercise' });
    }
};

// Delete exercise
export const deleteExerciseController = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const userId = req.user.id;
        const { exerciseId } = req.params;

        try {
            await deleteExercise(exerciseId, userId);
            res.json({
                message: 'Exercise deleted successfully'
            });
        } catch (error: any) {
            if (error.message === 'Exercise not found') {
                res.status(404).json({ error: 'Exercise not found' });
                return
            }
            throw error;
        }
    } catch (error) {
        console.error('Delete exercise error:', error);
        res.status(500).json({ error: 'Failed to delete exercise' });
    }
};