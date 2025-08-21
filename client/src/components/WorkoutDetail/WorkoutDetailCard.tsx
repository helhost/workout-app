import type { Workout } from '@/types';
import { formatYYMMDD } from "@/util";

type WorkoutDetailCardProps = {
  workout: Workout;
}

export default function WorkoutDetailCard({ workout }: WorkoutDetailCardProps) {

  const onEdit = () => {
    window.location.pathname += "/edit";
  };

  return (
    <div className="w-full flex justify-center">
      <div
        className="
          rounded-2xl shadow
          bg-primary text-text
          px-4 py-4 sm:px-6 sm:py-5
          mx-1 my-4 sm:mx-2 sm:my-5
          min-w-[75vw]
          sm:min-w-[60vw]
        "
      >
        {/* Header */}

        <div className="flex items-start justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-bold">
            Workout - {formatYYMMDD(workout.created_at)}
          </h2>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Workout type badge */}
            <span
              className="
              shrink-0 rounded-full
              bg-secondary text-white
              px-3 py-1 text-sm sm:text-base font-semibold
              leading-none
            "
            >
              {workout.type}
            </span>

            {/* Edit button */}
            <button
              type="button"
              onClick={() => onEdit()}
              aria-label="Edit workout"
              className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1 text-text hover:bg-primary-accent transition-colors cursor-pointer"
            >
              <span aria-hidden>✏️</span>
              <span className="hidden sm:inline">Edit</span>
            </button>
          </div>
        </div>
        {/* Extra info - user + id */}
        <div className="mt-4 text-sm sm:text-base text-text-accent">
          Workout ID: {workout.id} <br />
          User ID: {workout.user_id}
        </div>
      </div>
    </div>
  )
};
