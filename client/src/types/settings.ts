import { ReactNode } from 'react';

/**
 * Props for the SettingOption component
 */
export interface SettingOptionProps {
    /** Label for the setting */
    label: string;
    /** Optional description text for the setting */
    description?: string;
    /** Content to render in the setting's control area */
    children?: ReactNode;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Props for the SettingToggle component
 */
export interface SettingToggleProps extends Omit<SettingOptionProps, 'children'> {
    /** Current toggle state */
    checked: boolean;
    /** Handler for toggle state changes */
    onChange: (checked: boolean) => void;
    /** Whether the toggle is interactive */
    disabled?: boolean;
}

/**
 * Props for the SettingSlider component
 */
export interface SettingSliderProps extends Omit<SettingOptionProps, 'children'> {
    /** Current slider value */
    value: number;
    /** Handler for slider value changes */
    onChange: (value: number) => void;
    /** Minimum slider value */
    min?: number;
    /** Maximum slider value */
    max?: number;
    /** Slider step size */
    step?: number;
    /** Whether the slider is interactive */
    disabled?: boolean;
    /** Whether to display the current value */
    showValue?: boolean;
    /** Format the displayed value */
    valueFormatter?: (value: number) => string;
}

/**
 * Props for the SettingSelect component
 */
export interface SettingSelectProps<T extends string | number> extends Omit<SettingOptionProps, 'children'> {
    /** Current selected value */
    value: T;
    /** Handler for selection changes */
    onChange: (value: T) => void;
    /** Available options for selection */
    options: Array<{
        label: string;
        value: T;
        disabled?: boolean;
    }>;
    /** Whether the select is interactive */
    disabled?: boolean;
}

/**
 * Props for the SettingSubmenu component
 */
export interface SettingSubmenuProps extends Omit<SettingOptionProps, 'children'> {
    /** Submenu content */
    children: ReactNode;
    /** Whether the submenu starts expanded */
    defaultOpen?: boolean;
}

/**
 * Props for the SettingsSection component
 */
export interface SettingsSectionProps {
    /** Section title */
    title: string;
    /** Optional section description */
    description?: string;
    /** Section content */
    children: ReactNode;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Props for the SettingsLayout component
 */
export interface SettingsLayoutProps {
    /** Layout content */
    children: ReactNode;
    /** Additional CSS classes */
    className?: string;
}