import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileInfoItemProps } from "@/types/profile";

export default function ProfileInfoItem({
    label,
    value,
    icon,
    editable = false,
    onEdit,
    className
}: ProfileInfoItemProps) {
    return (
        <div className={cn("flex items-center justify-between py-3", className)}>
            <div className="flex items-center space-x-2">
                {icon && <span className="text-gray-400">{icon}</span>}
                <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</div>
                    <div className="text-gray-800 dark:text-gray-200">{value}</div>
                </div>
            </div>
            {editable && (
                <button
                    onClick={onEdit}
                    className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit {label}</span>
                </button>
            )}
        </div>
    );
}