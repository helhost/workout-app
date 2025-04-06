import { cn } from "@/lib/utils";
import { ProfileLayoutProps } from "../types";

export default function ProfileLayout({
    children,
    className
}: ProfileLayoutProps) {
    return (
        <div className={cn("max-w-2xl mx-auto", className)}>
            {children}
        </div>
    );
}