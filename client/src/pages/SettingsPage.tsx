import { useState, useEffect } from "react";
import { toast } from "sonner";
import { setDarkMode } from "@/features/theme/themeUtils";
import SettingsLayout from "@/features/settings/components/SettingsLayout";
import SettingsSection from "@/features/settings/components/SettingsSection";
import SettingToggle from "@/features/settings/components/SettingToggle";
import SettingSelect from "@/features/settings/components/SettingSelect";
import { getUser } from "@/features/auth/api"
import { Button } from "@/components/ui/button";
import { UserSettings, updateSettings } from "@/features/settings/api";

export default function SettingsPage() {
    // Settings state
    const [settings, setSettings] = useState<UserSettings>({
        darkMode: false,
        language: "en",
        defaultMeasurementUnit: "metric"
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await getUser();
                if (response && response.profile && response.profile.settings) {
                    // Extract settings from profile
                    const profileSettings = response.profile.settings;

                    const darkModeSetting = !!profileSettings.darkMode;

                    // Apply dark mode immediately when settings are loaded
                    setDarkMode(darkModeSetting);

                    setSettings({
                        darkMode: darkModeSetting,
                        language: profileSettings.language || "en",
                        defaultMeasurementUnit: profileSettings.defaultMeasurementUnit || "metric"
                    });
                }
            } catch (err: any) {
                console.error("Error fetching settings:", err);
                setError(err.message || "Failed to load settings");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    // Update a specific setting directly via API
    const updateSetting = async <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
        try {
            // Create updated settings object
            const updatedSettings = {
                ...settings,
                [key]: value
            };

            // If this is the dark mode setting, apply it immediately to the UI
            if (key === 'darkMode') {
                setDarkMode(value as boolean);
            }

            // Update local state immediately for responsive UI
            setSettings(updatedSettings);

            // Show loading toast
            const toastId = toast.loading("Updating setting...");

            // Send update to server
            await updateSettings(updatedSettings);

            // Show success toast
            toast.success("Setting updated", {
                id: toastId,
                description: `${key.charAt(0).toUpperCase() + key.slice(1)} has been updated`,
            });

        } catch (err: any) {
            console.error(`Error updating ${key} setting:`, err);
            // Show error toast
            toast.error("Failed to update setting", {
                description: err.message || `There was a problem updating ${key}`,
            });
        }
    };

    if (isLoading) {
        return (
            <SettingsLayout>
                <div className="flex justify-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">Loading settings...</p>
                </div>
            </SettingsLayout>
        );
    }

    if (error) {
        return (
            <SettingsLayout>
                <div className="bg-red-100 dark:bg-red-900 p-4 rounded-md text-red-700 dark:text-red-200">
                    <h2 className="font-semibold mb-2">Error Loading Settings</h2>
                    <p>{error}</p>
                    <Button
                        className="mt-4"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </Button>
                </div>
            </SettingsLayout>
        );
    }

    return (
        <SettingsLayout>
            <SettingsSection title="Appearance" description="Customize how the app looks and feels">
                <SettingToggle
                    label="Dark Mode"
                    description="Enable dark mode for the application"
                    checked={settings.darkMode}
                    onChange={(checked) => updateSetting('darkMode', checked)}
                />
            </SettingsSection>

            <SettingsSection title="Preferences" description="Set your application preferences">
                <SettingSelect
                    label="Language"
                    value={settings.language}
                    onChange={(value) => updateSetting('language', value)}
                    options={[
                        { label: "English", value: "en" },
                        { label: "Spanish", value: "es" },
                        { label: "French", value: "fr" },
                        { label: "German", value: "de" },
                        { label: "Chinese", value: "zh" }
                    ]}
                />

                <SettingSelect
                    label="Measurement Unit"
                    value={settings.defaultMeasurementUnit}
                    onChange={(value) => updateSetting('defaultMeasurementUnit', value)}
                    options={[
                        { label: "Metric (kg, cm)", value: "metric" },
                        { label: "Imperial (lb, in)", value: "imperial" }
                    ]}
                />
            </SettingsSection>
        </SettingsLayout>
    );
}