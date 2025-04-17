import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

import WorkoutsList from "@/features/workouts/components/workout-list/WorkoutsList";
import { getWorkouts } from "@/features/workouts/api";
import { WorkoutSummary, PaginationResult } from "@/types/workout";

export default function WorkoutsPage() {
    const [workouts, setWorkouts] = useState<WorkoutSummary[]>([]);
    const [pagination, setPagination] = useState<PaginationResult>({
        total: 0,
        offset: 0,
        limit: 10
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Fetch workouts when the component mounts
    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch workouts from API
                const response = await getWorkouts();

                setWorkouts(response.workouts);
                setPagination(response.pagination);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch workouts:", err);
                setError("Failed to load workouts. Please try again.");
                toast.error("Failed to load workouts");
                setLoading(false);
            }
        };

        fetchWorkouts();
    }, []);

    // Handler for when a workout is clicked in the list
    const handleWorkoutClick = (workout: WorkoutSummary) => {
        navigate(`/workouts/${workout.id}`);
    };

    // Handler for adding a new workout
    const handleAddWorkout = () => {
        navigate('/workouts/new');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <p className="text-gray-500 dark:text-gray-400">Loading workouts...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto p-6 text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Workouts</h1>
                <Button onClick={handleAddWorkout} className="flex items-center gap-1">
                    <PlusCircle className="h-4 w-4" />
                    New Workout
                </Button>
            </div>

            <WorkoutsList
                workouts={workouts}
                onWorkoutClick={handleWorkoutClick}
            />

            {pagination.total > 0 && pagination.total > pagination.limit && (
                <div className="mt-6 flex justify-center">
                    {/* Simple pagination could be added here */}
                    <p className="text-sm text-gray-500">
                        Showing {pagination.offset + 1} to {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total} workouts
                    </p>
                </div>
            )}
        </div>
    );
}