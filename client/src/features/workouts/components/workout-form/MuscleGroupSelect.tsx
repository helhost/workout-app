import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Workout } from "@shared";
import { muscleGroupOptions } from "./form-utils";
import { cn } from "@/lib/utils";

interface MuscleGroupSelectProps {
    value: Workout.MuscleGroup;
    onChange: (value: Workout.MuscleGroup) => void;
    className?: string;
}

const MuscleGroupSelect = ({
    value,
    onChange,
    className
}: MuscleGroupSelectProps) => {
    return (
        <Select
            value={value}
            onValueChange={(value) => onChange(value as Workout.MuscleGroup)}
        >
            <SelectTrigger className={cn(
                "text-xs text-gray-500 dark:text-gray-400 capitalize bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded h-auto min-h-0 w-auto border-none",
                className
            )}>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {muscleGroupOptions.map((group) => (
                    <SelectItem key={group.value} value={group.value}>
                        {group.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default MuscleGroupSelect;