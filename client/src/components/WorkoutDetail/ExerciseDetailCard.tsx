import type { Exercise } from "@/types";
import { ExerciseSets } from "@/components";

type ExerciseDetailCardProps = {
  exercise: Exercise;
};

export default function ExerciseDetailCard({ exercise }: ExerciseDetailCardProps) {
  return (
    <div className="w-full flex justify-center">
      <div className="rounded-2xl shadow bg-secondary text-text px-4 py-4 sm:px-6 sm:py-5 mx-1 my-4 sm:mx-2 sm:my-5 min-w-[75vw] sm:min-w-[60vw]">
        <h3 className="text-lg sm:text-xl font-bold">{exercise.name}</h3>

        <ExerciseSets sets={exercise.sets} />
      </div>
    </div>
  );
}
