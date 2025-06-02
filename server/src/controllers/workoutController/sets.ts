import {
    addSetToExercise,
    updateSet,
    deleteSet,
    addDropsetToExercise,
    updateDropset,
    deleteDropset,
    addSubSetToDropset,
    updateDropsetSubSet,
    deleteDropsetSubSet
} from '@/services/workoutService/sets';
import { Controller } from '@/types';
import { Workout } from '@shared';

/**
 * Adds a regular set to an exercise
 * @param req Express request object with exerciseId and set data
 * @param res Express response object
 * @returns Created set information if successful
 * @throws 401 if user is not authenticated
 * @throws 400 if required data is missing or invalid
 * @throws 404 if exercise is not found
 * @throws 500 if server encounters an error
 */
export const handleAddSetToExercise: Controller<Workout.ExerciseSet> = async (req, res) => {
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
        const setData: Workout.ExerciseSet = req.body;

        if (!exerciseId) {
            res.status(400).json({
                success: false,
                error: 'Exercise ID is required'
            });
            return;
        }

        if (!setData || typeof setData !== 'object' ||
            setData.weight === undefined || setData.reps === undefined || setData.order === undefined) {
            res.status(400).json({
                success: false,
                error: 'Valid set data with weight, reps, and order is required'
            });
            return;
        }

        const newSet = await addSetToExercise(exerciseId, userId, setData);

        res.status(201).json({
            success: true,
            message: 'Set added successfully',
            data: newSet
        });
        return;
    } catch (error: any) {
        console.error('Add set error:', error);

        if (error.message === 'Exercise not found') {
            res.status(404).json({
                success: false,
                error: 'Exercise not found'
            });
            return;
        }

        res.status(500).json({
            success: false,
            error: 'Failed to add set'
        });
        return;
    }
};

/**
 * Updates an existing exercise set
 * @param req Express request object with setId and update data
 * @param res Express response object
 * @returns Updated set information if successful
 * @throws 401 if user is not authenticated
 * @throws 400 if required data is missing or invalid
 * @throws 404 if set is not found
 * @throws 500 if server encounters an error
 */
export const handleUpdateSet: Controller<Workout.ExerciseSet> = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({
                success: false,
                error: 'Unauthorized'
            });
            return;
        }

        const userId = req.user.id;
        const { setId } = req.params;
        const updateData: Partial<Workout.ExerciseSet> = req.body;

        if (!setId) {
            res.status(400).json({
                success: false,
                error: 'Set ID is required'
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

        const updatedSet = await updateSet(setId, userId, updateData);

        res.status(200).json({
            success: true,
            message: 'Set updated successfully',
            data: updatedSet
        });
        return;
    } catch (error: any) {
        console.error('Update set error:', error);

        if (error.message === 'Set not found') {
            res.status(404).json({
                success: false,
                error: 'Set not found'
            });
            return;
        }

        res.status(500).json({
            success: false,
            error: 'Failed to update set'
        });
        return;
    }
};

/**
 * Deletes an exercise set
 * @param req Express request object with setId
 * @param res Express response object
 * @returns Success message if deletion is successful
 * @throws 401 if user is not authenticated
 * @throws 400 if setId is missing
 * @throws 404 if set is not found
 * @throws 500 if server encounters an error
 */
export const handleDeleteSet: Controller<null> = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({
                success: false,
                error: 'Unauthorized'
            });
            return;
        }

        const userId = req.user.id;
        const { setId } = req.params;

        if (!setId) {
            res.status(400).json({
                success: false,
                error: 'Set ID is required'
            });
            return;
        }

        await deleteSet(setId, userId);

        res.status(200).json({
            success: true,
            message: 'Set deleted successfully',
            data: null
        });
        return;
    } catch (error: any) {
        console.error('Delete set error:', error);

        if (error.message === 'Set not found') {
            res.status(404).json({
                success: false,
                error: 'Set not found'
            });
            return;
        }

        res.status(500).json({
            success: false,
            error: 'Failed to delete set'
        });
        return;
    }
};

