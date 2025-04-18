import { Button } from "@/components/ui/button";
import { MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Workout } from "@shared";
import SetComplete from "./SetComplete";

interface SetFormProps {
    set: Workout.ExerciseSet;
    index: number;
    onChange: (updatedSet: Workout.ExerciseSet) => void;
    onRemove: () => void;
    canDelete: boolean;
    className?: string;
}

const SetForm = ({
    set,
    index,
    onChange,
    onRemove,
    canDelete,
    className
}: SetFormProps) => {
    // Update a specific field of the set
    const updateField = <K extends keyof Workout.ExerciseSet>(field: K, value: Workout.ExerciseSet[K]) => {
        onChange({
            ...set,
            [field]: value
        });
    };

    return (
        <tr className={cn(
            "border-b border-gray-200 dark:border-gray-700 last:border-b-0",
            index % 2 === 0
                ? "bg-white dark:bg-gray-800"
                : "bg-gray-50 dark:bg-gray-900/50",
            className
        )}>
            <td className="p-2 text-center">
                <input
                    type="number"
                    min="0"
                    value={set.weight}
                    onChange={(e) => updateField("weight", parseInt(e.target.value) || 0)}
                    className="w-12 text-center rounded-md border border-gray-300 dark:border-gray-600 py-1 px-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    aria-label="Weight in pounds"
                />
            </td>
            <td className="p-2 text-center">
                <input
                    type="number"
                    min="1"
                    value={set.reps}
                    onChange={(e) => updateField("reps", parseInt(e.target.value) || 1)}
                    className="w-12 text-center rounded-md border border-gray-300 dark:border-gray-600 py-1 px-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    aria-label="Number of repetitions"
                />
            </td>
            <td className="p-2 text-center">
                <SetComplete
                    completed={!!set.completed}
                    onChange={(completed) => updateField("completed", completed)}
                />
            </td>
            <td className="p-2 text-right">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onRemove}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
                    disabled={!canDelete}
                    title={canDelete ? "Remove set" : "At least one set is required"}
                >
                    <MinusCircle className="h-4 w-4" />
                    <span className="sr-only">Remove Set</span>
                </Button>
            </td>
        </tr>
    );
};

export default SetForm;