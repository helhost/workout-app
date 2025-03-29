// Import Select components from Shadcn UI
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SettingSelectProps } from "../types";
import SettingOption from "./SettingOption";

export default function SettingSelect<T extends string | number>({
    label,
    description,
    value,
    onChange,
    options,
    disabled = false,
    className
}: SettingSelectProps<T>) {
    return (
        <SettingOption
            label={label}
            description={description}
            className={className}
        >
            <Select
                value={String(value)}
                onValueChange={(newValue) => {
                    // Convert back to original type
                    const typedValue = typeof value === 'number'
                        ? Number(newValue) as T
                        : newValue as T;
                    onChange(typedValue);
                }}
                disabled={disabled}
            >
                <SelectTrigger className="w-40">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem
                            key={String(option.value)}
                            value={String(option.value)}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </SettingOption>
    );
}