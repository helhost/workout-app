import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FormActionsProps {
    onCancel: () => void;
    isEdit: boolean;
    isSubmitting?: boolean;
    className?: string;
}

const FormActions = ({
    onCancel,
    isEdit,
    isSubmitting = false,
    className
}: FormActionsProps) => {
    return (
        <div className={cn("flex justify-end gap-4", className)}>
            <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
            >
                Cancel
            </Button>
            <Button
                type="submit"
                className="flex items-center gap-2"
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>{isEdit ? "Updating..." : "Creating..."}</span>
                    </>
                ) : (
                    <>
                        <Save className="h-4 w-4" />
                        <span>{isEdit ? "Update Workout" : "Create Workout"}</span>
                    </>
                )}
            </Button>
        </div>
    );
};

export default FormActions;