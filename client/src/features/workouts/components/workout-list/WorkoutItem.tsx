import { CheckCircle, Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { WorkoutSummary } from "@/types";

export interface WorkoutItemProps {
    workout: WorkoutSummary;
    onClick?: (workout: WorkoutSummary) => void;
    className?: string;
}

export default function WorkoutItem({
    workout,
    onClick,
    className
}: WorkoutItemProps) {
    // Helper function to format dates without date-fns
    const formatDate = (dateString: string | Date) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Helper function to format time without date-fns
    const formatTime = (dateString: string | Date) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    // Get the workout date from startTime if available, otherwise from createdAt
    const workoutDate = workout.startTime ? workout.startTime : workout.createdAt;

    // Format date and time for display
    const formattedDate = formatDate(workoutDate);
    const formattedTime = formatTime(workoutDate);

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
                {workout.exerciseCount !== undefined && (
                    <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded text-sm">
                        {workout.exerciseCount} {workout.exerciseCount === 1 ? 'exercise' : 'exercises'}
                    </div>
                )}
                {workout.setCount !== undefined && (
                    <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded text-sm">
                        {workout.setCount} {workout.setCount === 1 ? 'set' : 'sets'}
                    </div>
                )}
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