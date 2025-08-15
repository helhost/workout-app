import { useEffect, useState } from "react";
import workoutsAPI from "./api/workouts";
import usersAPI from "./api/users";
import type { Workout } from "./types/api/workouts";

export default function App() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    workoutsAPI.getWorkouts().then(data => {
      setWorkouts(data.filter(w => w.user_id === 1));
    });

    const unsubscribe = usersAPI.subscribeToUser(1, (data) => {
      console.log("Recived data from ws:", data);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", padding: "1rem" }}>
      <h1>All Workouts (User 1)</h1>
      {workouts.map(w => (
        <div
          key={w.id}
          style={{
            border: "1px solid #ccc",
            padding: "0.5rem",
            margin: "0.5rem 0"
          }}
        >
          <h2>Workout #{w.id} — User {w.user_id}</h2>
          {w.exercises.map(ex => (
            <div key={ex.id} style={{ marginLeft: "1rem" }}>
              <strong>Exercise {ex.exercise_number}:</strong> {ex.sets.length} sets
              {ex.sets.map(s => (
                <div key={s.id} style={{ marginLeft: "1rem" }}>
                  <em>Set {s.set_number} — {s.exercise_name}</em>
                  {s.subsets.map(sub => (
                    <div key={sub.id} style={{ marginLeft: "1rem" }}>
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


