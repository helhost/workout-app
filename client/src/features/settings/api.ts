import api from '@/lib/api/axios';
import { handleApiError } from '@/lib/api/errors';
import { UserSettings } from '@/types';

/**
 * Updates the authenticated user's settings
 * @param settings Object containing the user's settings
 * @returns Promise with updated settings and success message
 * @throws ApiError if the update fails or user is not authenticated
 */
export const updateSettings = async (settings: UserSettings): Promise<{
    message: string;
    settings: UserSettings
}> => {
    try {
        const response = await api.patch<{
            message: string;
            settings: UserSettings
        }>('/user/settings', { settings });
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};