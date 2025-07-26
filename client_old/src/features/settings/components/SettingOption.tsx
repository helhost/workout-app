import { cn } from "@/lib/utils";
import { SettingOptionProps } from "@/types";

export default function SettingOption({
    label,
    description,
    children,
    className
}: SettingOptionProps) {
    return (
        <div className={cn(
            "flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0",
            className
        )}>
            <div className="space-y-1">
                <div className="font-medium text-gray-700 dark:text-gray-300">{label}</div>
                {description && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">{description}</div>
                )}
            </div>
            <div className="ml-4 flex-shrink-0">
                {children}
            </div>
        </div>
    );
}