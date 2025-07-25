import { CheckCircle, Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { WorkoutItemProps } from "../../types";
import { calculateExerciseCount, calculateSetCount } from '../../utils';

export default function WorkoutItem({
    workout,
    onClick,
    className
}: WorkoutItemProps) {
    // Helper function to format dates without date-fns
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Helper function to format time without date-fns
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    // Calculate exercise and set counts using utility functions
    const exerciseCount = calculateExerciseCount(workout);
    const setCount = calculateSetCount(workout);

    // Format date and time for display
    const formattedDate = formatDate(workout.date);
    const formattedTime = formatTime(workout.date);

    return (
        <div
            className={cn(
                "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow transition-shadow",
                workout.completed ? "border-l-4 border-l-green-500 dark:border-l-green-500" : "",
                onClick && "cursor-pointer",
                className
            )}
            onClick={() => onClick?.(workout)}
        >
            <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg">{workout.name}</h3>
                {workout.completed && (
                    <span className="flex items-center text-green-500 text-sm">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Completed
                    </span>
                )}
            </div>

            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formattedDate} at {formattedTime}</span>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
                <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded text-sm">
                    {exerciseCount} {exerciseCount === 1 ? 'exercise' : 'exercises'}
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded text-sm">
                    {setCount} {setCount === 1 ? 'set' : 'sets'}
                </div>
                {workout.duration && (
                    <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded text-sm flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {workout.duration} min
                    </div>
                )}
            </div>

            {workout.notes && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 border-t border-gray-100 dark:border-gray-700 pt-2">
                    {workout.notes}
                </p>
            )}
        </div>
    );
}