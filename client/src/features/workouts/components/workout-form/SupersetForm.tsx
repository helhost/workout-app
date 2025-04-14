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
        <div className={cn(
            "rounded-lg overflow-hidden shadow-sm border border-blue-300 dark:border-blue-700",
            className
        )}>
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
                        onClick={addExerciseToSuperset}
                        className="flex items-center gap-1 bg-white dark:bg-gray-800 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400"
                    >
                        <PlusCircle className="h-4 w-4" />
                        <span className="hidden sm:inline">Add Exercise</span>
                    </Button>

                    {/* Remove Superset Button */}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onRemove}
                        className="bg-white dark:bg-gray-800 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400"
                    >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove Superset</span>
                    </Button>
                </div>
            </div>

            <div className="p-5 space-y-4 bg-white dark:bg-gray-900">
                {superset.exercises.map((exercise, exerciseIndex) => (
                    <ExerciseForm
                        key={exercise.id}
                        exercise={exercise}
                        exerciseIndex={exerciseIndex}
                        isInSuperset={true}
                        onUpdate={(updatedExercise) => updateExerciseInSuperset(exerciseIndex, updatedExercise)}
                        onRemove={() => removeExerciseFromSuperset(exerciseIndex)}
                        className="bg-white dark:bg-gray-800"
                    />
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
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    rows={2}
                    placeholder="Add any notes about this superset..."
                />
            </div>
        </div>
    );
};

export default SupersetForm;