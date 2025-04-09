import { useState, useEffect } from "react";
import {
    ProfileLayout,
    ProfileSection,
    ProfileInfoItem,
    ProfileCard
} from "@/features/profile";
import { Scale, Ruler, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    getProfile,
    updateName,
    updateBio,
    addWeightMeasurement,
    addHeightMeasurement,
    addBodyFatMeasurement,
    ProfileUser,
    MeasurementData,
    UserMeasurements
} from "@/features/profile/api";

export default function ProfilePage() {
    // State to hold profile data
    const [profileData, setProfileData] = useState<ProfileUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogConfig, setDialogConfig] = useState({
        title: "",
        field: "",
        value: "",
        section: ""
    });

    // New value for editing
    const [newValue, setNewValue] = useState("");

    // Fetch profile data on page load
    const fetchProfileData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await getProfile();

            setProfileData(response.profile);
        } catch (err: any) {
            setError(err.message || "Failed to load profile data");
            console.error("Error fetching profile data:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    // Open dialog for editing a field
    const openEditDialog = (title: string, field: string, value: string, section: string) => {
        setDialogConfig({ title, field, value, section });
        setNewValue(value);
        setDialogOpen(true);
    };

    // Format measurement for display
    const formatMeasurement = (measurement: MeasurementData | null, unit: string): string => {
        if (!measurement) return "Not set";
        return `${measurement.value} ${unit}`;
    };

    // Handle profile image update - only update the hasProfileImage flag
    const handleProfileImageUpdated = async () => {
        // Just fetch the profile data to update the hasProfileImage flag
        // but don't trigger a full component remount
        fetchProfileData();
    };

    // Handle saving the new value
    const handleSaveEdit = async () => {
        try {
            setIsLoading(true);

            if (dialogConfig.section === "profile") {
                if (dialogConfig.field === "name") {
                    const response = await updateName(newValue);
                    if (profileData) {
                        setProfileData({
                            ...profileData,
                            name: response.user.name
                        });
                    }
                } else if (dialogConfig.field === "bio") {
                    const response = await updateBio(newValue);
                    if (profileData) {
                        setProfileData({
                            ...profileData,
                            bio: response.user.bio
                        });
                    }
                }
            } else if (dialogConfig.section === "measurements") {
                const value = parseFloat(newValue);

                if (isNaN(value)) {
                    setError("Please enter a valid number");
                    return;
                }

                let updatedMeasurements: UserMeasurements = { ...profileData?.measurements } as UserMeasurements;

                if (dialogConfig.field === "weight") {
                    const response = await addWeightMeasurement(value);
                    updatedMeasurements.weight = {
                        value: response.measurement.value,
                        date: response.measurement.date
                    };
                } else if (dialogConfig.field === "height") {
                    const response = await addHeightMeasurement(value);
                    updatedMeasurements.height = {
                        value: response.measurement.value,
                        date: response.measurement.date
                    };
                } else if (dialogConfig.field === "bodyFat") {
                    const response = await addBodyFatMeasurement(value);
                    updatedMeasurements.bodyFat = {
                        value: response.measurement.value,
                        date: response.measurement.date
                    };
                }

                if (profileData) {
                    setProfileData({
                        ...profileData,
                        measurements: updatedMeasurements
                    });
                }
            }

            setDialogOpen(false);
        } catch (err: any) {
            setError(err.message || "Failed to update data");
            console.error("Error updating data:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Get the last updated date for measurements
    const getLastMeasurementDate = (): string => {
        if (!profileData?.measurements) return "No data";

        const dates: Date[] = [];

        if (profileData.measurements.weight) {
            dates.push(new Date(profileData.measurements.weight.date));
        }
        if (profileData.measurements.height) {
            dates.push(new Date(profileData.measurements.height.date));
        }
        if (profileData.measurements.bodyFat) {
            dates.push(new Date(profileData.measurements.bodyFat.date));
        }

        if (dates.length === 0) return "No measurements";

        // Find the most recent date
        const latestDate = new Date(Math.max(...dates.map(date => date.getTime())));
        return latestDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (isLoading && !profileData) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="text-gray-500 dark:text-gray-400">Loading profile data...</span>
            </div>
        );
    }

    if (error && !profileData) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="bg-red-100 dark:bg-red-900 p-4 rounded-md text-red-700 dark:text-red-200">
                    <h2 className="font-semibold mb-2">Error Loading Profile</h2>
                    <p>{error}</p>
                    <Button
                        className="mt-4"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <ProfileLayout>
            {error && (
                <div className="mb-6 bg-red-100 dark:bg-red-900 p-3 rounded-md text-red-700 dark:text-red-200">
                    {error}
                    <Button
                        variant="ghost"
                        className="ml-2 p-1 h-auto text-red-700 dark:text-red-200"
                        onClick={() => setError(null)}
                    >
                        ✕
                    </Button>
                </div>
            )}

            <ProfileSection title="Profile">
                {/* Use the ProfileCard component without the key prop for forcing re-renders */}
                <ProfileCard
                    name={profileData?.name || ""}
                    email={profileData?.email || ""}
                    bio={profileData?.bio}
                    hasProfileImage={profileData?.hasProfileImage || false}
                    onImageUpdated={handleProfileImageUpdated}
                    onEditName={() => openEditDialog("Edit Name", "name", profileData?.name || "", "profile")}
                    onEditBio={() => openEditDialog("Edit Bio", "bio", profileData?.bio || "", "profile")}
                />
            </ProfileSection>

            <ProfileSection
                title="Body Measurements"
                description={`Last updated: ${getLastMeasurementDate()}`}
            >
                <ProfileInfoItem
                    label="Weight"
                    value={formatMeasurement(profileData?.measurements?.weight || null, "kg")}
                    icon={<Scale className="h-5 w-5" />}
                    editable
                    onEdit={() => openEditDialog(
                        "Edit Weight",
                        "weight",
                        profileData?.measurements?.weight?.value.toString() || "",
                        "measurements"
                    )}
                />

                <ProfileInfoItem
                    label="Height"
                    value={formatMeasurement(profileData?.measurements?.height || null, "cm")}
                    icon={<Ruler className="h-5 w-5" />}
                    editable
                    onEdit={() => openEditDialog(
                        "Edit Height",
                        "height",
                        profileData?.measurements?.height?.value.toString() || "",
                        "measurements"
                    )}
                />

                <ProfileInfoItem
                    label="Body Fat"
                    value={formatMeasurement(profileData?.measurements?.bodyFat || null, "%")}
                    icon={<Percent className="h-5 w-5" />}
                    editable
                    onEdit={() => openEditDialog(
                        "Edit Body Fat",
                        "bodyFat",
                        profileData?.measurements?.bodyFat?.value.toString() || "",
                        "measurements"
                    )}
                />
            </ProfileSection>

            {/* Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{dialogConfig.title}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        {dialogConfig.field === "bio" ? (
                            <textarea
                                id="new-value"
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)}
                                rows={4}
                                disabled={isLoading}
                            />
                        ) : (
                            <input
                                id="new-value"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)}
                                disabled={isLoading}
                                type={dialogConfig.section === "measurements" ? "number" : "text"}
                                step={dialogConfig.field === "bodyFat" ? "0.1" : "1"}
                            />
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDialogOpen(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveEdit}
                            disabled={isLoading}
                        >
                            {isLoading ? "Saving..." : "Confirm"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </ProfileLayout>
    );
}