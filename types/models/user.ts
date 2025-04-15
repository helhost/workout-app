export namespace User {
    export interface MeasurementData {
        value: number;
        date: string;
    }

    export interface MeasurementHistory {
        id: string;
        value: number;
        date: string;
    }

    export interface UserMeasurements {
        weight: MeasurementData | null;
        height: MeasurementData | null;
        bodyFat: MeasurementData | null;
    }

    export interface User {
        id: string;
        name: string;
        email: string;
        bio?: string;
        profilePicture?: string;
        createdAt: string;
        settings: UserSettings;
        measurements: UserMeasurements;
        hasProfileImage: boolean;
        profileImage?: ProfileImage;
    }

    export interface UserSettings {
        darkMode: boolean;
        language: string;
        defaultMeasurementUnit: string;
    }

    export interface ProfileImage {
        id: string;
        filename: string;
        mimeType: string;
        size: number;
    }
}