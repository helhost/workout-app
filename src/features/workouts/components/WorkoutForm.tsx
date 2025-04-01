import { useState } from "react";
import { PlusCircle, MinusCircle, Trash2, Save, Dumbbell, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Workout, Exercise, Set, MuscleGroup, SuperSet, isSuperset } from "../types";

interface WorkoutFormProps {
    workout?: Workout;
    onSave: (workout: Workout) => void;
    onCancel: () => void;
    className?: string;
}

export default function WorkoutForm({
    workout,
    onSave,
    onCancel,
    className
}: WorkoutFormProps) {
    // Initialize form state with provided workout or default values
    const [formData, setFormData] = useState<Workout>(
        workout || {
            id: `workout-${Date.now()}`,
            name: "",
            date: new Date().toISOString(),
            items: [],
            completed: false,
        }
    );

    // Helper function to generate unique IDs
    const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Handle changes to workout level fields
    const handleWorkoutChange = (field: keyof Workout, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    // Create a new empty exercise
    const createEmptyExercise = (): Exercise => ({
        id: generateId('ex'),
        name: "",
        muscleGroup: "fullBody" as MuscleGroup,
        sets: [
            {
                id: generateId('set'),
                weight: 0,
                reps: 10,
                completed: false
            }
        ]
    });

    // Add a new exercise to the workout
    const addExercise = () => {
        const newExercise = createEmptyExercise();
        setFormData({
            ...formData,
            items: [...formData.items, newExercise]
        });
    };

    // Update an exercise
    const updateExercise = (itemIndex: number, exerciseIndex: number | null, field: keyof Exercise, value: any) => {
        const updatedItems = [...formData.items];
        const item = updatedItems[itemIndex];

        if (isSuperset(item) && exerciseIndex !== null) {
            // Update an exercise within a superset
            const updatedExercises = [...item.exercises];
            updatedExercises[exerciseIndex] = {
                ...updatedExercises[exerciseIndex],
                [field]: value
            };

            updatedItems[itemIndex] = {
                ...item,
                exercises: updatedExercises
            };
        } else if (!isSuperset(item) && exerciseIndex === null) {
            // Update a standalone exercise
            updatedItems[itemIndex] = {
                ...item,
                [field]: value
            };
        }

        setFormData({
            ...formData,
            items: updatedItems
        });
    };

    // Remove a workout item (exercise or superset)
    const removeItem = (itemIndex: number) => {
        const updatedItems = formData.items.filter((_, i) => i !== itemIndex);
        setFormData({
            ...formData,
            items: updatedItems
        });
    };

    // Convert a regular exercise to a superset
    const convertToSuperset = (itemIndex: number) => {
        const updatedItems = [...formData.items];
        const exercise = updatedItems[itemIndex] as Exercise;

        // Create superset with just the existing exercise
        const superset: SuperSet = {
            id: generateId('ss'),
            type: 'superset',
            exercises: [exercise]
        };

        updatedItems[itemIndex] = superset;

        setFormData({
            ...formData,
            items: updatedItems
        });
    };

    // Add a new exercise to a superset
    const addExerciseToSuperset = (itemIndex: number) => {
        const updatedItems = [...formData.items];
        const item = updatedItems[itemIndex];

        if (isSuperset(item)) {
            const superset = item as SuperSet;
            const newExercise = createEmptyExercise();

            updatedItems[itemIndex] = {
                ...superset,
                exercises: [...superset.exercises, newExercise]
            };

            setFormData({
                ...formData,
                items: updatedItems
            });
        }
    };

    // Remove an exercise from a superset
    const removeExerciseFromSuperset = (itemIndex: number, exerciseIndex: number) => {
        const updatedItems = [...formData.items];
        const item = updatedItems[itemIndex];

        if (isSuperset(item)) {
            const superset = item as SuperSet;

            // If this is the last exercise in the superset, convert to regular exercise
            if (superset.exercises.length === 1) {
                // Just convert the superset to a regular exercise
                updatedItems[itemIndex] = superset.exercises[0];
            } else {
                // Remove the exercise from the superset
                const updatedExercises = superset.exercises.filter((_, i) => i !== exerciseIndex);

                updatedItems[itemIndex] = {
                    ...superset,
                    exercises: updatedExercises
                };
            }

            setFormData({
                ...formData,
                items: updatedItems
            });
        }
    };

    // Add a new set to an exercise
    const addSet = (itemIndex: number, exerciseIndex: number | null) => {
        const updatedItems = [...formData.items];
        const item = updatedItems[itemIndex];

        if (isSuperset(item) && exerciseIndex !== null) {
            // Add set to an exercise within a superset
            const exercise = item.exercises[exerciseIndex];
            const lastSet = exercise.sets[exercise.sets.length - 1];

            const newSet: Set = {
                id: generateId('set'),
                weight: lastSet?.weight || 0,
                reps: lastSet?.reps || 10,
                completed: false
            };

            const updatedExercises = [...item.exercises];
            updatedExercises[exerciseIndex] = {
                ...exercise,
                sets: [...exercise.sets, newSet]
            };

            updatedItems[itemIndex] = {
                ...item,
                exercises: updatedExercises
            };
        } else if (!isSuperset(item) && exerciseIndex === null) {
            // Add set to a standalone exercise
            const exercise = item as Exercise;
            const lastSet = exercise.sets[exercise.sets.length - 1];

            const newSet: Set = {
                id: generateId('set'),
                weight: lastSet?.weight || 0,
                reps: lastSet?.reps || 10,
                completed: false
            };

            updatedItems[itemIndex] = {
                ...exercise,
                sets: [...exercise.sets, newSet]
            };
        }

        setFormData({
            ...formData,
            items: updatedItems
        });
    };

    // Update a set
    const updateSet = (itemIndex: number, exerciseIndex: number | null, setIndex: number, field: keyof Set, value: any) => {
        const updatedItems = [...formData.items];
        const item = updatedItems[itemIndex];

        if (isSuperset(item) && exerciseIndex !== null) {
            // Update a set within a superset exercise
            const exercise = item.exercises[exerciseIndex];
            const updatedSets = [...exercise.sets];

            updatedSets[setIndex] = {
                ...updatedSets[setIndex],
                [field]: value
            };

            const updatedExercises = [...item.exercises];
            updatedExercises[exerciseIndex] = {
                ...exercise,
                sets: updatedSets
            };

            updatedItems[itemIndex] = {
                ...item,
                exercises: updatedExercises
            };
        } else if (!isSuperset(item) && exerciseIndex === null) {
            // Update a set in a standalone exercise
            const exercise = item as Exercise;
            const updatedSets = [...exercise.sets];

            updatedSets[setIndex] = {
                ...updatedSets[setIndex],
                [field]: value
            };

            updatedItems[itemIndex] = {
                ...exercise,
                sets: updatedSets
            };
        }

        setFormData({
            ...formData,
            items: updatedItems
        });
    };

    // Remove a set
    const removeSet = (itemIndex: number, exerciseIndex: number | null, setIndex: number) => {
        const updatedItems = [...formData.items];
        const item = updatedItems[itemIndex];

        if (isSuperset(item) && exerciseIndex !== null) {
            // Remove a set from a superset exercise
            const exercise = item.exercises[exerciseIndex];
            const updatedSets = exercise.sets.filter((_, i) => i !== setIndex);

            const updatedExercises = [...item.exercises];
            updatedExercises[exerciseIndex] = {
                ...exercise,
                sets: updatedSets
            };

            updatedItems[itemIndex] = {
                ...item,
                exercises: updatedExercises
            };
        } else if (!isSuperset(item) && exerciseIndex === null) {
            // Remove a set from a standalone exercise
            const exercise = item as Exercise;
            const updatedSets = exercise.sets.filter((_, i) => i !== setIndex);

            updatedItems[itemIndex] = {
                ...exercise,
                sets: updatedSets
            };
        }

        setFormData({
            ...formData,
            items: updatedItems
        });
    };

    // Submit the form
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    // Available muscle groups
    const muscleGroups: { label: string; value: MuscleGroup }[] = [
        { label: "Chest", value: "chest" },
        { label: "Back", value: "back" },
        { label: "Shoulders", value: "shoulders" },
        { label: "Biceps", value: "biceps" },
        { label: "Triceps", value: "triceps" },
        { label: "Legs", value: "legs" },
        { label: "Core", value: "core" },
        { label: "Cardio", value: "cardio" },
        { label: "Full Body", value: "fullBody" }
    ];

    // Render an exercise form (either standalone or part of a superset)
    const renderExerciseForm = (
        exercise: Exercise,
        itemIndex: number,
        exerciseIndex: number | null,
        isInSuperset: boolean = false
    ) => {
        return (
            <div className={cn(
                "border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm",
                isInSuperset
                    ? "mb-4 bg-white dark:bg-gray-800"
                    : "bg-white dark:bg-gray-800"
            )}>
                {/* Exercise Header */}
                <div className={cn(
                    "p-4 flex flex-wrap gap-4 justify-between items-center",
                    isInSuperset
                        ? "bg-slate-100 dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700"
                        : "bg-slate-50 dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700"
                )}>
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {isInSuperset ? `Exercise ${exerciseIndex! + 1}` : "Exercise Name"}
                        </label>
                        <input
                            type="text"
                            value={exercise.name}
                            placeholder="Enter exercise name"
                            onChange={(e) => updateExercise(itemIndex, exerciseIndex, "name", e.target.value)}
                            required
                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>

                    <div className="w-48">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Muscle Group
                        </label>
                        <Select
                            value={exercise.muscleGroup}
                            onValueChange={(value) => updateExercise(itemIndex, exerciseIndex, "muscleGroup", value as MuscleGroup)}
                        >
                            <SelectTrigger className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {muscleGroups.map((group) => (
                                    <SelectItem key={group.value} value={group.value}>
                                        {group.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-shrink-0 space-x-2">
                        {!isInSuperset ? (
                            <>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => convertToSuperset(itemIndex)}
                                    className="flex items-center gap-1 bg-white dark:bg-gray-800 text-blue-600 border-blue-300 dark:border-blue-700 dark:text-blue-400"
                                    title="Convert to superset"
                                >
                                    <ArrowLeftRight className="h-4 w-4" />
                                    <span>Superset</span>
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeItem(itemIndex)}
                                    className="bg-white dark:bg-gray-800 text-red-600 border-red-300 dark:border-red-700 dark:text-red-400"
                                    title="Remove exercise"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Remove Exercise</span>
                                </Button>
                            </>
                        ) : (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeExerciseFromSuperset(itemIndex, exerciseIndex!)}
                                className="bg-white dark:bg-gray-800 text-red-600 border-red-300 dark:border-red-700 dark:text-red-400"
                                title="Remove exercise from superset"
                            >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove Exercise</span>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Sets */}
                <div className="p-4">
                    <div className="mb-4 flex justify-between items-center">
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">Sets</h4>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addSet(itemIndex, exerciseIndex)}
                            className="flex items-center gap-1 bg-white dark:bg-gray-800 text-green-600 border-green-300 dark:border-green-700 dark:text-green-400"
                        >
                            <PlusCircle className="h-4 w-4" />
                            Add Set
                        </Button>
                    </div>

                    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900">
                                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Set</th>
                                    <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Weight (lbs)</th>
                                    <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Reps</th>
                                    <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Completed</th>
                                    <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {exercise.sets.map((set, setIndex) => (
                                    <tr
                                        key={set.id}
                                        className={cn(
                                            "border-b border-gray-200 dark:border-gray-700 last:border-b-0",
                                            setIndex % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-slate-50 dark:bg-gray-900"
                                        )}
                                    >
                                        <td className="py-3 px-4">{setIndex + 1}</td>
                                        <td className="py-3 px-4 text-center">
                                            <input
                                                type="number"
                                                min="0"
                                                value={set.weight}
                                                onChange={(e) => updateSet(itemIndex, exerciseIndex, setIndex, "weight", parseInt(e.target.value) || 0)}
                                                className="w-24 text-center rounded-md border border-gray-300 dark:border-gray-600 py-1 px-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            />
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <input
                                                type="number"
                                                min="1"
                                                value={set.reps}
                                                onChange={(e) => updateSet(itemIndex, exerciseIndex, setIndex, "reps", parseInt(e.target.value) || 1)}
                                                className="w-24 text-center rounded-md border border-gray-300 dark:border-gray-600 py-1 px-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            />
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <input
                                                type="checkbox"
                                                checked={set.completed}
                                                onChange={(e) => updateSet(itemIndex, exerciseIndex, setIndex, "completed", e.target.checked)}
                                                className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                                            />
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeSet(itemIndex, exerciseIndex, setIndex)}
                                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                                disabled={exercise.sets.length <= 1}
                                            >
                                                <MinusCircle className="h-4 w-4" />
                                                <span className="sr-only">Remove Set</span>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Exercise Notes (Optional)
                        </label>
                        <textarea
                            value={exercise.notes || ""}
                            onChange={(e) => updateExercise(itemIndex, exerciseIndex, "notes", e.target.value)}
                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            rows={2}
                            placeholder="Add any notes about this exercise..."
                        />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                    {workout ? "Edit Workout" : "Create Workout"}
                </h2>

                {/* Workout Details */}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="workoutName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Workout Name
                        </label>
                        <input
                            id="workoutName"
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleWorkoutChange("name", e.target.value)}
                            required
                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>

                    <div>
                        <label htmlFor="workoutDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Date & Time
                        </label>
                        <input
                            id="workoutDate"
                            type="datetime-local"
                            value={formData.date.substring(0, 16)}
                            onChange={(e) => handleWorkoutChange("date", new Date(e.target.value).toISOString())}
                            required
                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>

                    <div>
                        <label htmlFor="workoutNotes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Notes (Optional)
                        </label>
                        <textarea
                            id="workoutNotes"
                            value={formData.notes || ""}
                            onChange={(e) => handleWorkoutChange("notes", e.target.value)}
                            rows={3}
                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>

                    <div>
                        <label htmlFor="workoutDuration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Duration (minutes)
                        </label>
                        <input
                            id="workoutDuration"
                            type="number"
                            min="1"
                            value={formData.duration || ""}
                            onChange={(e) => handleWorkoutChange("duration", parseInt(e.target.value) || undefined)}
                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>
                </div>
            </div>

            {/* Mark as Completed Section */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <div className="flex items-center">
                    <input
                        id="workoutCompleted"
                        type="checkbox"
                        checked={formData.completed}
                        onChange={(e) => handleWorkoutChange("completed", e.target.checked)}
                        className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                    />
                    <label htmlFor="workoutCompleted" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        Mark workout as completed
                    </label>
                </div>
            </div>

            {/* Unified Exercises and Supersets List */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Exercises</h2>
                </div>

                {formData.items.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md">
                        <p className="text-gray-500 dark:text-gray-400">
                            No exercises added yet. Click "Add Exercise" to get started.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {formData.items.map((item, itemIndex) => {
                            if (isSuperset(item)) {
                                // Render superset
                                return (
                                    <div
                                        key={item.id}
                                        className="border border-blue-300 dark:border-blue-700 rounded-xl overflow-hidden shadow-sm"
                                    >
                                        <div className="bg-blue-100 dark:bg-blue-950 p-4 flex justify-between items-center">
                                            <h3 className="font-semibold flex items-center text-blue-800 dark:text-blue-300">
                                                <ArrowLeftRight className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                                                Superset
                                            </h3>
                                            <div className="flex space-x-3">
                                                {/* Add Exercise to Superset Button */}
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => addExerciseToSuperset(itemIndex)}
                                                    className="flex items-center gap-1 bg-white dark:bg-gray-800 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400"
                                                >
                                                    <PlusCircle className="h-4 w-4" />
                                                    <span>Add Exercise</span>
                                                </Button>

                                                {/* Remove Superset Button */}
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removeItem(itemIndex)}
                                                    className="bg-white dark:bg-gray-800 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Remove Superset</span>
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="p-5 space-y-4 bg-slate-50 dark:bg-gray-900">
                                            {item.exercises.map((exercise, exerciseIndex) =>
                                                renderExerciseForm(exercise, itemIndex, exerciseIndex, true)
                                            )}
                                        </div>
                                    </div>
                                );
                            } else {
                                // Render single exercise
                                return renderExerciseForm(item as Exercise, itemIndex, null);
                            }
                        })}
                    </div>
                )}

                {/* Add Exercise button moved to bottom */}
                <div className="mt-4 text-center">
                    <Button
                        type="button"
                        onClick={addExercise}
                        className="flex items-center gap-1"
                    >
                        <Dumbbell className="h-4 w-4" />
                        Add Exercise
                    </Button>
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="flex items-center gap-2"
                >
                    <Save className="h-4 w-4" />
                    {workout ? "Update Workout" : "Create Workout"}
                </Button>
            </div>
        </form>
    );
}