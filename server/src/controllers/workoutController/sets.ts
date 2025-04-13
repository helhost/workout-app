import { Request, Response } from 'express';
import {
    addSetToExercise,
    updateSet,
    deleteSet,
    addSubSetToSet,
    updateSubSet,
    deleteSubSet
} from '../../services/workoutService';

// Add set to exercise
export const addSetToExerciseController = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const userId = req.user.id;
        const { exerciseId } = req.params;
        const { weight, reps, completed, notes, order } = req.body;

        // Basic validation
        if (weight === undefined || reps === undefined || order === undefined) {
            res.status(400).json({ error: 'Set weight, reps, and order are required' });
            return
        }

        try {
            const set = await addSetToExercise(exerciseId, userId, {
                weight: parseFloat(weight),
                reps: parseInt(reps),
                completed: completed || false,
                notes,
                order
            });

            res.status(201).json({
                message: 'Set added to exercise successfully',
                set
            });
        } catch (error: any) {
            if (error.message === 'Exercise not found') {
                res.status(404).json({ error: 'Exercise not found' });
                return
            }
            throw error;
        }
    } catch (error) {
        console.error('Add set error:', error);
        res.status(500).json({ error: 'Failed to add set to exercise' });
    }
};

// Update set
export const updateSetController = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const userId = req.user.id;
        const { setId } = req.params;
        const { weight, reps, completed, notes, order } = req.body;

        // At least one field should be provided for update
        if (weight === undefined && reps === undefined && completed === undefined &&
            notes === undefined && order === undefined) {
            res.status(400).json({ error: 'At least one field to update is required' });
            return
        }

        const updateData: any = {};
        if (weight !== undefined) updateData.weight = parseFloat(weight);
        if (reps !== undefined) updateData.reps = parseInt(reps);
        if (completed !== undefined) updateData.completed = completed;
        if (notes !== undefined) updateData.notes = notes;
        if (order !== undefined) updateData.order = order;

        try {
            const set = await updateSet(setId, userId, updateData);
            res.json({
                message: 'Set updated successfully',
                set
            });
        } catch (error: any) {
            if (error.message === 'Set not found') {
                res.status(404).json({ error: 'Set not found' });
                return
            }
            throw error;
        }
    } catch (error) {
        console.error('Update set error:', error);
        res.status(500).json({ error: 'Failed to update set' });
    }
};

// Delete set
export const deleteSetController = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const userId = req.user.id;
        const { setId } = req.params;

        try {
            await deleteSet(setId, userId);
            res.json({
                message: 'Set deleted successfully'
            });
        } catch (error: any) {
            if (error.message === 'Set not found') {
                res.status(404).json({ error: 'Set not found' });
                return
            }
            throw error;
        }
    } catch (error) {
        console.error('Delete set error:', error);
        res.status(500).json({ error: 'Failed to delete set' });
    }
};

// Add subset to set (for dropsets)
export const addSubSetToSetController = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const userId = req.user.id;
        const { setId } = req.params;
        const { weight, reps, completed, order } = req.body;

        // Basic validation
        if (weight === undefined || reps === undefined || order === undefined) {
            res.status(400).json({ error: 'Subset weight, reps, and order are required' });
            return
        }

        try {
            const subSet = await addSubSetToSet(setId, userId, {
                weight: parseFloat(weight),
                reps: parseInt(reps),
                completed: completed || false,
                order
            });

            res.status(201).json({
                message: 'Subset added to set successfully',
                subSet
            });
        } catch (error: any) {
            if (error.message === 'Set not found') {
                res.status(404).json({ error: 'Set not found' });
                return
            }
            if (error.message === 'This exercise is not configured as a dropset') {
                res.status(400).json({ error: 'This exercise is not configured as a dropset' });
                return
            }
            throw error;
        }
    } catch (error) {
        console.error('Add subset error:', error);
        res.status(500).json({ error: 'Failed to add subset to set' });
    }
};

// Update subset
export const updateSubSetController = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const userId = req.user.id;
        const { subSetId } = req.params;
        const { weight, reps, completed, order } = req.body;

        // At least one field should be provided for update
        if (weight === undefined && reps === undefined && completed === undefined && order === undefined) {
            res.status(400).json({ error: 'At least one field to update is required' });
            return
        }

        const updateData: any = {};
        if (weight !== undefined) updateData.weight = parseFloat(weight);
        if (reps !== undefined) updateData.reps = parseInt(reps);
        if (completed !== undefined) updateData.completed = completed;
        if (order !== undefined) updateData.order = order;

        try {
            const subSet = await updateSubSet(subSetId, userId, updateData);
            res.json({
                message: 'Subset updated successfully',
                subSet
            });
        } catch (error: any) {
            if (error.message === 'SubSet not found') {
                res.status(404).json({ error: 'Subset not found' });
                return
            }
            throw error;
        }
    } catch (error) {
        console.error('Update subset error:', error);
        res.status(500).json({ error: 'Failed to update subset' });
    }
};

// Delete subset
export const deleteSubSetController = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ error: 'Unauthorized' });
            return
        }

        const userId = req.user.id;
        const { subSetId } = req.params;

        try {
            await deleteSubSet(subSetId, userId);
            res.json({
                message: 'Subset deleted successfully'
            });
        } catch (error: any) {
            if (error.message === 'SubSet not found') {
                res.status(404).json({ error: 'Subset not found' });
                return
            }
            throw error;
        }
    } catch (error) {
        console.error('Delete subset error:', error);
        res.status(500).json({ error: 'Failed to delete subset' });
    }
};