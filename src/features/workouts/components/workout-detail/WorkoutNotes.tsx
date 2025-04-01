interface WorkoutNotesProps {
    notes: string;
}

export function WorkoutNotes({ notes }: WorkoutNotesProps) {
    return (
        <div className="mt-4 bg-slate-50 dark:bg-gray-700 p-3 rounded-md mx-6 mb-6">
            <h3 className="font-medium text-sm text-gray-600 dark:text-gray-300 mb-1">Notes</h3>
            <p className="text-gray-700 dark:text-gray-300">{notes}</p>
        </div>
    );
}