/**
 * Adds a dropset to an exercise
 * @param req Express request object with exerciseId and dropset data
 * @param res Express response object
 * @returns Created dropset information if successful
 * @throws 401 if user is not authenticated
 * @throws 400 if required data is missing or invalid
 * @throws 404 if exercise is not found
 * @throws 500 if server encounters an error
 */
export const handleAddDropsetToExercise: Controller<Workout.Dropset> = async (req, res) => {
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
        const dropsetData: Workout.DropsetData = req.body;

        if (!exerciseId) {
            res.status(400).json({
                success: false,
                error: 'Exercise ID is required'
            });
            return;
        }

        if (!dropsetData || typeof dropsetData !== 'object' ||
            dropsetData.order === undefined || !Array.isArray(dropsetData.subSets) ||
            dropsetData.subSets.length === 0) {
            res.status(400).json({
                success: false,
                error: 'Valid dropset data with order and at least one subset is required'
            });
            return;
        }

        // Validate each subset
        for (const subset of dropsetData.subSets) {
            if (subset.weight === undefined || subset.reps === undefined) {
                res.status(400).json({
                    success: false,
                    error: 'Each subset must include weight and reps'
                });
                return;
            }
        }

        const newDropset = await addDropsetToExercise(exerciseId, userId, dropsetData);

        res.status(201).json({
            success: true,
            message: 'Dropset added successfully',
            data: newDropset
        });
        return;
    } catch (error: any) {
        console.error('Add dropset error:', error);

        if (error.message === 'Exercise not found') {
            res.status(404).json({
                success: false,
                error: 'Exercise not found'
            });
            return;
        }

        res.status(500).json({
            success: false,
            error: 'Failed to add dropset'
        });
        return;
    }
};

/**
 * Updates a dropset
 * @param req Express request object with dropsetId and update data
 * @param res Express response object
 * @returns Updated dropset information if successful
 * @throws 401 if user is not authenticated
 * @throws 400 if required data is missing or invalid
 * @throws 404 if dropset is not found
 * @throws 500 if server encounters an error
 */
export const handleUpdateDropset: Controller<Workout.Dropset> = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({
                success: false,
                error: 'Unauthorized'
            });
            return;
        }

        const userId = req.user.id;
        const { dropsetId } = req.params;
        const updateData: Partial<Workout.DropsetData> = req.body;

        if (!dropsetId) {
            res.status(400).json({
                success: false,
                error: 'Dropset ID is required'
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

        // We only allow updating notes and order for the dropset itself
        const { notes, order } = updateData;
        const dropsetUpdateData = { notes, order };

        const updatedDropset = await updateDropset(dropsetId, userId, dropsetUpdateData);

        res.status(200).json({
            success: true,
            message: 'Dropset updated successfully',
            data: updatedDropset
        });
        return;
    } catch (error: any) {
        console.error('Update dropset error:', error);

        if (error.message === 'Dropset not found') {
            res.status(404).json({
                success: false,
                error: 'Dropset not found'
            });
            return;
        }

        res.status(500).json({
            success: false,
            error: 'Failed to update dropset'
        });
        return;
    }
};

/**
 * Deletes a dropset
 * @param req Express request object with dropsetId
 * @param res Express response object
 * @returns Success message if deletion is successful
 * @throws 401 if user is not authenticated
 * @throws 400 if dropsetId is missing
 * @throws 404 if dropset is not found
 * @throws 500 if server encounters an error
 */
export const handleDeleteDropset: Controller<null> = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({
                success: false,
                error: 'Unauthorized'
            });
            return;
        }

        const userId = req.user.id;
        const { dropsetId } = req.params;

        if (!dropsetId) {
            res.status(400).json({
                success: false,
                error: 'Dropset ID is required'
            });
            return;
        }

        await deleteDropset(dropsetId, userId);

        res.status(200).json({
            success: true,
            message: 'Dropset deleted successfully',
            data: null
        });
        return;
    } catch (error: any) {
        console.error('Delete dropset error:', error);

        if (error.message === 'Dropset not found') {
            res.status(404).json({
                success: false,
                error: 'Dropset not found'
            });
            return;
        }

        res.status(500).json({
            success: false,
            error: 'Failed to delete dropset'
        });
        return;
    }
};

