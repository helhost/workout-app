// Import Switch from Shadcn UI
import { Switch } from "@/components/ui/switch";
import { SettingToggleProps } from "../types";
import SettingOption from "./SettingOption";

export default function SettingToggle({
    label,
    description,
    checked,
    onChange,
    disabled = false,
    className
}: SettingToggleProps) {
    return (
        <SettingOption
            label={label}
            description={description}
            className={className}
        >
            <Switch
                checked={checked}
                onCheckedChange={onChange}
                disabled={disabled}
            />
        </SettingOption>
    );
}