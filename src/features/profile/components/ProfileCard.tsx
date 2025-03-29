import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileCardProps } from "../types";

export default function ProfileCard({
    name,
    email,
    avatar,
    className
}: ProfileCardProps) {
    return (
        <div className={cn("flex flex-col items-center mb-6", className)}>
            <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-3">
                {avatar || <User className="h-12 w-12 text-gray-500 dark:text-gray-400" />}
            </div>
            <h2 className="text-xl font-semibold">{name}</h2>
            <p className="text-gray-500 dark:text-gray-400">{email}</p>
        </div>
    );
}