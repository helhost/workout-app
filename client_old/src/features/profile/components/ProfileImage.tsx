import { useState, useEffect } from 'react';
import { User as LucideUser } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getProfileImageAsBlob } from '../api';

interface ProfileImageProps {
    hasProfileImage: boolean;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    onLoadError?: () => void;
    imageUrl?: string | null;
}

export default function ProfileImage({
    hasProfileImage,
    className,
    size = 'md',
    onLoadError,
    imageUrl: propImageUrl = null
}: ProfileImageProps) {
    const [imageSrc, setImageSrc] = useState<string | null>(propImageUrl);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        let isMounted = true;
        let objectUrl: string | null = null;

        if (!hasProfileImage) {
            setImageSrc(null);
            setError(false);
            return;
        }

        const loadProfileImage = async () => {
            try {
                setIsLoading(true);
                setError(false);

                // Use the API function to get the image blob URL
                objectUrl = await getProfileImageAsBlob();

                if (isMounted) {
                    setImageSrc(objectUrl);
                    setIsLoading(false);
                }
            } catch (err) {
                console.error('Failed to load profile image:', err);
                if (isMounted) {
                    setError(true);
                    setIsLoading(false);
                    if (onLoadError) onLoadError();
                }
            }
        };

        loadProfileImage();

        // Clean up function to handle component unmounting
        return () => {
            isMounted = false;
            // Revoke the object URL to avoid memory leaks
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [hasProfileImage, onLoadError]);

    // Determine icon size based on the size prop
    const getIconSize = () => {
        switch (size) {
            case 'sm': return 'h-8 w-8';
            case 'lg': return 'h-16 w-16';
            case 'md':
            default: return 'h-12 w-12';
        }
    };

    if (isLoading) {
        return (
            <div className={cn(
                "bg-gray-200 dark:bg-gray-700 flex items-center justify-center",
                className
            )}>
                <div className="animate-pulse h-4 w-4 bg-gray-400 rounded-full"></div>
            </div>
        );
    }

    if (!hasProfileImage || error || !imageSrc) {
        return (
            <div className={cn(
                "bg-gray-200 dark:bg-gray-700 flex items-center justify-center",
                className
            )}>
                <LucideUser className={cn("text-gray-500 dark:text-gray-400", getIconSize())} />
            </div>
        );
    }

    return (
        <div className={cn("overflow-hidden", className)}>
            <img
                src={imageSrc}
                alt="Profile"
                className="w-full h-full object-cover"
            />
        </div>
    );
}