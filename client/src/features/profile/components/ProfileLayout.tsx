import { cn } from "@/lib/utils";
import { ProfileLayoutProps } from "../types";

export default function ProfileLayout({
    children,
    className
}: ProfileLayoutProps) {
    return (
        <div className={cn("max-w-2xl mx-auto", className)}>
            <h1 className="text-2xl font-bold mb-6">User Profile</h1>
            {children}
        </div>
    );
}