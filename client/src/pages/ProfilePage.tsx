import { useState } from "react";
import { Mail, Phone, MapPin, Briefcase, Calendar, Globe } from "lucide-react";
import {
    ProfileLayout,
    ProfileSection,
    ProfileCard,
    ProfileInfoItem
} from "@/features/profile";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
    // Mock user data - In production, this would come from a store or API
    const [userData] = useState({
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        phone: "+1 (555) 123-4567",
        address: "123 Main Street, San Francisco, CA",
        occupation: "Software Engineer",
        birthday: "May 15, 1990",
        website: "alexjohnson.dev",
        bio: "Passionate developer with a love for clean code and user-friendly interfaces. Enjoys hiking and photography in free time."
    });

    // These would be real handlers in a complete implementation
    const handleEditInfo = (field: string) => {
        console.log(`Editing ${field}`);
        // Would open a modal or inline form
    };

    const handleChangePassword = () => {
        console.log("Change password clicked");
        // Would open password change dialog
    };

    return (
        <ProfileLayout>
            <ProfileSection
                title="Personal Profile"
                description="Your personal information and preferences"
            >
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
                title="Contact Information"
                description="Your contact details that may be shared with other users"
            >
                <ProfileInfoItem
                    label="Email"
                    value={userData.email}
                    icon={<Mail className="h-5 w-5" />}
                    editable
                    onEdit={() => handleEditInfo('email')}
                />

                <ProfileInfoItem
                    label="Phone"
                    value={userData.phone}
                    icon={<Phone className="h-5 w-5" />}
                    editable
                    onEdit={() => handleEditInfo('phone')}
                />

                <ProfileInfoItem
                    label="Address"
                    value={userData.address}
                    icon={<MapPin className="h-5 w-5" />}
                    editable
                    onEdit={() => handleEditInfo('address')}
                />

                <ProfileInfoItem
                    label="Website"
                    value={userData.website}
                    icon={<Globe className="h-5 w-5" />}
                    editable
                    onEdit={() => handleEditInfo('website')}
                />
            </ProfileSection>

            <ProfileSection
                title="Personal Details"
                description="Additional information about you"
            >
                <ProfileInfoItem
                    label="Occupation"
                    value={userData.occupation}
                    icon={<Briefcase className="h-5 w-5" />}
                    editable
                    onEdit={() => handleEditInfo('occupation')}
                />

                <ProfileInfoItem
                    label="Birthday"
                    value={userData.birthday}
                    icon={<Calendar className="h-5 w-5" />}
                    editable
                    onEdit={() => handleEditInfo('birthday')}
                />
            </ProfileSection>

            <ProfileSection
                title="Security"
                description="Manage your account security settings"
            >
                <div className="py-4 flex items-center justify-between">
                    <div>
                        <h3 className="font-medium">Password</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Last changed 3 months ago
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleChangePassword}
                    >
                        Change Password
                    </Button>
                </div>
            </ProfileSection>
        </ProfileLayout>
    );
}