interface WorkoutFormCompletionToggleProps {
    completed: boolean;
    onChange: (checked: boolean) => void;
}

export function WorkoutFormCompletionToggle({
    completed,
    onChange
}: WorkoutFormCompletionToggleProps) {
    return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="flex items-center">
                <input
                    id="workoutCompleted"
                    type="checkbox"
                    checked={completed}
                    onChange={(e) => onChange(e.target.checked)}
                    className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                />
                <label htmlFor="workoutCompleted" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Mark workout as completed
                </label>
            </div>
        </div>
    );
}