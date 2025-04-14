import { CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SetCompleteProps {
    completed: boolean;
    onChange: (completed: boolean) => void;
    className?: string;
    disabled?: boolean;
}

const SetComplete = ({
    completed,
    onChange,
    className,
    disabled = false
}: SetCompleteProps) => {
    return (
        <div className={cn("flex justify-center", className)}>
            <button
                type="button"
                className={cn(
                    "focus:outline-none transition-colors",
                    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-80"
                )}
                onClick={() => !disabled && onChange(!completed)}
                disabled={disabled}
                aria-checked={completed}
                role="checkbox"
            >
                {completed ? (
                    <CheckCircle className="h-6 w-6 text-green-500 dark:text-green-400" />
                ) : (
                    <Circle className="h-6 w-6 text-gray-300 dark:text-gray-600" />
                )}
            </button>
        </div>
    );
};

export default SetComplete;