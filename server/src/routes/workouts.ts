import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
    createWorkoutController,
    getUserWorkoutsController,
    getWorkoutByIdController,
    updateWorkoutController,
    startWorkoutController,
    endWorkoutController,
    deleteWorkoutController,
    addExerciseToWorkoutController,
    addExerciseToSupersetController,
    updateExerciseController,
    deleteExerciseController,
    addSupersetToWorkoutController,
    updateSupersetController,
    deleteSupersetController,
    addSetToExerciseController,
    updateSetController,
    deleteSetController,
    addSubSetToSetController,
    updateSubSetController,
    deleteSubSetController
} from '../controllers/workoutController';

const router = express.Router();

// All workout routes require authentication
router.use(authenticateToken);

// Workout routes
router.post('/', createWorkoutController);
router.get('/', getUserWorkoutsController);
router.get('/:workoutId', getWorkoutByIdController);
router.patch('/:workoutId', updateWorkoutController);
router.post('/:workoutId/start', startWorkoutController);
router.post('/:workoutId/end', endWorkoutController);
router.delete('/:workoutId', deleteWorkoutController);

// Exercise routes
router.post('/:workoutId/exercises', addExerciseToWorkoutController);
router.patch('/exercises/:exerciseId', updateExerciseController);
router.delete('/exercises/:exerciseId', deleteExerciseController);

// Superset routes
router.post('/:workoutId/supersets', addSupersetToWorkoutController);
router.post('/supersets/:supersetId/exercises', addExerciseToSupersetController);
router.patch('/supersets/:supersetId', updateSupersetController);
router.delete('/supersets/:supersetId', deleteSupersetController);

// Set routes
router.post('/exercises/:exerciseId/sets', addSetToExerciseController);
router.patch('/sets/:setId', updateSetController);
router.delete('/sets/:setId', deleteSetController);

// Subset routes (for dropsets)
router.post('/sets/:setId/subsets', addSubSetToSetController);
router.patch('/subsets/:subSetId', updateSubSetController);
router.delete('/subsets/:subSetId', deleteSubSetController);

export default router;