/**
 * Adds a subset to a dropset
 * @param req Express request object with dropsetId and subset data
 * @param res Express response object
 * @returns Created subset information if successful
 * @throws 401 if user is not authenticated
 * @throws 400 if required data is missing or invalid
 * @throws 404 if dropset is not found
 * @throws 500 if server encounters an error
 */
export const handleAddSubSetToDropset: Controller<Workout.DropsetSubSet> = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({
                success: false,
                error: 'Unauthorized'
            });
            return;
        }

        const userId = req.user.id;
        const { dropsetId } = req.params;
        const subSetData: Workout.DropsetSubSet = req.body;

        if (!dropsetId) {
            res.status(400).json({
                success: false,
                error: 'Dropset ID is required'
            });
            return;
        }

        if (!subSetData || typeof subSetData !== 'object' ||
            subSetData.weight === undefined || subSetData.reps === undefined ||
            subSetData.order === undefined) {
            res.status(400).json({
                success: false,
                error: 'Valid subset data with weight, reps, and order is required'
            });
            return;
        }

        const newSubSet = await addSubSetToDropset(dropsetId, userId, subSetData);

        res.status(201).json({
            success: true,
            message: 'Subset added successfully',
            data: newSubSet
        });
        return;
    } catch (error: any) {
        console.error('Add subset error:', error);

        if (error.message === 'Dropset not found') {
            res.status(404).json({
                success: false,
                error: 'Dropset not found'
            });
            return;
        }

        res.status(500).json({
            success: false,
            error: 'Failed to add subset'
        });
        return;
    }
};

/**
 * Updates a dropset subset
 * @param req Express request object with subSetId and update data
 * @param res Express response object
 * @returns Updated subset information if successful
 * @throws 401 if user is not authenticated
 * @throws 400 if required data is missing or invalid
 * @throws 404 if subset is not found
 * @throws 500 if server encounters an error
 */
export const handleUpdateDropsetSubSet: Controller<Workout.DropsetSubSet> = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({
                success: false,
                error: 'Unauthorized'
            });
            return;
        }

        const userId = req.user.id;
        const { subSetId } = req.params;
        const updateData: Partial<Workout.DropsetSubSet> = req.body;

        if (!subSetId) {
            res.status(400).json({
                success: false,
                error: 'Subset ID is required'
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

        const updatedSubSet = await updateDropsetSubSet(subSetId, userId, updateData);

        res.status(200).json({
            success: true,
            message: 'Subset updated successfully',
            data: updatedSubSet
        });
        return;
    } catch (error: any) {
        console.error('Update subset error:', error);

        if (error.message === 'SubSet not found') {
            res.status(404).json({
                success: false,
                error: 'Subset not found'
            });
            return;
        }

        res.status(500).json({
            success: false,
            error: 'Failed to update subset'
        });
        return;
    }
};

/**
 * Deletes a dropset subset
 * @param req Express request object with subSetId
 * @param res Express response object
 * @returns Success message if deletion is successful
 * @throws 401 if user is not authenticated
 * @throws 400 if subSetId is missing
 * @throws 404 if subset is not found
 * @throws 500 if server encounters an error
 */
export const handleDeleteDropsetSubSet: Controller<null> = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({
                success: false,
                error: 'Unauthorized'
            });
            return;
        }

        const userId = req.user.id;
        const { subSetId } = req.params;

        if (!subSetId) {
            res.status(400).json({
                success: false,
                error: 'Subset ID is required'
            });
            return;
        }

        await deleteDropsetSubSet(subSetId, userId);

        res.status(200).json({
            success: true,
            message: 'Subset deleted successfully',
            data: null
        })
        return;
    } catch (error: any) {
        console.error('Delete subset error:', error);

        if (error.message === 'SubSet not found') {
            res.status(404).json({
                success: false,
                error: 'Subset not found'
            });
            return;
        }

        res.status(500).json({
            success: false,
            error: 'Failed to delete subset'
        });
        return;
    }
};