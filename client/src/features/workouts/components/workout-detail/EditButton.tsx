import { Button } from "@/components/ui/button";
import { WorkoutFull } from "@/types/workout";

interface EditButtonProps {
    workout: WorkoutFull;
    onEdit?: (workout: WorkoutFull) => void;
}

export function EditButton({ workout, onEdit }: EditButtonProps) {
    if (!onEdit) return null;

    return (
        <Button
            onClick={() => onEdit(workout)}
            variant="outline"
            size="sm"
            className="text-blue-600 border-blue-300 dark:border-blue-700 dark:text-blue-400"
        >
            Edit Workout
        </Button>
    );
}