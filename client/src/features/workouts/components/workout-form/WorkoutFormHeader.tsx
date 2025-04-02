import { Workout } from "../../types";

interface WorkoutFormHeaderProps {
    name: string;
    date: string;
    notes?: string;
    duration?: number;
    onChange: (field: keyof Workout, value: any) => void;
}

export function WorkoutFormHeader({
    name,
    date,
    notes,
    duration,
    onChange
}: WorkoutFormHeaderProps) {
    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="workoutName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Workout Name
                </label>
                <input
                    id="workoutName"
                    type="text"
                    value={name}
                    onChange={(e) => onChange("name", e.target.value)}
                    required
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
            </div>

            <div>
                <label htmlFor="workoutDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date & Time
                </label>
                <input
                    id="workoutDate"
                    type="datetime-local"
                    value={date.substring(0, 16)}
                    onChange={(e) => onChange("date", new Date(e.target.value).toISOString())}
                    required
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
            </div>

            <div>
                <label htmlFor="workoutNotes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes (Optional)
                </label>
                <textarea
                    id="workoutNotes"
                    value={notes || ""}
                    onChange={(e) => onChange("notes", e.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
            </div>

            <div>
                <label htmlFor="workoutDuration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Duration (minutes)
                </label>
                <input
                    id="workoutDuration"
                    type="number"
                    min="1"
                    value={duration || ""}
                    onChange={(e) => onChange("duration", parseInt(e.target.value) || undefined)}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
            </div>
        </div>
    );
}