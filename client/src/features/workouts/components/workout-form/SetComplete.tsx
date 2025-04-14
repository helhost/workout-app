import { Switch } from "@/components/ui/switch";
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
            <Switch
                checked={completed}
                onCheckedChange={onChange}
                disabled={disabled}
                className={cn(
                    completed ? "bg-green-500" : "",
                    "data-[state=checked]:bg-green-500"
                )}
            />
        </div>
    );
};

export default SetComplete;