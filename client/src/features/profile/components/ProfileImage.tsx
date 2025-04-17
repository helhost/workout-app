import { useState, useEffect } from 'react';
import { User } from '@shared';
import { User as LucideUser } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getProfileImageMetadata } from '../api';

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
    const [imageMetadata, setImageMetadata] = useState<Omit<User.ProfileImage, 'data'> | null>(null);

    // Load the image metadata when hasProfileImage changes
    useEffect(() => {
        let isMounted = true;

        if (!hasProfileImage) {
            setImageSrc(null);
            setError(false);
            return;
        }

        // If we already have the image URL and it hasn't changed, don't refetch
        if (imageSrc && propImageUrl === null) {
            return;
        }

        const loadImageMetadata = async () => {
            try {
                setIsLoading(true);
                setError(false);

                // Fetch image metadata
                const { profileImage } = await getProfileImageMetadata();

                if (isMounted) {
                    setImageMetadata(profileImage);
                    setIsLoading(false);
                }
            } catch (err) {
                console.error('Failed to load profile image metadata:', err);
                if (isMounted) {
                    setError(true);
                    setIsLoading(false);
                    if (onLoadError) onLoadError();
                }
            }
        };

        loadImageMetadata();

        // Clean up function to handle component unmounting
        return () => {
            isMounted = false;
        };
    }, [hasProfileImage, propImageUrl, onLoadError]);

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

    if (!hasProfileImage || error || !imageMetadata) {
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
                src={`/api/user/image?t=${imageMetadata.id}`} // Use ID as cache-busting param
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