import { Calendar, Clock, CheckCircle, X, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Workout } from "../types";

interface WorkoutDetailProps {
    workout: Workout;
    onBack?: () => void;
    onEdit?: (workout: Workout) => void;
    className?: string;
}

export default function WorkoutDetail({
    workout,
    onBack,
    onEdit,
    className
}: WorkoutDetailProps) {
    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className={cn("bg-white dark:bg-gray-800 rounded-lg shadow", className)}>
            {/* Header with back button */}
            <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onBack}
                    className="flex items-center gap-1 text-gray-600 dark:text-gray-300"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back to workouts
                </Button>

                {onEdit && (
                    <Button
                        onClick={() => onEdit(workout)}
                        variant="outline"
                        size="sm"
                    >
                        Edit Workout
                    </Button>
                )}
            </div>

            {/* Workout header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold">{workout.name}</h1>
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-2">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(workout.date)}</span>

                            {workout.duration && (
                                <>
                                    <Clock className="h-4 w-4 ml-3" />
                                    <span>{workout.duration} minutes</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium",
                        workout.completed
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                    )}>
                        {workout.completed ? "Completed" : "Pending"}
                    </div>
                </div>

                {workout.notes && (
                    <div className="mt-4 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                        <h3 className="font-medium text-sm text-gray-600 dark:text-gray-300 mb-1">Notes</h3>
                        <p className="text-gray-700 dark:text-gray-300">{workout.notes}</p>
                    </div>
                )}
            </div>

            {/* Exercises */}
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Exercises</h2>

                <div className="space-y-4">
                    {workout.exercises.map((exercise) => (
                        <div key={exercise.id} className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                            <div className="bg-gray-50 dark:bg-gray-700 p-3 flex justify-between items-center">
                                <h3 className="font-medium">{exercise.name}</h3>
                                <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                                    {exercise.muscleGroup}
                                </span>
                            </div>

                            <div className="p-3">
                                {exercise.notes && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-2">{exercise.notes}</p>
                                )}

                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                                                <th className="text-left py-2">Set</th>
                                                <th className="text-center py-2">Weight</th>
                                                <th className="text-center py-2">Reps</th>
                                                <th className="text-center py-2">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {exercise.sets.map((set, index) => (
                                                <tr key={set.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                                                    <td className="py-2 pl-2">{index + 1}</td>
                                                    <td className="py-2 text-center">{set.weight > 0 ? `${set.weight} lbs` : 'Bodyweight'}</td>
                                                    <td className="py-2 text-center">{set.reps}</td>
                                                    <td className="py-2 pr-2 text-center">
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

                                {exercise.restTimeSec && (
                                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        Rest between sets: {exercise.restTimeSec} seconds
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}