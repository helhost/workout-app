import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import api from '@/lib/api/axios';
import { cn } from '@/lib/utils';

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
    const [fetchKey, setFetchKey] = useState(0); // Used to force re-fetch

    // Reset image state when hasProfileImage changes
    useEffect(() => {
        console.log('ProfileImage hasProfileImage changed:', hasProfileImage);
        if (!hasProfileImage) {
            setImageSrc(null);
            setError(false);
        } else {
            // Force a re-fetch when hasProfileImage becomes true
            setFetchKey(prev => prev + 1);
        }
    }, [hasProfileImage]);

    useEffect(() => {
        if (hasProfileImage && !imageSrc && !error) {
            setIsLoading(true);
            console.log('Fetching profile image...');

            // Use axios to fetch the image as a blob with timestamp for cache busting
            const timestamp = new Date().getTime();
            api.get(`/profile/image?t=${timestamp}`, {
                responseType: 'blob',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                }
            })
                .then(response => {
                    console.log('Image response received, status:', response.status);
                    console.log('Image blob size:', response.data.size, 'bytes');
                    console.log('Content type:', response.headers['content-type']);

                    // Only proceed if we got actual data
                    if (response.data.size > 0) {
                        // Convert blob to a data URL
                        const reader = new FileReader();
                        reader.onload = () => {
                            console.log('Image converted to data URL');
                            setImageSrc(reader.result as string);
                            setIsLoading(false);
                        };
                        reader.onerror = () => {
                            console.error('FileReader error:', reader.error);
                            setError(true);
                            setIsLoading(false);
                            if (onLoadError) onLoadError();
                        };
                        reader.readAsDataURL(response.data);
                    } else {
                        console.warn('Image response was empty');
                        setError(true);
                        setIsLoading(false);
                        if (onLoadError) onLoadError();
                    }
                })
                .catch(err => {
                    console.error('Failed to load profile image:', err);
                    setError(true);
                    setIsLoading(false);
                    if (onLoadError) {
                        onLoadError();
                    }
                });
        }
    }, [hasProfileImage, imageSrc, error, onLoadError, fetchKey]);

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
        console.log('Showing default icon. hasProfileImage:', hasProfileImage, 'error:', error, 'imageSrc exists:', !!imageSrc);
        return (
            <div className={cn(
                "bg-gray-200 dark:bg-gray-700 flex items-center justify-center",
                className
            )}>
                <User className={cn("text-gray-500 dark:text-gray-400", getIconSize())} />
            </div>
        );
    }

    console.log('Showing actual image');
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