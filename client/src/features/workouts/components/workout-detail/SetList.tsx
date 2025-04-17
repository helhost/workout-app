// import { CheckCircle, XCircle } from "lucide-react";
import { ExerciseSet } from "@/types/workout";
import { cn } from "@/lib/utils";

interface SetListProps {
    sets: ExerciseSet[];
}

export function SetList({ sets }: SetListProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                        <th className="p-2">Set</th>
                        <th className="p-2">Weight</th>
                        <th className="p-2">Reps</th>
                        <th className="p-2">Order</th>
                    </tr>
                </thead>
                <tbody>
                    {sets.map((set, index) => (
                        <tr
                            key={set.id || index}
                            className={cn(
                                "border-b border-gray-200 dark:border-gray-700 last:border-b-0",
                                index % 2 === 0
                                    ? "bg-white dark:bg-gray-800"
                                    : "bg-gray-50 dark:bg-gray-900/50"
                            )}
                        >
                            <td className="p-2 text-center">
                                {index + 1}
                            </td>
                            <td className="p-2 text-center">
                                {set.weight > 0 ? `${set.weight} lbs` : 'Bodyweight'}
                            </td>
                            <td className="p-2 text-center">{set.reps}</td>
                            <td className="p-2 text-center">{set.order}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}