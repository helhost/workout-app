import { SuperSet } from "../../types";
import { ExerciseItem } from "./ExerciseItem";
import { ArrowLeftRight } from "lucide-react";

interface SupersetItemProps {
    superset: SuperSet;
}

export function SupersetItem({ superset }: SupersetItemProps) {
    // Check if all exercises in superset are completed
    const isSupersetCompleted = superset.exercises.every(exercise =>
        exercise.sets.every(set => set.completed)
    );

    return (
        <div className="bg-blue-50 dark:bg-blue-950 rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 p-3">
                <ArrowLeftRight className="size-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-blue-800 dark:text-blue-300">Superset</h3>

                {/* Completed Indicator */}
                <div
                    className={`ml-auto size-4 rounded-full ${isSupersetCompleted
                        ? 'bg-green-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                ></div>
            </div>

            <div className="space-y-4 p-4">
                {superset.exercises.map((exercise) => (
                    <ExerciseItem key={exercise.id} exercise={exercise} />
                ))}
            </div>
        </div>
    );
}