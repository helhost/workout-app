import { Button } from "@/components/ui/button";
import { ArrowLeftRight, PlusCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Exercise, Set } from "../../types";
import { createDefaultSet } from "./form-utils";
import MuscleGroupSelect from "./MuscleGroupSelect";
import SetForm from "./SetForm";

interface ExerciseFormProps {
    exercise: Exercise;
    onUpdate: (exercise: Exercise) => void;
    onRemove: () => void;
    onConvertToSuperset?: () => void;
    isInSuperset?: boolean;
    exerciseIndex?: number;
    className?: string;
}

const ExerciseForm = ({
    exercise,
    onUpdate,
    onRemove,
    onConvertToSuperset,
    isInSuperset = false,
    exerciseIndex,
    className
}: ExerciseFormProps) => {
    // Update a specific field of the exercise
    const updateField = <K extends keyof Exercise>(field: K, value: Exercise[K]) => {
        onUpdate({
            ...exercise,
            [field]: value
        });
    };

    // Add a new set to this exercise
    const addSet = () => {
        const lastSet = exercise.sets[exercise.sets.length - 1];

        // Create new set, inheriting weight and reps from last set if possible
        const newSet: Set = createDefaultSet();
        if (lastSet) {
            newSet.weight = lastSet.weight;
            newSet.reps = lastSet.reps;
        }

        updateField("sets", [...exercise.sets, newSet]);
    };

    // Update a specific set
    const updateSet = (index: number, updatedSet: Set) => {
        const updatedSets = [...exercise.sets];
        updatedSets[index] = updatedSet;
        updateField("sets", updatedSets);
    };

    // Remove a set
    const removeSet = (index: number) => {
        updateField("sets", exercise.sets.filter((_, i) => i !== index));
    };

    return (
        <div className={cn(
            "rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700",
            isInSuperset ? "mb-4" : "",
            className
        )}>
            {/* Exercise Header */}
            <div className={cn(
                "p-4 flex flex-wrap gap-4 justify-between items-center border-b border-gray-200 dark:border-gray-700",
                isInSuperset
                    ? "bg-slate-100 dark:bg-gray-800/60"
                    : "bg-white dark:bg-gray-800"
            )}>
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {isInSuperset ? `Exercise ${exerciseIndex! + 1}` : "Exercise Name"}
                    </label>
                    <input
                        type="text"
                        value={exercise.name}
                        placeholder="Enter exercise name"
                        onChange={(e) => updateField("name", e.target.value)}
                        required
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                </div>

                <div className="w-48">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Muscle Group
                    </label>
                    <MuscleGroupSelect
                        value={exercise.muscleGroup}
                        onChange={(value) => updateField("muscleGroup", value)}
                    />
                </div>

                <div className="flex flex-shrink-0 space-x-2">
                    {!isInSuperset && onConvertToSuperset && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onConvertToSuperset}
                            className="flex items-center gap-1 bg-white dark:bg-gray-800 text-blue-600 border-blue-300 dark:border-blue-700 dark:text-blue-400"
                            title="Convert to superset"
                        >
                            <ArrowLeftRight className="h-4 w-4" />
                            <span className="hidden sm:inline">Superset</span>
                        </Button>
                    )}

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onRemove}
                        className="bg-white dark:bg-gray-800 text-red-600 border-red-300 dark:border-red-700 dark:text-red-400"
                        title={isInSuperset ? "Remove from superset" : "Remove exercise"}
                    >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                    </Button>
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
                        onClick={addSet}
                        className="flex items-center gap-1 bg-white dark:bg-gray-800 text-green-600 border-green-300 dark:border-green-700 dark:text-green-400"
                    >
                        <PlusCircle className="h-4 w-4" />
                        Add Set
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                                <th className="p-2 text-left">Set</th>
                                <th className="p-2 text-center">Weight</th>
                                <th className="p-2 text-center">Reps</th>
                                <th className="p-2 text-center">Completed</th>
                                <th className="p-2 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exercise.sets.map((set, index) => (
                                <SetForm
                                    key={set.id}
                                    set={set}
                                    index={index}
                                    onChange={(updatedSet) => updateSet(index, updatedSet)}
                                    onRemove={() => removeSet(index)}
                                    canDelete={exercise.sets.length > 1}
                                />
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
                        onChange={(e) => updateField("notes", e.target.value)}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        rows={2}
                        placeholder="Add any notes about this exercise..."
                    />
                </div>
            </div>
        </div>
    );
};

export default ExerciseForm;