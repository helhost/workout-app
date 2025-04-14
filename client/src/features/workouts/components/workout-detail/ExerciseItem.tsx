import { Exercise } from "../../types";
import { SetList } from "./SetList";

interface ExerciseItemProps {
    exercise: Exercise;
}

export function ExerciseItem({ exercise }: ExerciseItemProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    <h3 className="font-medium">{exercise.name}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 capitalize bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                        {exercise.muscleGroup}
                    </span>
                </div>
            </div>

            {exercise.notes && (
                <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-2">
                    {exercise.notes}
                </p>
            )}

            <SetList sets={exercise.sets} />
        </div>
    );
}