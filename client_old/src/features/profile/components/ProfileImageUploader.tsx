import { useState, useRef, ChangeEvent } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { uploadProfileImage, deleteProfileImage } from '../api';
import ProfileImage from './ProfileImage';
import { toast } from 'sonner';

interface ProfileImageUploaderProps {
    hasProfileImage: boolean;
    onImageUpdated: () => void;
    className?: string;
}

export default function ProfileImageUploader({
    hasProfileImage,
    onImageUpdated,
    className
}: ProfileImageUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle file selection
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file (JPEG, PNG, etc.)');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        // Create preview URL
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        // Start upload
        handleUpload(file);
    };

    // Trigger file input click
    const triggerFileSelection = () => {
        fileInputRef.current?.click();
    };

    // Handle image upload
    const handleUpload = async (file: File) => {
        try {
            setIsUploading(true);

            const { message } = await uploadProfileImage(file);

            // Clear the file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            // Call the parent's callback to refresh profile data
            onImageUpdated();

            // Show success toast
            toast.success(message);
        } catch (err: any) {
            console.error('Upload error:', err);
            toast.error(err.message || 'Failed to upload image');
        } finally {
            setIsUploading(false);
            // Clear preview
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
            }
        }
    };

    // Handle image deletion
    const handleDelete = async () => {
        try {
            setIsUploading(true);

            const { message } = await deleteProfileImage();

            // Call the parent's callback to refresh profile data
            onImageUpdated();

            // Close delete dialog
            setIsDeleteDialogOpen(false);

            // Show success toast
            toast.success(message);
        } catch (err: any) {
            console.error('Delete error:', err);
            toast.error(err.message || 'Failed to delete image');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className={className}>
            {/* Profile Image */}
            <div className="relative">
                <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-3 overflow-hidden">
                    <ProfileImage
                        hasProfileImage={hasProfileImage}
                        className="h-full w-full"
                        size="lg"
                    />
                </div>

                {/* Edit button overlay */}
                <div className="absolute -bottom-1 -right-1 flex space-x-1">
                    <button
                        className="p-1.5 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-500 dark:text-blue-400 border border-gray-200 dark:border-gray-700"
                        onClick={triggerFileSelection}
                        disabled={isUploading}
                        title="Upload new image"
                    >
                        {isUploading ? (
                            <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <Upload className="h-4 w-4" />
                        )}
                    </button>

                    {hasProfileImage && (
                        <button
                            className="p-1.5 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 dark:text-red-400 border border-gray-200 dark:border-gray-700"
                            onClick={() => setIsDeleteDialogOpen(true)}
                            disabled={isUploading}
                            title="Remove image"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Hidden file input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    disabled={isUploading}
                />
            </div>

            {/* Delete confirmation dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Delete Profile Picture</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete your profile picture? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <p>Are you sure you want to delete your profile picture?</p>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            disabled={isUploading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isUploading}
                        >
                            {isUploading ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}