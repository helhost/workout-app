import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { WorkoutDetail, sampleWorkouts, Workout } from "@/features/workouts";

export default function WorkoutDetailPage() {
    const { workoutId } = useParams<{ workoutId: string }>();
    const navigate = useNavigate();
    const [workout, setWorkout] = useState<Workout | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In production, you would fetch the workout data from an API
        // For now, we'll use the sample data
        if (workoutId) {
            const foundWorkout = sampleWorkouts.find(w => w.id === workoutId);
            setWorkout(foundWorkout || null);
        }
        setLoading(false);
    }, [workoutId]);

    const handleBack = () => {
        navigate("/workouts");
    };

    const handleEdit = (workout: Workout) => {
        navigate(`/workouts/${workout.id}/edit`);
    };

    if (loading) {
        return <div className="flex justify-center p-8">Loading...</div>;
    }

    if (!workout) {
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

    return (
        <div className="max-w-2xl mx-auto">
            <WorkoutDetail
                workout={workout}
                onBack={handleBack}
                onEdit={() => handleEdit(workout)}
            />
        </div>
    );
}