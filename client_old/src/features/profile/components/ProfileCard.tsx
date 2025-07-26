import { Pencil } from "lucide-react";
import { ProfileImageUploader } from "@/features/profile";
import { cn } from "@/lib/utils";
import { ProfileCardProps } from "@/types/profile";

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

                {/* Name section with improved centering */}
                <div className="relative mt-2 flex justify-center w-full">
                    <h2 className="text-xl font-semibold">{name}</h2>
                    {onEditName && (
                        <button
                            className="absolute right-0 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                            onClick={onEditName}
                            aria-label="Edit name"
                        >
                            <Pencil className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <p className="text-gray-500 dark:text-gray-400">{email}</p>
            </div>

            {/* Horizontal rule for separation */}
            <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

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