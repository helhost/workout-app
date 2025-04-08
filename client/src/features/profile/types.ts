import { ReactNode } from 'react';

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
    hasProfileImage?: boolean;
    onEditName?: () => void;
    onEditImage?: () => void;
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