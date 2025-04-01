import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface BackButtonProps {
    onBack?: () => void;
}

export function BackButton({ onBack }: BackButtonProps) {
    return (
        <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-1 text-gray-600 dark:text-gray-300"
        >
            <ChevronLeft className="h-4 w-4" />
            Back to workouts
        </Button>
    );
}