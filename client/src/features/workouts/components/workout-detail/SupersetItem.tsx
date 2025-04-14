import { ArrowLeftRight } from "lucide-react";
import { SuperSet } from "../../types";
import { SetList } from "./SetList";

interface SupersetItemProps {
    superset: SuperSet;
}

export function SupersetItem({ superset }: SupersetItemProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-950 p-3 mb-4">
                <ArrowLeftRight className="size-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-blue-800 dark:text-blue-300">Superset</h3>
            </div>

            <div className="px-4 pb-4 space-y-4">
                {superset.exercises.map((exercise) => (
                    <div key={exercise.id} className="border-b last:border-b-0 border-gray-200 dark:border-gray-700 pb-4 last:pb-0">
                        <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{exercise.name}</h4>
                            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                                {exercise.muscleGroup}
                            </span>
                        </div>

                        {exercise.notes && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-2">
                                {exercise.notes}
                            </p>
                        )}

                        <SetList sets={exercise.sets} />
                    </div>
                ))}
            </div>
        </div>
    );
}