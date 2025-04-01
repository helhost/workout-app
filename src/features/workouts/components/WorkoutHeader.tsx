import { Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkoutHeaderProps {
    name: string;
    date: string;
    duration?: number;
    completed: boolean;
}

export function WorkoutHeader({ name, date, duration, completed }: WorkoutHeaderProps) {
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
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold">{name}</h1>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(date)}</span>

                        {duration && (
                            <>
                                <Clock className="h-4 w-4 ml-3" />
                                <span>{duration} minutes</span>
                            </>
                        )}
                    </div>
                </div>

                <div className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium",
                    completed
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                )}>
                    {completed ? "Completed" : "Pending"}
                </div>
            </div>
        </div>
    );
}