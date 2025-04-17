import { cn } from "@/lib/utils";
import { ProfileSectionProps } from "@/types/profile";

export default function ProfileSection({
    title,
    description,
    children,
    className
}: ProfileSectionProps) {
    return (
        <div className={cn(
            "bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm mb-6",
            className
        )}>
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
                {description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {description}
                    </p>
                )}
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {children}
            </div>
        </div>
    );
}