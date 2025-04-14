import { Button } from "@/components/ui/button";
import { ArrowLeftRight, PlusCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Exercise, Set } from "../../types";
import { createDefaultSet } from "./form-utils";
import MuscleGroupSelect from "./MuscleGroupSelect";
import SetForm from "./SetForm";
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
            "bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm",
            isInSuperset ? "" : "p-4",
            className
        )}>
            {/* Exercise Header */}
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    {!isInSuperset ? (
                        <input
                            type="text"
                            value={exercise.name}
                            placeholder="Enter exercise name"
                            onChange={(e) => updateField("name", e.target.value)}
                            required
                            className="font-medium bg-transparent border-none p-0 focus:outline-none focus:ring-0 text-gray-900 dark:text-gray-100 w-full max-w-[180px]"
                        />
                    ) : (
                        <input
                            type="text"
                            value={exercise.name}
                            placeholder={`Exercise ${exerciseIndex! + 1}`}
                            onChange={(e) => updateField("name", e.target.value)}
                            required
                            className="font-medium bg-transparent border-none p-0 focus:outline-none focus:ring-0 text-gray-900 dark:text-gray-100 w-full max-w-[180px]"
                        />
                    )}
                    <MuscleGroupSelect
                        value={exercise.muscleGroup}
                        onChange={(value) => updateField("muscleGroup", value)}
                        className="text-xs text-gray-500 dark:text-gray-400 capitalize bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded border-none"
                    />
                </div>

                <div className="flex space-x-2">
                    {!isInSuperset && onConvertToSuperset && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="flex items-center gap-1 text-blue-600 dark:text-blue-400"
                                >
                                    <ArrowLeftRight className="h-4 w-4" />
                                    <span className="hidden sm:inline">Superset</span>
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Convert to Superset</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to convert this exercise to a superset?
                                        This will create a new exercise alongside the current one.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={onConvertToSuperset}>
                                        Convert to Superset
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-red-600 dark:text-red-400 p-1"
                            >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove</span>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    {isInSuperset ? "Remove Exercise from Superset" : "Remove Exercise"}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to {isInSuperset
                                        ? "remove this exercise from the superset"
                                        : "remove this exercise"
                                    }?
                                    This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={onRemove}>
                                    {isInSuperset ? "Remove Exercise" : "Remove"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            {/* Exercise Notes */}
            <textarea
                value={exercise.notes || ""}
                onChange={(e) => updateField("notes", e.target.value)}
                className="text-sm text-gray-600 dark:text-gray-400 italic mb-2 w-full bg-transparent border-none p-0 focus:outline-none focus:ring-0 resize-none h-8"
                placeholder="Add any notes about this exercise..."
            />

            {/* Sets Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                            <th className="p-2 text-center">Weight</th>
                            <th className="p-2 text-center">Reps</th>
                            <th className="p-2 text-center">Status</th>
                            <th className="p-2 text-right">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={addSet}
                                    className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 p-1"
                                    title="Add set"
                                >
                                    <PlusCircle className="h-4 w-4" />
                                    <span className="sr-only">Add Set</span>
                                </Button>
                            </th>
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
        </div>
    );
};

export default ExerciseForm;