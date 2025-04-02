import { useState } from "react";
import { setDarkMode, isDarkModeEnabled } from "@/features/theme/themeUtils";
import {
    SettingsLayout,
    SettingsSection,
    SettingToggle,
    SettingSlider,
    SettingSelect,
    SettingSubmenu
} from "@/features/settings";

export default function SettingsPage() {
    // Theme settings
    const [darkMode, setDarkModeState] = useState(isDarkModeEnabled());
    const [highContrast, setHighContrast] = useState(false);

    // Notification settings
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [notificationSound, setNotificationSound] = useState(true);

    // Volume settings
    const [volume, setVolume] = useState(75);
    const [microphoneVolume, setMicrophoneVolume] = useState(50);

    // Language setting
    const [language, setLanguage] = useState<string>("en");

    // Theme toggle handler
    const toggleDarkMode = (checked: boolean) => {
        setDarkModeState(checked);
        setDarkMode(checked);
    };

    return (
        <SettingsLayout>
            <SettingsSection title="Appearance" description="Customize how the app looks and feels">
                <SettingToggle
                    label="Dark Mode"
                    description="Enable dark mode for the application"
                    checked={darkMode}
                    onChange={toggleDarkMode}
                />

                <SettingToggle
                    label="High Contrast"
                    description="Increase contrast for better visibility"
                    checked={highContrast}
                    onChange={setHighContrast}
                />
            </SettingsSection>

            <SettingsSection title="Notifications" description="Manage your notification preferences">
                <SettingToggle
                    label="Email Notifications"
                    description="Receive notifications via email"
                    checked={emailNotifications}
                    onChange={setEmailNotifications}
                />

                <SettingToggle
                    label="Push Notifications"
                    description="Receive notifications on your device"
                    checked={pushNotifications}
                    onChange={setPushNotifications}
                />

                <SettingToggle
                    label="Notification Sounds"
                    description="Play a sound when notifications arrive"
                    checked={notificationSound}
                    onChange={setNotificationSound}
                />
            </SettingsSection>

            <SettingsSection title="Audio" description="Configure audio settings">
                <SettingSlider
                    label="Main Volume"
                    description="Set the overall volume level"
                    value={volume}
                    onChange={setVolume}
                    valueFormatter={(value) => `${value}%`}
                />

                <SettingSlider
                    label="Microphone Volume"
                    description="Set the microphone input level"
                    value={microphoneVolume}
                    onChange={setMicrophoneVolume}
                    valueFormatter={(value) => `${value}%`}
                />
            </SettingsSection>

            <SettingsSection title="Advanced Settings" description="Configure advanced application settings">
                <SettingSubmenu
                    label="Language"
                    description="Select your preferred language"
                >
                    <SettingSelect
                        label="Display Language"
                        value={language}
                        onChange={setLanguage}
                        options={[
                            { label: "English", value: "en" },
                            { label: "Spanish", value: "es" },
                            { label: "French", value: "fr" },
                            { label: "German", value: "de" },
                            { label: "Chinese", value: "zh" }
                        ]}
                    />
                </SettingSubmenu>

                <SettingSubmenu
                    label="Storage"
                    description="Manage your data and storage preferences"
                >
                    <SettingToggle
                        label="Auto-save"
                        description="Automatically save your progress"
                        checked={true}
                        onChange={() => { }}
                    />

                    <SettingToggle
                        label="Cloud Sync"
                        description="Sync your data across devices"
                        checked={true}
                        onChange={() => { }}
                    />
                </SettingSubmenu>
            </SettingsSection>
        </SettingsLayout>
    );
}