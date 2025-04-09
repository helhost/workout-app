import api from '@/lib/api/axios';
import { handleApiError } from '@/lib/api/errors';

// Define UserSettings interface that exactly matches your database schema
export interface UserSettings {
    darkMode: boolean;
    language: string;
    defaultMeasurementUnit: string;
}

// Function to update user settings
export const updateSettings = async (settings: UserSettings): Promise<{
    message: string;
    settings: UserSettings
}> => {
    try {
        const response = await api.patch<{
            message: string;
            settings: UserSettings
        }>('/profile/settings', { settings });
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};