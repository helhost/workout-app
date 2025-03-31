import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
    WorkoutsList,
    WorkoutDetail,
    WorkoutForm,
    sampleWorkouts,
    Workout
} from "@/features/workouts";

type ViewMode = "list" | "detail" | "create" | "edit";

export default function WorkoutsPage() {
    // Use sample data for now - in a real app, you'd fetch this from an API
    const [workouts, setWorkouts] = useState(sampleWorkouts);
    const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>("list");

    // Handler for when a workout is clicked in the list
    const handleWorkoutClick = (workout: Workout) => {
        setSelectedWorkout(workout);
        setViewMode("detail");
    };

    // Handler for adding a new workout
    const handleAddWorkout = () => {
        setSelectedWorkout(null);
        setViewMode("create");
    };

    // Handler for editing a workout
    const handleEditWorkout = (workout: Workout) => {
        setSelectedWorkout(workout);
        setViewMode("edit");
    };

    // Handler for saving a workout (create or edit)
    const handleSaveWorkout = (workout: Workout) => {
        if (viewMode === "create") {
            // Add new workout to the list
            setWorkouts([...workouts, workout]);
        } else if (viewMode === "edit" && selectedWorkout) {
            // Update existing workout
            const updatedWorkouts = workouts.map(w =>
                w.id === workout.id ? workout : w
            );
            setWorkouts(updatedWorkouts);
        }

        // Navigate back to list view
        setViewMode("list");
    };

    // Handler for canceling workout create/edit
    const handleCancelForm = () => {
        // If we were editing, go back to detail view, otherwise go back to list
        if (viewMode === "edit" && selectedWorkout) {
            setViewMode("detail");
        } else {
            setViewMode("list");
        }
    };

    // Handler for going back to list view
    const handleBackToList = () => {
        setViewMode("list");
    };

    // Render appropriate view based on viewMode
    const renderContent = (): React.ReactElement => {
        switch (viewMode) {
            case "detail":
                if (selectedWorkout) {
                    return (
                        <WorkoutDetail
                            workout={selectedWorkout}
                            onBack={handleBackToList}
                            onEdit={() => handleEditWorkout(selectedWorkout)}
                        />
                    );
                } else {
                    // If no workout is selected, redirect and render empty fragment
                    handleBackToList();
                    return <></>;
                }

            case "create":
                return (
                    <WorkoutForm
                        onSave={handleSaveWorkout}
                        onCancel={handleCancelForm}
                    />
                );

            case "edit":
                if (selectedWorkout) {
                    return (
                        <WorkoutForm
                            workout={selectedWorkout}
                            onSave={handleSaveWorkout}
                            onCancel={handleCancelForm}
                        />
                    );
                } else {
                    // If no workout is selected, redirect and render empty fragment
                    handleBackToList();
                    return <></>;
                }

            case "list":
            default:
                return (
                    <>
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
                    </>
                );
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Removed the duplicate "Back to workouts" button here */}
            {renderContent()}
        </div>
    );
}