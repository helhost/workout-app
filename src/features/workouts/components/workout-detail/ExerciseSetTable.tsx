import { CheckCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Set } from "../types";

interface ExerciseSetTableProps {
    sets: Set[];
}

export function ExerciseSetTable({ sets }: ExerciseSetTableProps) {
    return (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900">
                        <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Set</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Weight</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Reps</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Status</th>
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
                            <td className="py-3 px-4 text-center">{set.weight > 0 ? `${set.weight} lbs` : 'Bodyweight'}</td>
                            <td className="py-3 px-4 text-center">{set.reps}</td>
                            <td className="py-3 px-4 text-center">
                                {set.completed ? (
                                    <span className="inline-flex items-center text-green-500">
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        Completed
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center text-red-500">
                                        <X className="h-4 w-4 mr-1" />
                                        Incomplete
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}