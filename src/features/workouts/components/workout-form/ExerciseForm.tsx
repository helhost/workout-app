import { ArrowLeftRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Exercise, MuscleGroup } from "../../types";
import { ExerciseSetsTable } from "./ExerciseSetsTable";
import { MuscleGroupSelect } from "./MuscleGroupSelect";

interface ExerciseFormProps {
    exercise: Exercise;
    onUpdate: (exercise: Exercise) => void;
    onRemove: () => void;
    onConvertToSuperset: () => void;
    generateId: (prefix: string) => string;
    isInSuperset?: boolean;
    exerciseIndex?: number;
}

export function ExerciseForm({
    exercise,
    onUpdate,
    onRemove,
    onConvertToSuperset,
    generateId,
    isInSuperset = false,
    exerciseIndex
}: ExerciseFormProps) {
    // Update a specific field of the exercise
    const updateField = (field: keyof Exercise, value: any) => {
        onUpdate({
            ...exercise,
            [field]: value
        });
    };

    // Update sets for the exercise
    const updateSets = (sets: Exercise['sets']) => {
        onUpdate({
            ...exercise,
            sets
        });
    };

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
                        onChange={(value) => updateField("muscleGroup", value as MuscleGroup)}
                    />
                </div>

                <div className="flex flex-shrink-0 space-x-2">
                    {!isInSuperset ? (
                        <>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={onConvertToSuperset}
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
                                onClick={onRemove}
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
                            onClick={onRemove}
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
                <ExerciseSetsTable
                    sets={exercise.sets}
                    onSetsChange={updateSets}
                    generateId={generateId}
                />

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
}