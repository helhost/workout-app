import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getProfileImageUrl } from '../api';

interface ProfileImageProps {
    hasProfileImage: boolean;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    onLoadError?: () => void;
}

export default function ProfileImage({
    hasProfileImage,
    className,
    size = 'md',
    onLoadError
}: ProfileImageProps) {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    // Load the image when hasProfileImage changes
    useEffect(() => {
        let isMounted = true;

        if (!hasProfileImage) {
            setImageSrc(null);
            setError(false);
            return;
        }

        const loadImage = async () => {
            try {
                setIsLoading(true);
                setError(false);

                const imageUrl = await getProfileImageUrl(true); // Force refresh

                if (isMounted) {
                    setImageSrc(imageUrl);
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

        loadImage();

        // Clean up function to handle component unmounting
        return () => {
            isMounted = false;
            // Revoke any object URLs to prevent memory leaks
            if (imageSrc && imageSrc.startsWith('blob:')) {
                URL.revokeObjectURL(imageSrc);
            }
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
                <User className={cn("text-gray-500 dark:text-gray-400", getIconSize())} />
            </div>
        );
    }

    return (
        <div className={cn("overflow-hidden", className)}>
            <img
                src={imageSrc}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={() => {
                    setError(true);
                    if (onLoadError) onLoadError();
                }}
            />
        </div>
    );
}