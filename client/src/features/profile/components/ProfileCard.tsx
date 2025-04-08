// This file should replace the content in client/src/features/profile/components/ProfileCard.tsx

import { Pencil } from "lucide-react";
import { ProfileImageUploader } from "@/features/profile";
import { cn } from "@/lib/utils";
import { ProfileCardProps } from "../types";

export default function ProfileCard({
    name,
    email,
    bio,
    hasProfileImage,
    onImageUpdated,
    onEditName,
    onEditBio,
    className
}: ProfileCardProps) {
    return (
        <div className={cn("", className)}>
            {/* Profile Image with Uploader */}
            <div className="flex flex-col items-center mb-6">
                <ProfileImageUploader
                    hasProfileImage={hasProfileImage}
                    onImageUpdated={onImageUpdated}
                />

                {/* Name with inline edit button */}
                <div className="flex items-center gap-2 mt-2">
                    <h2 className="text-xl font-semibold">{name}</h2>
                    {onEditName && (
                        <button
                            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                            onClick={onEditName}
                            aria-label="Edit name"
                        >
                            <Pencil className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <p className="text-gray-500 dark:text-gray-400">{email}</p>
            </div>

            {/* Bio Section */}
            <div className="py-4">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">About Me</h3>
                    {onEditBio && (
                        <button
                            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                            onClick={onEditBio}
                            aria-label="Edit bio"
                        >
                            <Pencil className="h-4 w-4" />
                        </button>
                    )}
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                    {bio || "No bio added yet."}
                </p>
            </div>
        </div>
    );
}