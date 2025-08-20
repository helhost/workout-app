import { useEffect, useState } from "react";
import { workoutsAPI } from "@/api";
import type { WorkoutSummary } from "@/types";
import { WorkoutSummaryCard } from "@/components";

export default function WokoutsPage() {
  const [workout_summaries, setWorkoutSummaries] = useState<WorkoutSummary[]>([]);

  useEffect(() => {
    workoutsAPI.getWorkoutSummaries(1).then((data) => {
      setWorkoutSummaries(data);
    });
  }, []);

  return (
    <div className="font-sans p-4">
      {workout_summaries.map((w) => (
        <WorkoutSummaryCard key={w.workout_id} summary={w} />
      ))}
    </div>
  );
}
