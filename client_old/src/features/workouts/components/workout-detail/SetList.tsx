import { CheckCircle, XCircle } from "lucide-react";
import { Set } from "../../types";
import { cn } from "@/lib/utils";

interface SetListProps {
    sets: Set[];
}

export function SetList({ sets }: SetListProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                        <th className="p-2">Weight</th>
                        <th className="p-2">Reps</th>
                        <th className="p-2">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {sets.map((set, index) => (
                        <tr
                            key={set.id}
                            className={cn(
                                "border-b border-gray-200 dark:border-gray-700 last:border-b-0",
                                index % 2 === 0
                                    ? "bg-white dark:bg-gray-800"
                                    : "bg-gray-50 dark:bg-gray-900/50"
                            )}
                        >
                            <td className="p-2 text-center">
                                {set.weight > 0 ? `${set.weight} lbs` : 'Bodyweight'}
                            </td>
                            <td className="p-2 text-center">{set.reps}</td>
                            <td className="p-2 text-center">
                                {set.completed ? (
                                    <CheckCircle className="mx-auto h-5 w-5 text-green-500" />
                                ) : (
                                    <XCircle className="mx-auto h-5 w-5 text-red-500" />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}