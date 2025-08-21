import { useEffect, useState } from "react";
import { workoutsAPI } from "@/api";
import type { Workout } from "@/types";
import { WorkoutDetailCard, ExerciseDetailCard } from "@/components";

export default function WokoutDetailPage() {
  const [workout, setWorkout] = useState<Workout>();

  useEffect(() => {

    const workout_id_str = window.location.pathname.split('/').at(-1);

    if (workout_id_str) {
      const workout_id = parseInt(workout_id_str);

      workoutsAPI.getWorkout(workout_id).then((data) => {
        setWorkout(data);
      });
    }

  }, []);

  return (
    <div className="font-sans p-4 text-text">
      {workout && (
        <>
          {/* General workout info */}
          <WorkoutDetailCard workout={workout} />

          {/* Exercises */}
          {workout.exercises.map((ex) => (
            <ExerciseDetailCard exercise={ex} key={ex.id} />
          ))}
        </>
      )}
    </div>
  );
}
