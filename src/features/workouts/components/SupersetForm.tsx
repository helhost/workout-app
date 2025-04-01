import { ArrowLeftRight, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Exercise, SuperSet } from "../types";
import { ExerciseForm } from "./ExerciseForm";

interface SupersetFormProps {
    superset: SuperSet;
    onUpdate: (superset: SuperSet) => void;
    onRemove: () => void;
    generateId: (prefix: string) => string;
}

export function SupersetForm({
    superset,
    onUpdate,
    onRemove,
    generateId
}: SupersetFormProps) {
    // Create a new empty exercise
    const createEmptyExercise = (): Exercise => ({
        id: generateId('ex'),
        name: "",
        muscleGroup: "fullBody",
        sets: [
            {
                id: generateId('set'),
                weight: 0,
                reps: 10,
                completed: false
            }
        ]
    });

    // Add a new exercise to the superset
    const addExerciseToSuperset = () => {
        const newExercise = createEmptyExercise();
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
        <div className="border border-blue-300 dark:border-blue-700 rounded-xl overflow-hidden shadow-sm">
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
                        <span>Add Exercise</span>
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

            <div className="p-5 space-y-4 bg-slate-50 dark:bg-gray-900">
                {superset.exercises.map((exercise, exerciseIndex) => (
                    <ExerciseForm
                        key={exercise.id}
                        exercise={exercise}
                        exerciseIndex={exerciseIndex}
                        isInSuperset={true}
                        onUpdate={(updatedExercise) => updateExerciseInSuperset(exerciseIndex, updatedExercise)}
                        onRemove={() => removeExerciseFromSuperset(exerciseIndex)}
                        onConvertToSuperset={() => { }} // Not used in superset context
                        generateId={generateId}
                    />
                ))}
            </div>
        </div>
    );
}