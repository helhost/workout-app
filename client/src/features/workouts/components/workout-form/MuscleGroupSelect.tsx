import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { MuscleGroup } from "../../types";
import { muscleGroupOptions } from "./form-utils";

interface MuscleGroupSelectProps {
    value: MuscleGroup;
    onChange: (value: MuscleGroup) => void;
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
            onValueChange={(value) => onChange(value as MuscleGroup)}
        >
            <SelectTrigger className={`w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 ${className}`}>
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