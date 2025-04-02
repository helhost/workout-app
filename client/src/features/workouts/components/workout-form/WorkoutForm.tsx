import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Workout } from "../../types";
import { WorkoutFormHeader } from "./WorkoutFormHeader";
import { WorkoutFormCompletionToggle } from "./WorkoutFormCompletionToggle";
import { WorkoutItemsList } from "./WorkoutItemsList";

interface WorkoutFormProps {
    workout?: Workout;
    onSave: (workout: Workout) => void;
    onCancel: () => void;
    className?: string;
}

export default function WorkoutForm({
    workout,
    onSave,
    onCancel,
    className
}: WorkoutFormProps) {
    // Initialize form state with provided workout or default values
    const [formData, setFormData] = useState<Workout>(
        workout || {
            id: `workout-${Date.now()}`,
            name: "",
            date: new Date().toISOString(),
            items: [],
            completed: false,
        }
    );

    // Helper function to generate unique IDs
    const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Handle changes to workout level fields
    const handleWorkoutChange = (field: keyof Workout, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    // Handle changes to workout items (exercises and supersets)
    const handleWorkoutItemsChange = (items: Workout['items']) => {
        setFormData({ ...formData, items });
    };

    // Submit the form
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                    {workout ? "Edit Workout" : "Create Workout"}
                </h2>

                {/* Workout Details */}
                <WorkoutFormHeader
                    name={formData.name}
                    date={formData.date}
                    notes={formData.notes}
                    duration={formData.duration}
                    onChange={handleWorkoutChange}
                />
            </div>

            {/* Mark as Completed Section */}
            <WorkoutFormCompletionToggle
                completed={formData.completed}
                onChange={(completed) => handleWorkoutChange("completed", completed)}
            />

            {/* Unified Exercises and Supersets List */}
            <WorkoutItemsList
                items={formData.items}
                onItemsChange={handleWorkoutItemsChange}
                generateId={generateId}
            />

            {/* Form Actions */}
            <div className="flex justify-end gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    className="flex items-center gap-2"
                >
                    <Save className="h-4 w-4" />
                    {workout ? "Update Workout" : "Create Workout"}
                </Button>
            </div>
        </form>
    );
}