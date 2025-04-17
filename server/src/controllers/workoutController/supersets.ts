import {
    addSupersetToWorkout,
    updateSuperset,
    deleteSuperset,
    addExerciseToSuperset,
    removeExerciseFromSuperset
} from '@/services/workoutService';
import { Controller } from '@/types';
import { Workout } from '@shared';

/**
 * Adds a new superset to a workout
 * @param req Express request object with workoutId and superset data
 * @param res Express response object
 * @returns Created superset information if successful
 * @throws 401 if user is not authenticated
 * @throws 400 if required data is missing or invalid
 * @throws 404 if workout is not found
 * @throws 500 if server encounters an error
 */
export const handleAddSupersetToWorkout: Controller = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const userId = req.user.id;
        const { workoutId } = req.params;
        const supersetData = req.body;

        if (!workoutId) {
            res.status(400).json({ error: 'Workout ID is required' });
            return
        }

        if (!supersetData || typeof supersetData !== 'object' || supersetData.order === undefined) {
            res.status(400).json({ error: 'Valid superset data with order is required' });
            return
        }

        const newSuperset = await addSupersetToWorkout(workoutId, userId, supersetData);

        res.status(201).json({
            message: 'Superset added successfully',
            superset: newSuperset
        });
        return
    } catch (error: any) {
        console.error('Add superset error:', error);

        if (error.message === 'Workout not found') {
            res.status(404).json({ error: 'Workout not found' });
            return
        }

        res.status(500).json({ error: 'Failed to add superset' });
    }
};

/**
 * Updates an existing superset
 * @param req Express request object with supersetId and update data
 * @param res Express response object
 * @returns Updated superset information if successful
 * @throws 401 if user is not authenticated
 * @throws 400 if required data is missing or invalid
 * @throws 404 if superset is not found
 * @throws 500 if server encounters an error
 */
export const handleUpdateSuperset: Controller = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return
            res.status(401).json({ error: 'Unauthorized' });
        }

        const userId = req.user.id;
        const { supersetId } = req.params;
        const updateData: Partial<Workout.SupersetData> = req.body;

        if (!supersetId) {
            return
            res.status(400).json({ error: 'Superset ID is required' });
        }

        if (!updateData || typeof updateData !== 'object') {
            return
            res.status(400).json({ error: 'Valid update data is required' });
        }

        const updatedSuperset = await updateSuperset(supersetId, userId, updateData);

        res.status(200).json({
            message: 'Superset updated successfully',
            superset: updatedSuperset
        });
        return
    } catch (error: any) {
        console.error('Update superset error:', error);

        if (error.message === 'Superset not found') {
            res.status(404).json({ error: 'Superset not found' });
            return
        }

        res.status(500).json({ error: 'Failed to update superset' });
    }
};

/**
 * Deletes a superset from a workout
 * @param req Express request object with supersetId
 * @param res Express response object
 * @returns Success message if deletion is successful
 * @throws 401 if user is not authenticated
 * @throws 400 if supersetId is missing
 * @throws 404 if superset is not found
 * @throws 500 if server encounters an error
 */
export const handleDeleteSuperset: Controller = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const userId = req.user.id;
        const { supersetId } = req.params;

        if (!supersetId) {
            res.status(400).json({ error: 'Superset ID is required' });
            return
        }

        await deleteSuperset(supersetId, userId);

        res.status(200).json({
            message: 'Superset deleted successfully'
        });
        return
    } catch (error: any) {
        console.error('Delete superset error:', error);

        if (error.message === 'Superset not found') {
            res.status(404).json({ error: 'Superset not found' });
            return
        }

        res.status(500).json({ error: 'Failed to delete superset' });
    }
};

/**
 * Adds a new exercise to a superset
 * @param req Express request object with supersetId and exercise data
 * @param res Express response object
 * @returns Created exercise information if successful
 * @throws 401 if user is not authenticated
 * @throws 400 if required data is missing or invalid
 * @throws 404 if superset is not found
 * @throws 500 if server encounters an error
 */
export const handleAddExerciseToSuperset: Controller = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const userId = req.user.id;
        const { supersetId } = req.params;
        const exerciseData: Workout.ExerciseData = req.body;

        if (!supersetId) {
            res.status(400).json({ error: 'Superset ID is required' });
            return
        }

        if (!exerciseData || typeof exerciseData !== 'object' || !exerciseData.name || !exerciseData.muscleGroup) {
            res.status(400).json({
                error: 'Valid exercise data with name, muscleGroup, and order is required'
            });
            return
        }

        const newExercise = await addExerciseToSuperset(supersetId, userId, exerciseData);

        res.status(201).json({
            message: 'Exercise added to superset successfully',
            exercise: newExercise
        });
        return
    } catch (error: any) {
        console.error('Add exercise to superset error:', error);

        if (error.message === 'Superset not found') {
            res.status(404).json({ error: 'Superset not found' });
            return
        }

        res.status(500).json({ error: 'Failed to add exercise to superset' });
    }
};

/**
 * Removes an exercise from a superset
 * @param req Express request object with exerciseId
 * @param res Express response object
 * @returns Success message if removal is successful
 * @throws 401 if user is not authenticated
 * @throws 400 if exerciseId is missing
 * @throws 404 if exercise is not found
 * @throws 500 if server encounters an error
 */
export const handleRemoveExerciseFromSuperset: Controller = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const userId = req.user.id;
        const { exerciseId } = req.params;

        if (!exerciseId) {
            res.status(400).json({ error: 'Exercise ID is required' });
            return
        }

        await removeExerciseFromSuperset(exerciseId, userId);

        res.status(200).json({
            message: 'Exercise removed from superset successfully'
        });
        return
    } catch (error: any) {
        console.error('Remove exercise from superset error:', error);

        if (error.message === 'Exercise not found') {
            res.status(404).json({ error: 'Exercise not found' });
            return
        }

        res.status(500).json({ error: 'Failed to remove exercise from superset' });
    }
};