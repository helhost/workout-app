import { cn } from "@/lib/utils";
import { SettingsLayoutProps } from "../types";

export default function SettingsLayout({
    children,
    className
}: SettingsLayoutProps) {
    return (
        <div className={cn("max-w-2xl mx-auto", className)}>
            <h1 className="text-2xl font-bold mb-6">Settings</h1>
            {children}
        </div>
    );
}