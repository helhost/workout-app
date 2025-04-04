import { useState } from "react";
import {
    ProfileLayout,
    ProfileSection,
    ProfileCard,
    ProfileInfoItem
} from "@/features/profile";
import { Scale, Ruler, Percent, Activity } from "lucide-react";

export default function ProfilePage() {
    // Mock user data - In production, this would come from a store or API
    const [userData] = useState({
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        bio: "Fitness enthusiast focused on strength training and functional movement. Currently training for my first 10K."
    });

    // Mock measurements data - In production, this would come from an API
    const [measurementsData] = useState({
        weight: "75 kg",
        height: "180 cm",
        bodyFat: "16%",
        chest: "98 cm",
        waist: "82 cm",
        arms: "38 cm",
        lastUpdated: "March 28, 2025"
    });

    // This would open a modal or form to update measurements
    const handleUpdateMeasurements = () => {
        console.log("Update measurements clicked");
        // Would open measurement update form
    };

    return (
        <ProfileLayout>
            <ProfileSection title="Profile">
                <ProfileCard
                    name={userData.name}
                    email={userData.email}
                />

                <div className="py-4">
                    <h3 className="font-medium mb-2">About Me</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                        {userData.bio}
                    </p>
                </div>
            </ProfileSection>

            <ProfileSection
                title="Body Measurements"
                description={`Last updated: ${measurementsData.lastUpdated}`}
            >
                <ProfileInfoItem
                    label="Weight"
                    value={measurementsData.weight}
                    icon={<Scale className="h-5 w-5" />}
                    editable
                    onEdit={() => handleUpdateMeasurements()}
                />

                <ProfileInfoItem
                    label="Height"
                    value={measurementsData.height}
                    icon={<Ruler className="h-5 w-5" />}
                    editable
                    onEdit={() => handleUpdateMeasurements()}
                />

                <ProfileInfoItem
                    label="Body Fat"
                    value={measurementsData.bodyFat}
                    icon={<Percent className="h-5 w-5" />}
                    editable
                    onEdit={() => handleUpdateMeasurements()}
                />

                <ProfileInfoItem
                    label="Chest"
                    value={measurementsData.chest}
                    icon={<Activity className="h-5 w-5" />}
                    editable
                    onEdit={() => handleUpdateMeasurements()}
                />

                <ProfileInfoItem
                    label="Waist"
                    value={measurementsData.waist}
                    icon={<Activity className="h-5 w-5" />}
                    editable
                    onEdit={() => handleUpdateMeasurements()}
                />

                <ProfileInfoItem
                    label="Arms"
                    value={measurementsData.arms}
                    icon={<Activity className="h-5 w-5" />}
                    editable
                    onEdit={() => handleUpdateMeasurements()}
                />
            </ProfileSection>
        </ProfileLayout>
    );
}