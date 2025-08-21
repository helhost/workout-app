import type { WorkoutSummary } from "@/types";
import { formatYYMMDD } from "@/util";

type WorkoutSummaryCardProps = {
  summary: WorkoutSummary;
};


export default function WorkoutSummaryCard({ summary }: WorkoutSummaryCardProps) {

  const navigate = (workout_id: number) => {
    window.location.pathname += `/${workout_id}`;
  };

  return (
    <div className="w-full flex item-center justify-center">
      <button
        onClick={() => navigate(summary.workout_id)}
        className="
          cursor-pointer
          text-left rounded-2xl shadow
          bg-primary text-text
          px-4 py-4 sm:px-6 sm:py-5
          mx-1 my-4 sm:mx-2 sm:my-5
          min-w-[75vw]
          sm:min-w-[60vw]
          transition
          hover:bg-primary-accent
        "
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-bold">
            Workout - {formatYYMMDD(summary.created_at)}
          </h2>

          {/* Workout type badge */}
          <span
            className="
              shrink-0 rounded-full
              bg-secondary text-white
              px-3 py-1 text-sm sm:text-base font-semibold
              leading-none
            "
          >
            {summary.type}
          </span>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 gap-6 sm:gap-8">
          <div>
            <div className="text-text-accent text-sm sm:text-base">Total Exercises</div>
            <div className="text-2xl sm:text-3xl font-extrabold">{summary.total_exercises}</div>
          </div>
          <div>
            <div className="text-text-accent text-sm sm:text-base">Total Sets</div>
            <div className="text-2xl sm:text-3xl font-extrabold">{summary.total_sets}</div>
          </div>
        </div>
      </button>
    </div>
  );
}
