// Import Slider from Shadcn UI
import { Slider } from "@/components/ui/slider";
import { SettingSliderProps } from "@/types";
import SettingOption from "./SettingOption";

export default function SettingSlider({
    label,
    description,
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    showValue = true,
    valueFormatter = (value) => `${value}`,
    className
}: SettingSliderProps) {
    return (
        <SettingOption
            label={label}
            description={description}
            className={className}
        >
            <div className="flex items-center gap-4 w-48">
                <Slider
                    value={[value]}
                    min={min}
                    max={max}
                    step={step}
                    onValueChange={([newValue]) => onChange(newValue)}
                    disabled={disabled}
                    className="flex-1"
                />
                {showValue && (
                    <span className="text-sm font-medium min-w-12 text-right text-gray-700 dark:text-gray-300">
                        {valueFormatter(value)}
                    </span>
                )}
            </div>
        </SettingOption>
    );
}