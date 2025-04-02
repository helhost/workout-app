import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { MuscleGroup } from "../../types";

interface MuscleGroupSelectProps {
    value: MuscleGroup;
    onChange: (value: string) => void;
}

export function MuscleGroupSelect({
    value,
    onChange
}: MuscleGroupSelectProps) {
    // Available muscle groups
    const muscleGroups: { label: string; value: MuscleGroup }[] = [
        { label: "Chest", value: "chest" },
        { label: "Back", value: "back" },
        { label: "Shoulders", value: "shoulders" },
        { label: "Biceps", value: "biceps" },
        { label: "Triceps", value: "triceps" },
        { label: "Legs", value: "legs" },
        { label: "Core", value: "core" },
        { label: "Cardio", value: "cardio" },
        { label: "Full Body", value: "fullBody" }
    ];

    return (
        <Select
            value={value}
            onValueChange={onChange}
        >
            <SelectTrigger className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {muscleGroups.map((group) => (
                    <SelectItem key={group.value} value={group.value}>
                        {group.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}