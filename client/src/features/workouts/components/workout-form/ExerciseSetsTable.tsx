import { PlusCircle, MinusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Set } from "../../types";

interface ExerciseSetsTableProps {
    sets: Set[];
    onSetsChange: (sets: Set[]) => void;
    generateId: (prefix: string) => string;
}

export function ExerciseSetsTable({
    sets,
    onSetsChange,
    generateId
}: ExerciseSetsTableProps) {
    // Add a new set
    const addSet = () => {
        const lastSet = sets[sets.length - 1];

        const newSet: Set = {
            id: generateId('set'),
            weight: lastSet?.weight || 0,
            reps: lastSet?.reps || 10,
            completed: false
        };

        onSetsChange([...sets, newSet]);
    };

    // Update a specific set
    const updateSet = (setIndex: number, field: keyof Set, value: any) => {
        const updatedSets = [...sets];
        updatedSets[setIndex] = {
            ...updatedSets[setIndex],
            [field]: value
        };

        onSetsChange(updatedSets);
    };

    // Remove a set
    const removeSet = (setIndex: number) => {
        const updatedSets = sets.filter((_, i) => i !== setIndex);
        onSetsChange(updatedSets);
    };

    return (
        <div>
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
                        {sets.map((set, setIndex) => (
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
                                        onChange={(e) => updateSet(setIndex, "weight", parseInt(e.target.value) || 0)}
                                        className="w-24 text-center rounded-md border border-gray-300 dark:border-gray-600 py-1 px-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    />
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <input
                                        type="number"
                                        min="1"
                                        value={set.reps}
                                        onChange={(e) => updateSet(setIndex, "reps", parseInt(e.target.value) || 1)}
                                        className="w-24 text-center rounded-md border border-gray-300 dark:border-gray-600 py-1 px-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    />
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <input
                                        type="checkbox"
                                        checked={set.completed}
                                        onChange={(e) => updateSet(setIndex, "completed", e.target.checked)}
                                        className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                                    />
                                </td>
                                <td className="py-3 px-4 text-right">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeSet(setIndex)}
                                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                        disabled={sets.length <= 1}
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
        </div>
    );
}