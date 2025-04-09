import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { WorkoutForm, sampleWorkouts, Workout } from "@/features/workouts";

export default function WorkoutFormPage() {
    const { workoutId } = useParams<{ workoutId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [workout, setWorkout] = useState<Workout | null>(null);
    const [loading, setLoading] = useState(true);

    // Check if we're in edit mode or create mode
    const isEditMode = location.pathname.includes("/edit");

    useEffect(() => {
        // Only fetch workout if we're in edit mode
        if (isEditMode && workoutId) {
            // In production, you would fetch the workout data from an API
            // For now, we'll use the sample data
            const foundWorkout = sampleWorkouts.find(w => w.id === workoutId);
            setWorkout(foundWorkout || null);
        }
        setLoading(false);
    }, [workoutId, isEditMode]);

    const handleSave = (updatedWorkout: Workout) => {
        // Navigate back to the detail page if editing, or to the list if creating
        if (isEditMode) {
            navigate(`/workouts/${updatedWorkout.id}`);
        } else {
            navigate("/workouts");
        }
    };

    const handleCancel = () => {
        // Navigate back to the detail page if editing, or to the list if creating
        if (isEditMode && workoutId) {
            navigate(`/workouts/${workoutId}`);
        } else {
            navigate("/workouts");
        }
    };

    if (loading) {
        return <div className="flex justify-center p-8">Loading...</div>;
    }

    // If we're in edit mode and the workout doesn't exist, show not found message
    if (isEditMode && !workout) {
        return (
            <div className="max-w-2xl mx-auto p-6 text-center">
                <h2 className="text-xl font-semibold mb-4">Workout not found</h2>
                <p className="mb-4">The workout you're trying to edit doesn't exist or has been removed.</p>
                <button
                    onClick={() => navigate("/workouts")}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    Back to workouts
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <WorkoutForm
                workout={workout || undefined}
                onSave={handleSave}
                onCancel={handleCancel}
            />
        </div>
    );
}