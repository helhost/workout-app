import { Workout, isSuperset } from "../types";
import { BackButton } from "./BackButton";
import { EditButton } from "./EditButton";
import { WorkoutHeader } from "./WorkoutHeader";
import { WorkoutNotes } from "./WorkoutNotes";
import { ExerciseCard } from "./ExerciseCard";
import { SupersetCard } from "./SupersetCard";
import { cn } from "@/lib/utils";

interface WorkoutDetailProps {
    workout: Workout;
    onBack?: () => void;
    onEdit?: (workout: Workout) => void;
    className?: string;
}

export default function WorkoutDetail({
    workout,
    onBack,
    onEdit,
    className
}: WorkoutDetailProps) {
    return (
        <div className={cn("bg-white dark:bg-gray-800 rounded-lg shadow", className)}>
            {/* Header with back button */}
            <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
                <BackButton onBack={onBack} />
                <EditButton workout={workout} onEdit={onEdit} />
            </div>

            {/* Workout header */}
            <WorkoutHeader
                name={workout.name}
                date={workout.date}
                duration={workout.duration}
                completed={workout.completed}
            />

            {/* Workout notes */}
            {workout.notes && <WorkoutNotes notes={workout.notes} />}

            {/* Exercises and Supersets */}
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Exercises</h2>

                <div className="space-y-4">
                    {workout.items.map((item) =>
                        isSuperset(item) ? (
                            <SupersetCard key={item.id} superset={item} />
                        ) : (
                            <ExerciseCard key={item.id} exercise={item} />
                        )
                    )}
                </div>
            </div>
        </div>
    );
}