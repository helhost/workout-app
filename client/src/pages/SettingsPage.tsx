import { useState, useEffect } from "react";
import { setDarkMode } from "@/features/theme/themeUtils";
import SettingsLayout from "@/features/settings/components/SettingsLayout";
import SettingsSection from "@/features/settings/components/SettingsSection";
import SettingToggle from "@/features/settings/components/SettingToggle";
import SettingSelect from "@/features/settings/components/SettingSelect";
import { getProfile } from "@/features/profile/api";
import { Button } from "@/components/ui/button";
import { UserSettings, updateSettings } from "@/features/settings/api";


export default function SettingsPage() {
    // Settings state based on the actual fields from the database
    const [settings, setSettings] = useState<UserSettings>({
        darkMode: false,
        language: "en",
        defaultMeasurementUnit: "metric"
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await getProfile();
                if (response && response.profile && response.profile.settings) {
                    // Extract only the fields we need and use type assertion to ensure 
                    // we're handling the correct structure
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

    // Update dark mode in both state and UI
    const toggleDarkMode = (checked: boolean) => {
        setSettings(prev => ({ ...prev, darkMode: checked }));
        setDarkMode(checked); // Update UI immediately
    };

    // Save settings to the server
    const saveSettings = async () => {
        try {
            setIsSaving(true);
            setSaveMessage(null);

            // Call API to update settings
            await updateSettings(settings);

            // Show success message
            setSaveMessage({
                text: "Settings saved successfully",
                type: "success"
            });

            // Clear success message after 3 seconds
            setTimeout(() => setSaveMessage(null), 3000);
        } catch (err: any) {
            console.error("Error saving settings:", err);
            setSaveMessage({
                text: err.message || "Failed to save settings",
                type: "error"
            });
        } finally {
            setIsSaving(false);
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
            {saveMessage && (
                <div className={`mb-4 p-3 rounded ${saveMessage.type === 'success'
                    ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                    : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                    }`}>
                    {saveMessage.text}
                </div>
            )}

            <SettingsSection title="Appearance" description="Customize how the app looks and feels">
                <SettingToggle
                    label="Dark Mode"
                    description="Enable dark mode for the application"
                    checked={settings.darkMode}
                    onChange={toggleDarkMode}
                />
            </SettingsSection>

            <SettingsSection title="Preferences" description="Set your application preferences">
                <SettingSelect
                    label="Language"
                    value={settings.language}
                    onChange={(value) => setSettings(prev => ({ ...prev, language: value }))}
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
                    onChange={(value) => setSettings(prev => ({ ...prev, defaultMeasurementUnit: value }))}
                    options={[
                        { label: "Metric (kg, cm)", value: "metric" },
                        { label: "Imperial (lb, in)", value: "imperial" }
                    ]}
                />
            </SettingsSection>

            <div className="flex justify-end mt-6">
                <Button
                    onClick={saveSettings}
                    disabled={isSaving}
                >
                    {isSaving ? "Saving..." : "Save Settings"}
                </Button>
            </div>
        </SettingsLayout>
    );
}