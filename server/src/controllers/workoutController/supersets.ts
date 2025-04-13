import { Request, Response } from 'express';
import {
    addSupersetToWorkout,
    updateSuperset,
    deleteSuperset
} from '../../services/workoutService';

// Add superset to workout
export const addSupersetToWorkoutController = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const userId = req.user.id;
        const { workoutId } = req.params;
        const { notes, order } = req.body;

        // Basic validation
        if (order === undefined) {
            res.status(400).json({ error: 'Superset order is required' });
            return
        }

        try {
            const superset = await addSupersetToWorkout(workoutId, userId, {
                notes,
                order
            });

            res.status(201).json({
                message: 'Superset added to workout successfully',
                superset
            });
        } catch (error: any) {
            if (error.message === 'Workout not found') {
                res.status(404).json({ error: 'Workout not found' });
                return
            }
            throw error;
        }
    } catch (error) {
        console.error('Add superset error:', error);
        res.status(500).json({ error: 'Failed to add superset to workout' });
    }
};

// Update superset
export const updateSupersetController = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const userId = req.user.id;
        const { supersetId } = req.params;
        const { notes, order } = req.body;

        // At least one field should be provided for update
        if (notes === undefined && order === undefined) {
            res.status(400).json({ error: 'At least one field to update is required' });
            return
        }

        const updateData: any = {};
        if (notes !== undefined) updateData.notes = notes;
        if (order !== undefined) updateData.order = order;

        try {
            const superset = await updateSuperset(supersetId, userId, updateData);
            res.json({
                message: 'Superset updated successfully',
                superset
            });
        } catch (error: any) {
            if (error.message === 'Superset not found') {
                res.status(404).json({ error: 'Superset not found' });
                return
            }
            throw error;
        }
    } catch (error) {
        console.error('Update superset error:', error);
        res.status(500).json({ error: 'Failed to update superset' });
    }
};

// Delete superset
export const deleteSupersetController = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const userId = req.user.id;
        const { supersetId } = req.params;

        try {
            await deleteSuperset(supersetId, userId);
            res.json({
                message: 'Superset deleted successfully'
            });
        } catch (error: any) {
            if (error.message === 'Superset not found') {
                res.status(404).json({ error: 'Superset not found' });
                return
            }
            throw error;
        }
    } catch (error) {
        console.error('Delete superset error:', error);
        res.status(500).json({ error: 'Failed to delete superset' });
    }
};