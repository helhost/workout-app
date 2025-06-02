import { PrismaTypes } from ".";

export namespace User {

    export type Settings = Omit<PrismaTypes.UserSettings, 'userId' | 'createdAt' | 'updatedAt' | 'id'>;

    export type MeasurementData = Omit<PrismaTypes.WeightMeasurement, 'userId' | 'userMeasurementsId' | 'id'>;

    export type Measurements = {
        weights: MeasurementData[];
        heights: MeasurementData[];
        bodyFats: MeasurementData[];
    };

    export type SimpleMeasurements = {
        weight: MeasurementData | null;
        height: MeasurementData | null;
        bodyFat: MeasurementData | null;
    };

    export type ProfileImage = Omit<PrismaTypes.ProfileImage, 'userId' | 'createdAt' | 'updatedAt'>;
    export type ProfileImageMetadata = Omit<ProfileImage, 'data'>;

    export type UserFull = Omit<PrismaTypes.User, 'password'> & {
        settings: Settings | null;
        measurements: SimpleMeasurements; // last measurements
        profileImage: Omit<ProfileImage, 'data'> | null;

    }

    export type BaseUser = PrismaTypes.User
}