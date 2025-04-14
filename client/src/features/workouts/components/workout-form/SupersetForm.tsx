import { ArrowLeftRight, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Exercise, SuperSet } from "../../types";
import { createDefaultExercise } from "./form-utils";
import ExerciseForm from "./ExerciseForm";

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
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onRemove}
                        className="text-red-600 dark:text-red-400 p-1"
                    >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove Superset</span>
                    </Button>
                </div>
            </div>

            <div className="px-4 pb-4 space-y-4">
                {superset.exercises.map((exercise, exerciseIndex) => (
                    <div key={exercise.id} className="border-b last:border-b-0 border-gray-200 dark:border-gray-700 pb-4 last:pb-0">
                        <ExerciseForm
                            exercise={exercise}
                            exerciseIndex={exerciseIndex}
                            isInSuperset={true}
                            onUpdate={(updatedExercise) => updateExerciseInSuperset(exerciseIndex, updatedExercise)}
                            onRemove={() => removeExerciseFromSuperset(exerciseIndex)}
                        />
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