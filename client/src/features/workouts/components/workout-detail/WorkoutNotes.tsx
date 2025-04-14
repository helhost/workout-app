import { cn } from "@/lib/utils";

interface WorkoutNotesProps {
    notes: string;
    className?: string;
}

export function WorkoutNotes({ notes, className }: WorkoutNotesProps) {
    return (
        <div className={cn(
            "bg-white dark:bg-gray-800 p-4 rounded-lg",
            className
        )}>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                Notes
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
                {notes}
            </p>
        </div>
    );
}