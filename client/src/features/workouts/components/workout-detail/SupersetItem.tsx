import { ArrowLeftRight } from "lucide-react";
import { SuperSet } from "../../types";
import { ExerciseItem } from "./ExerciseItem";

interface SupersetItemProps {
    superset: SuperSet;
}

export function SupersetItem({ superset }: SupersetItemProps) {
    return (
        <div className="bg-blue-50 dark:bg-blue-950 rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 p-3">
                <ArrowLeftRight className="size-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-blue-800 dark:text-blue-300">Superset</h3>
            </div>

            <div className="space-y-4 p-4">
                {superset.exercises.map((exercise) => (
                    <ExerciseItem key={exercise.id} exercise={exercise} />
                ))}
            </div>
        </div>
    );
}