import { ReactNode } from 'react';

export interface SettingOptionProps {
    label: string;
    description?: string;
    children?: ReactNode;
    className?: string;
}

export interface SettingToggleProps extends Omit<SettingOptionProps, 'children'> {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}

export interface SettingSliderProps extends Omit<SettingOptionProps, 'children'> {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    showValue?: boolean;
    valueFormatter?: (value: number) => string;
}

export interface SettingSelectProps<T extends string | number> extends Omit<SettingOptionProps, 'children'> {
    value: T;
    onChange: (value: T) => void;
    options: Array<{
        label: string;
        value: T;
        disabled?: boolean;
    }>;
    disabled?: boolean;
}

export interface SettingSubmenuProps extends Omit<SettingOptionProps, 'children'> {
    children: ReactNode;
    defaultOpen?: boolean;
}

export interface SettingsSectionProps {
    title: string;
    description?: string;
    children: ReactNode;
    className?: string;
}

export interface SettingsLayoutProps {
    children: ReactNode;
    className?: string;
}