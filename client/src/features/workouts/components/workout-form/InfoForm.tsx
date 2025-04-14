import { cn } from "@/lib/utils";

interface InfoFormProps {
    name: string;
    date: string;
    notes?: string;
    duration?: number;
    onChange: <T extends string | number | undefined>(
        field: 'name' | 'date' | 'notes' | 'duration',
        value: T
    ) => void;
    className?: string;
}

const InfoForm = ({
    name,
    date,
    notes,
    duration,
    onChange,
    className
}: InfoFormProps) => {
    return (
        <div className={cn("space-y-4", className)}>
            <div>
                <label htmlFor="workout-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Workout Name
                </label>
                <input
                    id="workout-name"
                    type="text"
                    value={name}
                    onChange={(e) => onChange("name", e.target.value)}
                    required
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="E.g., Upper Body Strength, Leg Day, etc."
                />
            </div>

            <div>
                <label htmlFor="workout-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date & Time
                </label>
                <input
                    id="workout-date"
                    type="datetime-local"
                    value={date.substring(0, 16)} // Format for datetime-local input
                    onChange={(e) => onChange("date", new Date(e.target.value).toISOString())}
                    required
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
            </div>

            <div>
                <label htmlFor="workout-duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Duration (minutes)
                </label>
                <input
                    id="workout-duration"
                    type="number"
                    min="1"
                    value={duration || ""}
                    onChange={(e) => {
                        const val = e.target.value ? parseInt(e.target.value) : undefined;
                        onChange("duration", val);
                    }}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="How long was your workout?"
                />
            </div>

            <div>
                <label htmlFor="workout-notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes (Optional)
                </label>
                <textarea
                    id="workout-notes"
                    value={notes || ""}
                    onChange={(e) => onChange("notes", e.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Any additional notes about this workout..."
                />
            </div>
        </div>
    );
};

export default InfoForm;