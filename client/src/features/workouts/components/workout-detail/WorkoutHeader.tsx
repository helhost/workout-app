import { Workout } from "../../types";
import { cn } from "@/lib/utils";

interface WorkoutHeaderProps {
    workout: Pick<Workout, 'name' | 'date' | 'duration' | 'completed'>;
    className?: string;
}

export function WorkoutHeader({
    workout: { name, date, duration, completed },
    className
}: WorkoutHeaderProps) {
    // Format date with full details
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className={cn(
            "bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm",
            className
        )}>
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-xl font-bold">{name}</h1>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {formattedDate}
                        {duration && ` • ${duration} mins`}
                    </div>
                </div>

                {/* Completion Status */}
                <div
                    className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium",
                        completed
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                    )}
                >
                    {completed ? "Completed" : "Pending"}
                </div>
            </div>
        </div>
    );
}