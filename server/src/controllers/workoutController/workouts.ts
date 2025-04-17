import { Request, Response } from 'express';
import {
    createWorkout,
    getWorkoutById,
    getWorkoutsList,
    updateWorkout,
    startWorkout,
    endWorkout,
    deleteWorkout
} from '@/services/workoutService';
import { Controller } from 'types';

/**
 * Creates a new workout for the authenticated user
 * @param req Express request object with workout data
 * @param res Express response object
 * @throws 401 if user is not authenticated
 * @throws 400 if required data is missing or invalid
 * @throws 500 if server encounters an error
 */
export const handleCreateWorkout: Controller = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const userId = req.user.id;
        const workoutData = req.body;

        if (!workoutData || typeof workoutData !== 'object' || !workoutData.name) {
            res.status(400).json({ error: 'Valid workout data with name is required' });
            return;
        }

        const newWorkout = await createWorkout(userId, workoutData);

        res.status(201).json({
            message: 'Workout created successfully',
            workout: newWorkout
        });
        return;
    } catch (error: any) {
        console.error('Create workout error:', error);
        res.status(500).json({ error: 'Failed to create workout' });
        return;
    }
};

/**
 * Gets a specific workout with all related data
 * @param req Express request object with workoutId
 * @param res Express response object
 * @throws 401 if user is not authenticated
 * @throws 400 if workoutId is missing
 * @throws 404 if workout is not found
 * @throws 500 if server encounters an error
 */
export const handleGetWorkoutById: Controller = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const userId = req.user.id;
        const { workoutId } = req.params;

        if (!workoutId) {
            res.status(400).json({ error: 'Workout ID is required' });
            return;
        }

        const workout = await getWorkoutById(workoutId, userId);

        res.status(200).json({
            message: 'Workout retrieved successfully',
            workout
        });
        return;
    } catch (error: any) {
        console.error('Get workout error:', error);

        if (error.message === 'Workout not found') {
            res.status(404).json({ error: 'Workout not found' });
            return;
        }

        res.status(500).json({ error: 'Failed to retrieve workout' });
        return;
    }
};

/**
 * Gets paginated list of workouts for the authenticated user
 * @param req Express request object with optional query parameters
 * @param res Express response object
 * @throws 401 if user is not authenticated
 * @throws 500 if server encounters an error
 */
export const handleGetWorkoutsList: Controller = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const userId = req.user.id;
        const {
            limit = 10,
            offset = 0,
            completed,
            startDate,
            endDate
        } = req.query;

        // Convert query parameters to appropriate types
        const options: any = {
            limit: parseInt(limit as string) || 10,
            offset: parseInt(offset as string) || 0
        };

        if (completed !== undefined) {
            options.completed = completed === 'true';
        }

        if (startDate) {
            options.startDate = new Date(startDate as string);
        }

        if (endDate) {
            options.endDate = new Date(endDate as string);
        }

        const result = await getWorkoutsList(userId, options);

        res.status(200).json({
            message: 'Workouts retrieved successfully',
            ...result
        });
        return;
    } catch (error: any) {
        console.error('Get workouts list error:', error);
        res.status(500).json({ error: 'Failed to retrieve workouts' });
        return;
    }
};

/**
 * Updates a workout's details
 * @param req Express request object with workoutId and update data
 * @param res Express response object
 * @throws 401 if user is not authenticated
 * @throws 400 if workoutId or update data is missing
 * @throws 404 if workout is not found
 * @throws 500 if server encounters an error
 */
export const handleUpdateWorkout: Controller = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const userId = req.user.id;
        const { workoutId } = req.params;
        const updateData = req.body;

        if (!workoutId) {
            res.status(400).json({ error: 'Workout ID is required' });
            return;
        }

        if (!updateData || typeof updateData !== 'object') {
            res.status(400).json({ error: 'Valid update data is required' });
            return;
        }

        const updatedWorkout = await updateWorkout(workoutId, userId, updateData);

        res.status(200).json({
            message: 'Workout updated successfully',
            workout: updatedWorkout
        });
        return;
    } catch (error: any) {
        console.error('Update workout error:', error);

        if (error.message === 'Workout not found') {
            res.status(404).json({ error: 'Workout not found' });
            return;
        }

        res.status(500).json({ error: 'Failed to update workout' });
        return;
    }
};

/**
 * Starts a workout by setting the startTime
 * @param req Express request object with workoutId
 * @param res Express response object
 * @throws 401 if user is not authenticated
 * @throws 400 if workoutId is missing
 * @throws 404 if workout is not found
 * @throws 400 if workout has already been started
 * @throws 500 if server encounters an error
 */
export const handleStartWorkout: Controller = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const userId = req.user.id;
        const { workoutId } = req.params;

        if (!workoutId) {
            res.status(400).json({ error: 'Workout ID is required' });
            return;
        }

        const startedWorkout = await startWorkout(workoutId, userId);

        res.status(200).json({
            message: 'Workout started successfully',
            workout: startedWorkout
        });
        return;
    } catch (error: any) {
        console.error('Start workout error:', error);

        if (error.message === 'Workout not found') {
            res.status(404).json({ error: 'Workout not found' });
            return;
        }

        if (error.message === 'Workout has already been started') {
            res.status(400).json({ error: 'Workout has already been started' });
            return;
        }

        res.status(500).json({ error: 'Failed to start workout' });
        return;
    }
};

/**
 * Ends a workout by setting the endTime and marking as completed
 * @param req Express request object with workoutId
 * @param res Express response object
 * @throws 401 if user is not authenticated
 * @throws 400 if workoutId is missing
 * @throws 404 if workout is not found
 * @throws 400 if workout has not been started or has already ended
 * @throws 500 if server encounters an error
 */
export const handleEndWorkout: Controller = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const userId = req.user.id;
        const { workoutId } = req.params;

        if (!workoutId) {
            res.status(400).json({ error: 'Workout ID is required' });
            return;
        }

        const endedWorkout = await endWorkout(workoutId, userId);

        res.status(200).json({
            message: 'Workout ended successfully',
            workout: endedWorkout
        });
        return;
    } catch (error: any) {
        console.error('End workout error:', error);

        if (error.message === 'Workout not found') {
            res.status(404).json({ error: 'Workout not found' });
            return;
        }

        if (error.message === 'Workout has not been started yet') {
            res.status(400).json({ error: 'Workout has not been started yet' });
            return;
        }

        if (error.message === 'Workout has already been ended') {
            res.status(400).json({ error: 'Workout has already been ended' });
            return;
        }

        res.status(500).json({ error: 'Failed to end workout' });
        return;
    }
};

/**
 * Deletes a workout
 * @param req Express request object with workoutId
 * @param res Express response object
 * @throws 401 if user is not authenticated
 * @throws 400 if workoutId is missing
 * @throws 404 if workout is not found
 * @throws 500 if server encounters an error
 */
export const handleDeleteWorkout: Controller = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const userId = req.user.id;
        const { workoutId } = req.params;

        if (!workoutId) {
            res.status(400).json({ error: 'Workout ID is required' });
            return;
        }

        await deleteWorkout(workoutId, userId);

        res.status(200).json({
            message: 'Workout deleted successfully'
        });
        return;
    } catch (error: any) {
        console.error('Delete workout error:', error);

        if (error.message === 'Workout not found') {
            res.status(404).json({ error: 'Workout not found' });
            return;
        }

        res.status(500).json({ error: 'Failed to delete workout' });
        return;
    }
};