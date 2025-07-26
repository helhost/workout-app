import { ReactNode } from 'react';

/**
 * Props for the SettingOption component
 */
export interface SettingOptionProps {
    label: string;
    description?: string;
    children?: ReactNode;
    className?: string;
}

/**
 * Props for the SettingToggle component
 */
export interface SettingToggleProps extends Omit<SettingOptionProps, 'children'> {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}

/**
 * Props for the SettingSlider component
 */
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

/**
 * Props for the SettingSelect component
 */
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

/**
 * Props for the SettingSubmenu component
 */
export interface SettingSubmenuProps extends Omit<SettingOptionProps, 'children'> {
    children: ReactNode;
    defaultOpen?: boolean;
}

/**
 * Props for the SettingsSection component
 */
export interface SettingsSectionProps {
    title: string;
    description?: string;
    children: ReactNode;
    className?: string;
}

/**
 * Props for the SettingsLayout component
 */
export interface SettingsLayoutProps {
    children: ReactNode;
    className?: string;
}