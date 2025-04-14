import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import workout components and types
import { sampleWorkouts, Workout, Exercise, WorkoutItemType, isSuperset } from "@/features/workouts";

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
            // In production, you would fetch the workout data from an API
            // For now, we'll use the sample data
            const foundWorkout = sampleWorkouts.find(w => w.id === workoutId);
            if (foundWorkout) {
                setFormData(foundWorkout);
            }
        }
        setLoading(false);
    }, [workoutId, isEditMode]);

    // Handle changes to workout level fields
    const handleWorkoutChange = <K extends keyof Workout>(field: K, value: Workout[K]) => {
        setFormData({ ...formData, [field]: value });
    };

    // Handle info form changes
    const handleInfoChange = (
        field: 'name' | 'date' | 'notes' | 'duration',
        value: string | number | undefined
    ) => {
        handleWorkoutChange(field, value as any);
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
    const updateItem = (itemIndex: number, updatedItem: WorkoutItemType) => {
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
            // In production, you would send the data to your API
            // For now, we'll just simulate a delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Show success message
            toast.success(
                isEditMode
                    ? "Workout updated successfully!"
                    : "Workout created successfully!"
            );

            // Navigate back to the detail page if editing, or to the list if creating
            if (isEditMode) {
                navigate(`/workouts/${formData.id}`);
            } else {
                navigate("/workouts");
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
        <div className="max-w-3xl mx-auto px-4 py-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Workout Details Section */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        {isEditMode ? "Edit Workout" : "Create Workout"}
                    </h2>

                    <InfoForm
                        name={formData.name}
                        date={formData.date}
                        notes={formData.notes}
                        duration={formData.duration}
                        onChange={handleInfoChange}
                    />
                </div>

                {/* Exercises and Supersets Section */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Exercises</h2>
                    </div>

                    {formData.items.length === 0 ? (
                        <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md">
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                No exercises added yet. Click "Add Exercise" to get started.
                            </p>
                            <Button
                                type="button"
                                onClick={addExercise}
                                className="flex items-center gap-2 mx-auto"
                            >
                                <Dumbbell className="h-4 w-4" />
                                Add Exercise
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {formData.items.map((item, index) => (
                                <div key={item.id}>
                                    {isSuperset(item) ? (
                                        <SupersetForm
                                            superset={item}
                                            onUpdate={(updatedSuperset) => updateItem(index, updatedSuperset)}
                                            onRemove={() => removeItem(index)}
                                        />
                                    ) : (
                                        <ExerciseForm
                                            exercise={item as Exercise}
                                            onUpdate={(updatedExercise) => updateItem(index, updatedExercise)}
                                            onRemove={() => removeItem(index)}
                                            onConvertToSuperset={() => convertToSuperset(index)}
                                        />
                                    )}
                                </div>
                            ))}

                            {/* Add Exercise button */}
                            <div className="mt-6 text-center">
                                <Button
                                    type="button"
                                    onClick={addExercise}
                                    className="flex items-center gap-2 mx-auto"
                                >
                                    <Dumbbell className="h-4 w-4" />
                                    Add Exercise
                                </Button>
                            </div>
                        </div>
                    )}
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