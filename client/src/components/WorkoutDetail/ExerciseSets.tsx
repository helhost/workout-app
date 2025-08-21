import type { Set } from "@/types";
import React from "react";

type ExerciseSetsProps = {
  sets: Set[];
};

export default function ExerciseSets({ sets }: ExerciseSetsProps) {
  return (
    <div className="mt-4">
      <table className="w-full border-collapse border-border text-sm sm:text-base">
        <thead>
          <tr className="border-b border-border/80 text-left">
            <th className="pb-2">Set #</th>
            <th className="pb-2">Exercise</th>
            <th className="pb-2">Reps</th>
            <th className="pb-2">Weight</th>
          </tr>
        </thead>

        <tbody>
          {sets.map((set) => {
            const subsets = set.subsets ?? [];
            const rows = subsets.length > 0 ? subsets : [{ reps: "-", weight: "-" }];

            return (
              <React.Fragment key={set.id}>
                {/* first row: include Set # and Exercise with rowSpan */}
                <tr className="border-b border-border/50">
                  <td rowSpan={rows.length} className="py-2 align-top">
                    {set.set_number}
                  </td>
                  <td rowSpan={rows.length} className="py-2 align-top">
                    {set.exercise_name}
                  </td>
                  <td className="py-2">{rows[0].reps}</td>
                  <td className="py-2">{rows[0].weight}</td>
                </tr>

                {/* additional rows for dropset subsets */}
                {rows.slice(1).map((ss, idx) => (
                  <tr
                    key={`${set.id}-ss-${idx}`}
                    className="border-b border-border/50"
                  >
                    <td className="py-2">{ss.reps}</td>
                    <td className="py-2">{ss.weight}</td>
                  </tr>
                ))}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
