import { Button } from "@/components/ui/button";
import { Workout } from "../types";

interface EditButtonProps {
    workout: Workout;
    onEdit?: (workout: Workout) => void;
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