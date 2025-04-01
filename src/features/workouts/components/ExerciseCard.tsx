import { Exercise } from "../types";
import { ExerciseSetTable } from "./ExerciseSetTable";

interface ExerciseCardProps {
    exercise: Exercise;
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm bg-white dark:bg-gray-800">
            <div className="bg-slate-50 dark:bg-gray-800 p-4 flex justify-between items-center border-b border-slate-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-800 dark:text-gray-200">{exercise.name}</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400 capitalize px-3 py-1 bg-slate-200 dark:bg-gray-700 rounded-full">
                    {exercise.muscleGroup}
                </span>
            </div>

            <div className="p-4">
                {exercise.notes && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-3 px-1">{exercise.notes}</p>
                )}

                <ExerciseSetTable sets={exercise.sets} />
            </div>
        </div>
    );
}