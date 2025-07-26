import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { SettingSubmenuProps } from "@/types";
import { cn } from "@/lib/utils";

export default function SettingSubmenu({
    label,
    description,
    children,
    defaultOpen = false,
    className
}: SettingSubmenuProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={cn("border-b border-gray-200 dark:border-gray-700 last:border-b-0", className)}>
            <button
                type="button"
                className="flex items-center justify-between w-full py-3 text-left"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="space-y-1">
                    <div className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
                        {isOpen ? (
                            <ChevronDown className="h-4 w-4 mr-2" />
                        ) : (
                            <ChevronRight className="h-4 w-4 mr-2" />
                        )}
                        {label}
                    </div>
                    {description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 ml-6">{description}</div>
                    )}
                </div>
            </button>
            {isOpen && (
                <div className="pl-6 pb-3 border-l border-gray-200 dark:border-gray-700 ml-2 mt-1 space-y-2">
                    {children}
                </div>
            )}
        </div>
    );
}