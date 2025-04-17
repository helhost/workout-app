import { Switch } from "@/components/ui/switch";
import { SettingToggleProps } from "@/types";
import SettingOption from "./SettingOption";

/**
 * A toggle switch setting component
 * @param props Component properties
 * @returns A rendered setting option with a toggle switch
 */
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