import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
    BackButton,
    EditButton,
    ExerciseItem,
    SupersetItem,
    WorkoutHeader,
    WorkoutNotes
} from "@/features/workouts/components/workout-detail";
import { getWorkoutById } from "@/features/workouts/api";
import { WorkoutFull } from "@/types";

export default function WorkoutDetailPage() {
    const { workoutId } = useParams<{ workoutId: string }>();
    const navigate = useNavigate();
    const [workout, setWorkout] = useState<WorkoutFull | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWorkout = async () => {
            if (!workoutId) {
                setError("No workout ID provided");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await getWorkoutById(workoutId);
                setWorkout(response.workout);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching workout:", err);
                setError("Failed to load workout details");
                toast.error("Failed to load workout details");
                setLoading(false);
            }
        };

        fetchWorkout();
    }, [workoutId]);

    const handleBack = () => {
        navigate("/workouts");
    };

    const handleEdit = (workout: WorkoutFull) => {
        navigate(`/workouts/${workout.id}/edit`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <p className="text-gray-500 dark:text-gray-400">Loading workout...</p>
            </div>
        );
    }

    if (error || !workout) {
        return (
            <div className="max-w-2xl mx-auto p-6 text-center">
                <h2 className="text-xl font-semibold mb-4">Workout not found</h2>
                <p className="mb-4">The workout you're looking for doesn't exist or has been removed.</p>
                <button
                    onClick={handleBack}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    Back to workouts
                </button>
            </div>
        );
    }

    // Calculate duration from startTime and endTime
    let duration = undefined;
    if (workout.startTime && workout.endTime) {
        const startDate = new Date(workout.startTime);
        const endDate = new Date(workout.endTime);
        duration = Math.round((endDate.getTime() - startDate.getTime()) / 60000); // duration in minutes
    }

    return (
        <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex justify-between items-center">
                <BackButton onBack={handleBack} />
                <EditButton workout={workout} onEdit={handleEdit} />
            </div>

            <WorkoutHeader
                workout={{
                    name: workout.name,
                    date: workout.startTime || undefined,
                    duration: duration,
                    completed: workout.completed
                }}
            />

            {workout.notes && <WorkoutNotes notes={workout.notes} />}

            <div className="space-y-4">
                <h2 className="text-lg font-semibold">Exercises</h2>
                {workout.items.map((item) =>
                    item.type === 'superset' ? (
                        <SupersetItem key={item.id} superset={item} />
                    ) : (
                        <ExerciseItem key={item.id} exercise={item} />
                    )
                )}
            </div>
        </div>
    );
}