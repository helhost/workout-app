import { cn } from "@/lib/utils";
import { ProfileLayoutProps } from "../types";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/features/auth/authContext";
import { useNavigate } from "react-router-dom";

export default function ProfileLayout({
    children,
    className
}: ProfileLayoutProps) {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className={cn("max-w-2xl mx-auto", className)}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Profile</h1>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-950"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>
            {children}
        </div>
    );
}