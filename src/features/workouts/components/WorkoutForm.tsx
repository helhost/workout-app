import { useState } from "react";
import { PlusCircle, MinusCircle, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Workout, Exercise, Set, MuscleGroup } from "../types";

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
            exercises: [],
            completed: false,
        }
    );

    // Helper function to generate unique IDs
    const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Handle changes to workout level fields
    const handleWorkoutChange = (field: keyof Workout, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    // Add a new exercise to the workout
    const addExercise = () => {
        const newExercise: Exercise = {
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
            ],
            restTimeSec: 60
        };

        setFormData({
            ...formData,
            exercises: [...formData.exercises, newExercise]
        });
    };

    // Update an exercise
    const updateExercise = (index: number, field: keyof Exercise, value: any) => {
        const updatedExercises = [...formData.exercises];
        updatedExercises[index] = {
            ...updatedExercises[index],
            [field]: value
        };

        setFormData({
            ...formData,
            exercises: updatedExercises
        });
    };

    // Remove an exercise
    const removeExercise = (index: number) => {
        const updatedExercises = formData.exercises.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            exercises: updatedExercises
        });
    };

    // Add a new set to an exercise
    const addSet = (exerciseIndex: number) => {
        const updatedExercises = [...formData.exercises];
        const exercise = updatedExercises[exerciseIndex];

        const lastSet = exercise.sets[exercise.sets.length - 1];
        const newSet: Set = {
            id: generateId('set'),
            weight: lastSet?.weight || 0,
            reps: lastSet?.reps || 10,
            completed: false
        };

        updatedExercises[exerciseIndex] = {
            ...exercise,
            sets: [...exercise.sets, newSet]
        };

        setFormData({
            ...formData,
            exercises: updatedExercises
        });
    };

    // Update a set
    const updateSet = (exerciseIndex: number, setIndex: number, field: keyof Set, value: any) => {
        const updatedExercises = [...formData.exercises];
        const exercise = updatedExercises[exerciseIndex];
        const updatedSets = [...exercise.sets];

        updatedSets[setIndex] = {
            ...updatedSets[setIndex],
            [field]: value
        };

        updatedExercises[exerciseIndex] = {
            ...exercise,
            sets: updatedSets
        };

        setFormData({
            ...formData,
            exercises: updatedExercises
        });
    };

    // Remove a set from an exercise
    const removeSet = (exerciseIndex: number, setIndex: number) => {
        const updatedExercises = [...formData.exercises];
        const exercise = updatedExercises[exerciseIndex];
        const updatedSets = exercise.sets.filter((_, i) => i !== setIndex);

        updatedExercises[exerciseIndex] = {
            ...exercise,
            sets: updatedSets
        };

        setFormData({
            ...formData,
            exercises: updatedExercises
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

                    <div className="flex items-center">
                        <input
                            id="workoutCompleted"
                            type="checkbox"
                            checked={formData.completed}
                            onChange={(e) => handleWorkoutChange("completed", e.target.checked)}
                            className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                        />
                        <label htmlFor="workoutCompleted" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                            Mark as completed
                        </label>
                    </div>
                </div>
            </div>

            {/* Exercises */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Exercises</h2>
                    <Button
                        type="button"
                        onClick={addExercise}
                        className="flex items-center gap-1"
                    >
                        <PlusCircle className="h-4 w-4" />
                        Add Exercise
                    </Button>
                </div>

                {formData.exercises.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md">
                        <p className="text-gray-500 dark:text-gray-400">
                            No exercises added yet. Click "Add Exercise" to get started.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {formData.exercises.map((exercise, exerciseIndex) => (
                            <div
                                key={exercise.id}
                                className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden"
                            >
                                {/* Exercise Header */}
                                <div className="bg-gray-50 dark:bg-gray-700 p-4 flex flex-wrap gap-4 justify-between items-center">
                                    <div className="flex-1 min-w-[200px]">
                                        <label htmlFor={`exercise-${exerciseIndex}-name`} className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            Exercise Name
                                        </label>
                                        <input
                                            id={`exercise-${exerciseIndex}-name`}
                                            type="text"
                                            value={exercise.name}
                                            onChange={(e) => updateExercise(exerciseIndex, "name", e.target.value)}
                                            required
                                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-1 px-2 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>

                                    <div className="w-40">
                                        <label htmlFor={`exercise-${exerciseIndex}-muscle`} className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            Muscle Group
                                        </label>
                                        <Select
                                            value={exercise.muscleGroup}
                                            onValueChange={(value) => updateExercise(exerciseIndex, "muscleGroup", value as MuscleGroup)}
                                        >
                                            <SelectTrigger id={`exercise-${exerciseIndex}-muscle`} className="w-full">
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

                                    <div className="w-32">
                                        <label htmlFor={`exercise-${exerciseIndex}-rest`} className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            Rest (sec)
                                        </label>
                                        <input
                                            id={`exercise-${exerciseIndex}-rest`}
                                            type="number"
                                            min="0"
                                            value={exercise.restTimeSec || ""}
                                            onChange={(e) => updateExercise(exerciseIndex, "restTimeSec", parseInt(e.target.value) || undefined)}
                                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-1 px-2 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                                        />
                                    </div>

                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => removeExercise(exerciseIndex)}
                                        className="flex-shrink-0"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Remove Exercise</span>
                                    </Button>
                                </div>

                                {/* Sets */}
                                <div className="p-4">
                                    <div className="mb-3 flex justify-between items-center">
                                        <h4 className="font-medium text-sm">Sets</h4>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => addSet(exerciseIndex)}
                                            className="flex items-center gap-1 text-xs"
                                        >
                                            <PlusCircle className="h-3 w-3" />
                                            Add Set
                                        </Button>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                                                    <th className="text-left py-2 pl-2">Set</th>
                                                    <th className="text-center py-2">Weight (lbs)</th>
                                                    <th className="text-center py-2">Reps</th>
                                                    <th className="text-center py-2">Completed</th>
                                                    <th className="text-right py-2 pr-2">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {exercise.sets.map((set, setIndex) => (
                                                    <tr key={set.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                                                        <td className="py-2 pl-2">{setIndex + 1}</td>
                                                        <td className="py-2 text-center">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                value={set.weight}
                                                                onChange={(e) => updateSet(exerciseIndex, setIndex, "weight", parseInt(e.target.value) || 0)}
                                                                className="w-20 text-center rounded-md border border-gray-300 dark:border-gray-600 py-1 px-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                            />
                                                        </td>
                                                        <td className="py-2 text-center">
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                value={set.reps}
                                                                onChange={(e) => updateSet(exerciseIndex, setIndex, "reps", parseInt(e.target.value) || 1)}
                                                                className="w-20 text-center rounded-md border border-gray-300 dark:border-gray-600 py-1 px-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                            />
                                                        </td>
                                                        <td className="py-2 text-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={set.completed}
                                                                onChange={(e) => updateSet(exerciseIndex, setIndex, "completed", e.target.checked)}
                                                                className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                                                            />
                                                        </td>
                                                        <td className="py-2 pr-2 text-right">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeSet(exerciseIndex, setIndex)}
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

                                    <div className="mt-3">
                                        <label htmlFor={`exercise-${exerciseIndex}-notes`} className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            Exercise Notes (Optional)
                                        </label>
                                        <textarea
                                            id={`exercise-${exerciseIndex}-notes`}
                                            value={exercise.notes || ""}
                                            onChange={(e) => updateExercise(exerciseIndex, "notes", e.target.value)}
                                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-1 px-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            rows={2}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
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