// User related API types (non-auth)
import { Models } from '..';

export namespace User {
    // Request types
    export interface UpdateNameRequest {
        name: string;
    }

    export interface UpdateBioRequest {
        bio: string;
    }

    export interface UpdateSettingsRequest {
        settings: {
            darkMode?: boolean;
            language?: string;
            defaultMeasurementUnit?: string;
        }
    }

    // Response types
    export interface UpdateNameResponse {
        message: string;
        user: {
            id: string;
            name: string;
        }
    }

    export interface UpdateBioResponse {
        message: string;
        user: {
            id: string;
            bio: string;
        }
    }

    export interface UpdateSettingsResponse {
        message: string;
        settings: Models.User.UserSettings;
    }

    export interface ProfileImageUploadResponse {
        message: string;
        image: {
            id: string;
            filename: string;
            mimeType: string;
            size: number;
        }
    }

    export interface ProfileImageDeleteResponse {
        message: string;
    }
}