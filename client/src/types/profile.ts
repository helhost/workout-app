import { User } from '@shared';
import { ReactNode } from 'react';

// Profile-specific types
export interface ProfileLayoutProps {
    children: ReactNode;
    className?: string;
}

export interface ProfileSectionProps {
    title: string;
    description?: string;
    children: ReactNode;
    className?: string;
}

export interface ProfileCardProps {
    name: string;
    email: string;
    bio?: string;
    hasProfileImage: boolean;
    onImageUpdated: () => void;
    onEditName?: () => void;
    onEditBio?: () => void;
    className?: string;
}

export interface ProfileInfoItemProps {
    label: string;
    value: string;
    icon?: ReactNode;
    editable?: boolean;
    onEdit?: () => void;
    className?: string;
}

// Detailed Profile Types
export interface ProfileMeasurements extends User.SimpleMeasurements { }

export interface ProfileUserFull extends Omit<User.UserFull, 'measurements'> {
    measurements: ProfileMeasurements;
}