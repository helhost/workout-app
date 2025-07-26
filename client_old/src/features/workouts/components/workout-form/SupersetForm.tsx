import { ArrowLeftRight, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Exercise, SuperSet } from "../../types";
import { createDefaultExercise } from "./form-utils";
import SetComplete from "./SetComplete";
import MuscleGroupSelect from "./MuscleGroupSelect";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";

interface SupersetFormProps {
    superset: SuperSet;
    onUpdate: (superset: SuperSet) => void;
    onRemove: () => void;
    className?: string;
}

const SupersetForm = ({
    superset,
    onUpdate,
    onRemove,
    className
}: SupersetFormProps) => {
    // Add a new exercise to the superset
    const addExerciseToSuperset = () => {
        const newExercise = createDefaultExercise();
        onUpdate({
            ...superset,
            exercises: [...superset.exercises, newExercise]
        });
    };

    // Update an exercise within the superset
    const updateExerciseInSuperset = (exerciseIndex: number, updatedExercise: Exercise) => {
        const updatedExercises = [...superset.exercises];
        updatedExercises[exerciseIndex] = updatedExercise;

        onUpdate({
            ...superset,
            exercises: updatedExercises
        });
    };

    // Remove an exercise from the superset
    const removeExerciseFromSuperset = (exerciseIndex: number) => {
        // If this is the last exercise in the superset, remove the entire superset
        if (superset.exercises.length <= 1) {
            onRemove();
            return;
        }

        // Otherwise, remove just the specific exercise
        const updatedExercises = superset.exercises.filter((_, i) => i !== exerciseIndex);

        onUpdate({
            ...superset,
            exercises: updatedExercises
        });
    };

    return (
        <div className={cn("bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm", className)}>
            {/* Superset Header - Styled to match SupersetItem */}
            <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-950 p-3 mb-4">
                <ArrowLeftRight className="size-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-blue-800 dark:text-blue-300">Superset</h3>

                <div className="ml-auto flex space-x-3">
                    {/* Add Exercise to Superset Button */}
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={addExerciseToSuperset}
                        className="flex items-center gap-1 text-blue-700 dark:text-blue-400"
                    >
                        <PlusCircle className="h-4 w-4" />
                        <span className="hidden sm:inline">Add Exercise</span>
                    </Button>

                    {/* Remove Superset Button */}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-red-600 dark:text-red-400 p-1"
                            >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove Superset</span>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Remove Superset</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to remove this entire superset?
                                    This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={onRemove}>
                                    Remove Superset
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            <div className="px-4 pb-4 space-y-4">
                {superset.exercises.map((exercise, exerciseIndex) => (
                    <div
                        key={exercise.id}
                        className="border-b last:border-b-0 border-gray-200 dark:border-gray-700 pb-4 last:pb-0"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <input
                                type="text"
                                value={exercise.name}
                                placeholder={`Exercise ${exerciseIndex + 1}`}
                                onChange={(e) => updateExerciseInSuperset(exerciseIndex, {
                                    ...exercise,
                                    name: e.target.value
                                })}
                                required
                                className="font-medium bg-transparent border-none p-0 focus:outline-none focus:ring-0 text-gray-900 dark:text-gray-100 w-full max-w-[180px]"
                            />
                            <MuscleGroupSelect
                                value={exercise.muscleGroup}
                                onChange={(value) => updateExerciseInSuperset(exerciseIndex, {
                                    ...exercise,
                                    muscleGroup: value
                                })}
                                className="text-xs text-gray-500 dark:text-gray-400 capitalize bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded border-none"
                            />
                        </div>

                        <textarea
                            value={exercise.notes || ""}
                            onChange={(e) => updateExerciseInSuperset(exerciseIndex, {
                                ...exercise,
                                notes: e.target.value
                            })}
                            className="text-sm text-gray-600 dark:text-gray-400 italic mb-2 w-full bg-transparent border-none p-0 focus:outline-none focus:ring-0 resize-none h-8"
                            placeholder="Add any notes about this exercise..."
                        />

                        {/* Sets Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                                        <th className="p-2">Weight</th>
                                        <th className="p-2">Reps</th>
                                        <th className="p-2">Status</th>
                                        <th className="p-2 text-right">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    const updatedSets = [...exercise.sets, {
                                                        id: `set-${Date.now()}`,
                                                        weight: exercise.sets[exercise.sets.length - 1]?.weight || 0,
                                                        reps: exercise.sets[exercise.sets.length - 1]?.reps || 10,
                                                        completed: false
                                                    }];
                                                    updateExerciseInSuperset(exerciseIndex, {
                                                        ...exercise,
                                                        sets: updatedSets
                                                    });
                                                }}
                                                className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 p-1"
                                            >
                                                <PlusCircle className="h-4 w-4" />
                                                <span className="sr-only">Add Set</span>
                                            </Button>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {exercise.sets.map((set, setIndex) => (
                                        <tr
                                            key={set.id}
                                            className={cn(
                                                "border-b border-gray-200 dark:border-gray-700 last:border-b-0",
                                                setIndex % 2 === 0
                                                    ? "bg-white dark:bg-gray-800"
                                                    : "bg-gray-50 dark:bg-gray-900/50"
                                            )}
                                        >
                                            <td className="p-2 text-center">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={set.weight}
                                                    onChange={(e) => {
                                                        const updatedSets = [...exercise.sets];
                                                        updatedSets[setIndex] = {
                                                            ...set,
                                                            weight: parseInt(e.target.value) || 0
                                                        };
                                                        updateExerciseInSuperset(exerciseIndex, {
                                                            ...exercise,
                                                            sets: updatedSets
                                                        });
                                                    }}
                                                    className="w-12 text-center rounded-md border border-gray-300 dark:border-gray-600 py-1 px-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                    aria-label="Weight in pounds"
                                                />
                                            </td>
                                            <td className="p-2 text-center">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={set.reps}
                                                    onChange={(e) => {
                                                        const updatedSets = [...exercise.sets];
                                                        updatedSets[setIndex] = {
                                                            ...set,
                                                            reps: parseInt(e.target.value) || 1
                                                        };
                                                        updateExerciseInSuperset(exerciseIndex, {
                                                            ...exercise,
                                                            sets: updatedSets
                                                        });
                                                    }}
                                                    className="w-12 text-center rounded-md border border-gray-300 dark:border-gray-600 py-1 px-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                    aria-label="Number of repetitions"
                                                />
                                            </td>
                                            <td className="p-2 text-center">
                                                <div className="flex justify-center">
                                                    <SetComplete
                                                        completed={set.completed}
                                                        onChange={(completed) => {
                                                            const updatedSets = [...exercise.sets];
                                                            updatedSets[setIndex] = {
                                                                ...set,
                                                                completed
                                                            };
                                                            updateExerciseInSuperset(exerciseIndex, {
                                                                ...exercise,
                                                                sets: updatedSets
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                            <td className="p-2 text-right">
                                                {exercise.sets.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            const updatedSets = exercise.sets.filter((_, i) => i !== setIndex);
                                                            updateExerciseInSuperset(exerciseIndex, {
                                                                ...exercise,
                                                                sets: updatedSets
                                                            });
                                                        }}
                                                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="sr-only">Remove Set</span>
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Remove Exercise from Superset Button */}
                        {superset.exercises.length > 1 && (
                            <div className="mt-2 text-right">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-600 dark:text-red-400 p-1"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Remove Exercise</span>
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Remove Exercise</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to remove this exercise from the superset?
                                                This action cannot be undone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => removeExerciseFromSuperset(exerciseIndex)}>
                                                Remove Exercise
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Notes for the entire superset */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Superset Notes (Optional)
                </label>
                <textarea
                    value={superset.notes || ""}
                    onChange={(e) => onUpdate({ ...superset, notes: e.target.value })}
                    className="text-sm text-gray-600 dark:text-gray-400 italic mb-2 w-full bg-transparent border-none p-0 focus:outline-none focus:ring-0 resize-none h-8"
                    rows={2}
                    placeholder="Add any notes about this superset..."
                />
            </div>
        </div>
    );
};

export default SupersetForm;