import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { WorkoutsList, sampleWorkouts, Workout } from "@/features/workouts";

export default function WorkoutsPage() {
    // Use sample data for now - in a real app, you'd fetch this from an API
    const [workouts] = useState(sampleWorkouts);

    // Handler for when a workout is clicked
    const handleWorkoutClick = (workout: Workout) => {
        console.log("Workout clicked:", workout);
        // Would navigate to workout details or open a modal
    };

    // Handler for adding a new workout - placeholder for now
    const handleAddWorkout = () => {
        console.log("Add workout clicked");
        // Would open a form or navigate to create workout page
    };

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
        </div>
    );
}