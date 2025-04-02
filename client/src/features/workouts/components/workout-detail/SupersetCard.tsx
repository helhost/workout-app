import { ArrowLeftRight } from "lucide-react";
import { SuperSet } from "../types";
import { ExerciseSetTable } from "./ExerciseSetTable";

interface SupersetCardProps {
    superset: SuperSet;
}

export function SupersetCard({ superset }: SupersetCardProps) {
    return (
        <div className="border border-blue-300 dark:border-blue-700 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-blue-100 dark:bg-blue-950 p-4 flex items-center">
                <ArrowLeftRight className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-blue-800 dark:text-blue-300">Superset</h3>
            </div>

            <div className="p-5 space-y-4 bg-slate-50 dark:bg-gray-900">
                {superset.exercises.map((exercise, exerciseIndex) => (
                    <div key={exercise.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm bg-white dark:bg-gray-800">
                        <div className="bg-slate-100 dark:bg-gray-800 p-4 flex justify-between items-center border-b border-slate-200 dark:border-gray-700">
                            <h4 className="font-medium text-gray-800 dark:text-gray-200">Exercise {exerciseIndex + 1}: {exercise.name}</h4>
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
                ))}
            </div>
        </div>
    );
}