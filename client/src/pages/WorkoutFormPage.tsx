import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import types
import { Workout } from "@/features/workouts/types";
import { WorkoutFull, Exercise, ExerciseData, SupersetData } from "@/types/workout";

// Import form components
import {
    InfoForm,
    ExerciseForm,
    SupersetForm,
    FormActions,
    createDefaultExercise,
    createDefaultWorkout,
    createSuperset
} from "@/features/workouts/components/workout-form";

// Import API functions
import {
    getWorkoutById,
    createWorkout,
    updateWorkout,
    addExerciseToWorkout,
    updateExercise,
    deleteExercise,
    addSupersetToWorkout,
    updateSuperset,
    deleteSuperset,
    addExerciseToSuperset
} from "@/features/workouts/api";

export default function WorkoutFormPage() {
    const { workoutId } = useParams<{ workoutId: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    // State for the form
    const [formData, setFormData] = useState<Workout>(createDefaultWorkout());
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Check if we're in edit mode or create mode
    const isEditMode = location.pathname.includes("/edit");

    useEffect(() => {
        // Only fetch workout if we're in edit mode
        if (isEditMode && workoutId) {
            const fetchWorkout = async () => {
                try {
                    setLoading(true);
                    const response = await getWorkoutById(workoutId);
                    // Transform backend workout to frontend format
                    setFormData(transformWorkout(response.workout));
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching workout:", error);
                    toast.error("Failed to load workout");
                    setLoading(false);
                }
            };

            fetchWorkout();
        } else {
            setLoading(false);
        }
    }, [workoutId, isEditMode]);

    // Transform the backend workout to frontend format
    const transformWorkout = (backendWorkout: WorkoutFull): Workout => {
        return {
            id: backendWorkout.id,
            name: backendWorkout.name,
            date: backendWorkout.startTime
                ? new Date(backendWorkout.startTime).toISOString()
                : new Date().toISOString(),
            items: backendWorkout.items,
            notes: backendWorkout.notes || '',
            completed: backendWorkout.completed
        };
    };

    // Handle changes to workout level fields
    const handleWorkoutChange = <K extends keyof Workout>(field: K, value: Workout[K]) => {
        setFormData({ ...formData, [field]: value });
    };

    // Handle info form changes
    const handleInfoChange = (
        field: 'name' | 'date' | 'notes' | 'duration',
        value: string | number | undefined
    ) => {
        handleWorkoutChange(field as any, value as any);
    };

    // Add a new exercise to the workout
    const addExercise = () => {
        const newExercise = createDefaultExercise();
        handleWorkoutChange("items", [...formData.items, newExercise]);
    };

    // Remove a workout item (exercise or superset)
    const removeItem = (itemIndex: number) => {
        const updatedItems = formData.items.filter((_, i) => i !== itemIndex);
        handleWorkoutChange("items", updatedItems);
    };

    // Update a workout item (exercise or superset)
    const updateItem = (itemIndex: number, updatedItem: any) => {
        const updatedItems = [...formData.items];
        updatedItems[itemIndex] = updatedItem;
        handleWorkoutChange("items", updatedItems);
    };

    // Convert a regular exercise to a superset
    const convertToSuperset = (itemIndex: number) => {
        const updatedItems = [...formData.items];
        const exercise = updatedItems[itemIndex] as Exercise;

        // Create superset with the existing exercise
        const superset = createSuperset(exercise);
        updatedItems[itemIndex] = superset;
        handleWorkoutChange("items", updatedItems);
    };

    // Submit the form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (isEditMode && workoutId) {
                // Update existing workout
                await updateWorkout(workoutId, {
                    name: formData.name,
                    notes: formData.notes
                });

                // Here we'd need to sync all exercises and supersets
                // This would require comparing current state with original data
                // and making appropriate API calls

                toast.success("Workout updated successfully!");
                navigate(`/workouts/${workoutId}`);
            } else {
                // Create new workout
                const response = await createWorkout({
                    name: formData.name,
                    notes: formData.notes
                });

                const newWorkoutId = response.workout.id;

                // Add all exercises and supersets sequentially
                for (const [index, item] of formData.items.entries()) {
                    if (item.type === 'exercise') {
                        // Add exercise
                        const exerciseData: ExerciseData = {
                            name: item.name,
                            muscleGroup: item.muscleGroup,
                            notes: item.notes,
                            order: index
                        };

                        await addExerciseToWorkout(newWorkoutId, exerciseData);
                    } else if (item.type === 'superset') {
                        // Add superset
                        const supersetData: SupersetData = {
                            notes: item.notes,
                            order: index
                        };

                        const supersetResponse = await addSupersetToWorkout(newWorkoutId, supersetData);
                        const newSupersetId = supersetResponse.superset.id;

                        // Add exercises to superset
                        for (const [exIndex, exercise] of item.exercises.entries()) {
                            const exerciseData: ExerciseData = {
                                name: exercise.name,
                                muscleGroup: exercise.muscleGroup,
                                notes: exercise.notes,
                                order: exIndex
                            };

                            await addExerciseToSuperset(newSupersetId, exerciseData);
                        }
                    }
                }

                toast.success("Workout created successfully!");
                navigate(`/workouts/${newWorkoutId}`);
            }
        } catch (error) {
            console.error("Error saving workout:", error);
            toast.error("Failed to save workout");
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        // Navigate back to the detail page if editing, or to the list if creating
        if (isEditMode && workoutId) {
            navigate(`/workouts/${workoutId}`);
        } else {
            navigate("/workouts");
        }
    };

    if (loading) {
        return <div className="flex justify-center p-8">Loading...</div>;
    }

    // If we're in edit mode and the workout doesn't exist, show not found message
    if (isEditMode && !workoutId) {
        return (
            <div className="max-w-2xl mx-auto p-6 text-center">
                <h2 className="text-xl font-semibold mb-4">Workout not found</h2>
                <p className="mb-4">The workout you're trying to edit doesn't exist or has been removed.</p>
                <button
                    onClick={() => navigate("/workouts")}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    Back to workouts
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Workout Details Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">
                        {isEditMode ? "Edit Workout" : "Create Workout"}
                    </h2>

                    <InfoForm
                        name={formData.name}
                        date={formData.date}
                        notes={formData.notes}
                        duration={typeof formData.duration === 'number' ? formData.duration : undefined}
                        onChange={handleInfoChange}
                    />
                </div>

                {/* Exercises and Supersets Section */}
                <div>
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold">Exercises</h2>
                    </div>

                    {formData.items.length === 0 ? (
                        <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md mb-4">
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                No exercises added yet. Add your first exercise to get started.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {formData.items.map((item, index) => (
                                <div key={item.id}>
                                    {item.type === 'superset' ? (
                                        <SupersetForm
                                            superset={item}
                                            onUpdate={(updatedSuperset) => updateItem(index, updatedSuperset)}
                                            onRemove={() => removeItem(index)}
                                        />
                                    ) : (
                                        <ExerciseForm
                                            exercise={item}
                                            onUpdate={(updatedExercise) => updateItem(index, updatedExercise)}
                                            onRemove={() => removeItem(index)}
                                            onConvertToSuperset={() => convertToSuperset(index)}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <Button
                            type="button"
                            onClick={addExercise}
                            className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-800 shadow-sm text-blue-700 dark:text-blue-100"
                            size="sm"
                        >
                            <PlusCircle className="h-4 w-4" />
                            Add Exercise
                        </Button>
                    </div>
                </div>

                {/* Form Actions */}
                <FormActions
                    onCancel={handleCancel}
                    isEdit={isEditMode}
                    isSubmitting={submitting}
                />
            </form>
        </div>
    );
}