import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
    // workouts
    handleCreateWorkout,
    handleGetWorkoutsList,
    handleGetWorkoutById,
    handleUpdateWorkout,
    handleStartWorkout,
    handleEndWorkout,
    handleDeleteWorkout,
    //exercises
    handleAddExerciseToWorkout,
    handleUpdateExercise,
    handleDeleteExercise,
    // supersets
    handleAddSupersetToWorkout,
    handleUpdateSuperset,
    handleDeleteSuperset,
    handleAddExerciseToSuperset,
    handleRemoveExerciseFromSuperset,
    // sets
    handleAddSetToExercise,
    handleUpdateSet,
    handleDeleteSet,
    handleAddDropsetToExercise,
    handleUpdateDropset,
    handleDeleteDropset,
    handleAddSubSetToDropset,
    handleUpdateDropsetSubSet,
    handleDeleteDropsetSubSet
} from '../controllers/workoutController';

const router = express.Router();

// All workout routes require authentication
router.use(authenticateToken);

// Workout routes
router.post('/', handleCreateWorkout);
router.get('/', handleGetWorkoutsList);
router.get('/:workoutId', handleGetWorkoutById);
router.patch('/:workoutId', handleUpdateWorkout);
router.post('/:workoutId/start', handleStartWorkout);
router.post('/:workoutId/end', handleEndWorkout);
router.delete('/:workoutId', handleDeleteWorkout);

// Exercise routes
router.post('/:workoutId/exercises', handleAddExerciseToWorkout);
router.patch('/exercises/:exerciseId', handleUpdateExercise);
router.delete('/exercises/:exerciseId', handleDeleteExercise);

// Superset routes
router.post('/:workoutId/supersets', handleAddSupersetToWorkout);
router.post('/supersets/:supersetId/exercises', handleAddExerciseToSuperset);
router.delete('/supersets/:supersetId/exercises/:exerciseId', handleRemoveExerciseFromSuperset);
router.patch('/supersets/:supersetId', handleUpdateSuperset);
router.delete('/supersets/:supersetId', handleDeleteSuperset);

// Regular set routes
router.post('/exercises/:exerciseId/sets', handleAddSetToExercise);
router.patch('/sets/:setId', handleUpdateSet);
router.delete('/sets/:setId', handleDeleteSet);

// Dropset routes
router.post('/exercises/:exerciseId/dropsets', handleAddDropsetToExercise);
router.patch('/dropsets/:dropsetId', handleUpdateDropset);
router.delete('/dropsets/:dropsetId', handleDeleteDropset);

// Dropset subset routes
router.post('/dropsets/:dropsetId/subsets', handleAddSubSetToDropset);
router.patch('/subsets/:subSetId', handleUpdateDropsetSubSet);
router.delete('/subsets/:subSetId', handleDeleteDropsetSubSet);

export default router;