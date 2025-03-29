import { cn } from "@/lib/utils";
import WorkoutItem from "./WorkoutItem";
import { WorkoutsListProps } from "../types";

export default function WorkoutsList({
    workouts,
    onWorkoutClick,
    className
}: WorkoutsListProps) {
    if (workouts.length === 0) {
        return (
            <div className={cn("text-center py-8", className)}>
                <p className="text-gray-500 dark:text-gray-400">
                    No workouts found. Create your first workout!
                </p>
            </div>
        );
    }

    return (
        <div className={cn("space-y-4", className)}>
            {workouts.map((workout) => (
                <WorkoutItem
                    key={workout.id}
                    workout={workout}
                    onClick={onWorkoutClick}
                />
            ))}
        </div>
    );
}