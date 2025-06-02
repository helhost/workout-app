import {
    addExerciseToWorkout,
    updateExercise,
    deleteExercise
} from '@/services/workoutService/exercises';
import { Controller } from '@/types';
import { Workout } from '@shared';

/**
 * Adds an exercise to a workout
 * @param req Express request object with workoutId and exercise data
 * @param res Express response object
 * @returns Created exercise information if successful
 * @throws 401 if user is not authenticated
 * @throws 400 if required data is missing or invalid
 * @throws 404 if workout is not found
 * @throws 500 if server encounters an error
 */
export const handleAddExerciseToWorkout: Controller<Workout.Exercise> = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({
                success: false,
                error: 'Unauthorized'
            });
            return;
        }

        const userId = req.user.id;
        const { workoutId } = req.params;
        const exerciseData: Workout.ExerciseData = req.body;

        if (!workoutId) {
            res.status(400).json({
                success: false,
                error: 'Workout ID is required'
            });
            return;
        }

        if (!exerciseData || typeof exerciseData !== 'object' ||
            !exerciseData.name || !exerciseData.muscleGroup ||
            exerciseData.order === undefined) {
            res.status(400).json({
                success: false,
                error: 'Valid exercise data with name, muscleGroup, and order is required'
            });
            return;
        }

        const newExercise = await addExerciseToWorkout(workoutId, userId, exerciseData);

        res.status(201).json({
            success: true,
            message: 'Exercise added successfully',
            data: newExercise
        });
        return;
    } catch (error: any) {
        console.error('Add exercise error:', error);

        if (error.message === 'Workout not found') {
            res.status(404).json({
                success: false,
                error: 'Workout not found'
            });
            return;
        }

        res.status(500).json({
            success: false,
            error: 'Failed to add exercise'
        });
        return;
    }
};

/**
 * Updates an existing exercise
 * @param req Express request object with exerciseId and update data
 * @param res Express response object
 * @returns Updated exercise information if successful
 * @throws 401 if user is not authenticated
 * @throws 400 if required data is missing or invalid
 * @throws 404 if exercise is not found
 * @throws 500 if server encounters an error
 */
export const handleUpdateExercise: Controller<Workout.Exercise> = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({
                success: false,
                error: 'Unauthorized'
            });
            return;
        }

        const userId = req.user.id;
        const { exerciseId } = req.params;
        const updateData: Partial<Workout.ExerciseData> = req.body;

        if (!exerciseId) {
            res.status(400).json({
                success: false,
                error: 'Exercise ID is required'
            });
            return;
        }

        if (!updateData || typeof updateData !== 'object') {
            res.status(400).json({
                success: false,
                error: 'Valid update data is required'
            });
            return;
        }

        const updatedExercise = await updateExercise(exerciseId, userId, updateData);

        res.status(200).json({
            success: true,
            message: 'Exercise updated successfully',
            data: updatedExercise
        });
        return;
    } catch (error: any) {
        console.error('Update exercise error:', error);

        if (error.message === 'Exercise not found') {
            res.status(404).json({
                success: false,
                error: 'Exercise not found'
            });
            return;
        }

        res.status(500).json({
            success: false,
            error: 'Failed to update exercise'
        });
        return;
    }
};

/**
 * Deletes an exercise
 * @param req Express request object with exerciseId
 * @param res Express response object
 * @returns Success message if deletion is successful
 * @throws 401 if user is not authenticated
 * @throws 400 if exerciseId is missing
 * @throws 404 if exercise is not found
 * @throws 500 if server encounters an error
 */
export const handleDeleteExercise: Controller<null> = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({
                success: false,
                error: 'Unauthorized'
            });
            return;
        }

        const userId = req.user.id;
        const { exerciseId } = req.params;

        if (!exerciseId) {
            res.status(400).json({
                success: false,
                error: 'Exercise ID is required'
            });
            return;
        }

        await deleteExercise(exerciseId, userId);

        res.status(200).json({
            success: true,
            message: 'Exercise deleted successfully',
            data: null
        });
        return;
    } catch (error: any) {
        console.error('Delete exercise error:', error);

        if (error.message === 'Exercise not found') {
            res.status(404).json({
                success: false,
                error: 'Exercise not found'
            });
            return;
        }

        res.status(500).json({
            success: false,
            error: 'Failed to delete exercise'
        });
        return;
    }
};