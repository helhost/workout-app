import { useEffect, useState } from "react";
import workoutsAPI from "./api/workouts";
import usersAPI from "./api/users";
import type { Workout } from "./types/api/workouts";

export default function App() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    workoutsAPI.getWorkouts().then((data) => {
      setWorkouts(data.filter((w) => w.user_id === 1));
    });

    const unsubscribe = usersAPI.subscribeToUser(1, (data) => {
      console.log("Recived data from ws:", data);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="font-sans p-4">
      <h1 className="text-2xl font-bold mb-2">All Workouts (User 1)</h1>

      {workouts.map((w) => (
        <div
          key={w.id}
          className="border border-neutral-300 p-2 my-2"
        >
          <h2 className="text-lg font-semibold">
            Workout #{w.id} — User {w.user_id}
          </h2>

          {w.exercises.map((ex) => (
            <div key={ex.id} className="ml-4 mt-2">
              <strong>Exercise {ex.exercise_number}:</strong> {ex.sets.length} sets

              {ex.sets.map((s) => (
                <div key={s.id} className="ml-4 mt-1">
                  <em>
                    Set {s.set_number} — {s.exercise_name}
                  </em>

                  {s.subsets.map((sub) => (
                    <div key={sub.id} className="ml-4">
                      Reps: {sub.reps}, Weight: {sub.weight}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
