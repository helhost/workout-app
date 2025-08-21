import { useEffect, useState } from "react";
import { workoutsAPI } from "@/api";
import type { Workout } from "@/types";

export default function WokoutEditPage() {
  const [workout, setWorkout] = useState<Workout>();

  useEffect(() => {

    const workout_id_str = window.location.pathname.split('/').at(-2);

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
          <div className="text-text">
            {workout.id}
          </div>

          {/* Exercises */}
          {workout.exercises.map((ex) => (
            <div key={ex.id} className="text-text">
              {ex.name}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
