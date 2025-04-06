import { useState } from "react";
import {
    ProfileLayout,
    ProfileSection,
    ProfileCard,
    ProfileInfoItem
} from "@/features/profile";
import { Scale, Ruler, Percent, Pencil, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function ProfilePage() {
    // Mock user data - In production, this would come from a store or API
    const [userData, setUserData] = useState({
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        bio: "Fitness enthusiast focused on strength training and functional movement. Currently training for my first 10K."
    });

    // Mock measurements data - In production, this would come from an API
    const [measurementsData, setMeasurementsData] = useState({
        weight: "75 kg",
        height: "180 cm",
        bodyFat: "16%",
        lastUpdated: "March 28, 2025"
    });

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

    // Open dialog for editing a field
    const openEditDialog = (title: string, field: string, value: string, section: string) => {
        setDialogConfig({ title, field, value, section });
        setNewValue(value);
        setDialogOpen(true);
    };

    // Handle saving the new value
    const handleSaveEdit = () => {
        if (dialogConfig.section === "profile") {
            setUserData({
                ...userData,
                [dialogConfig.field]: newValue
            });
        } else if (dialogConfig.section === "measurements") {
            setMeasurementsData({
                ...measurementsData,
                [dialogConfig.field]: newValue,
                lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
            });
        }
        setDialogOpen(false);
    };

    // Edit profile picture (would typically open file picker)
    const handleEditProfilePicture = () => {
        console.log("Edit profile picture clicked");
        // In a real app, this would open a file picker
    };

    return (
        <ProfileLayout>
            <ProfileSection title="Profile">
                {/* Profile Card with Edit Button */}
                <div className="relative">
                    <ProfileCard
                        name={userData.name}
                        email={userData.email}
                        avatar={<User className="h-12 w-12 text-gray-500 dark:text-gray-400" />}
                    />
                    {/* Edit profile picture button */}
                    <button
                        className="absolute top-0 right-[calc(50%-3rem)] p-1.5 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                        onClick={handleEditProfilePicture}
                        aria-label="Edit profile picture"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>

                    {/* Edit name button */}
                    <button
                        className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                        onClick={() => openEditDialog("Edit Name", "name", userData.name, "profile")}
                    >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit name</span>
                    </button>
                </div>

                <div className="py-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">About Me</h3>
                        <button
                            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                            onClick={() => openEditDialog("Edit Bio", "bio", userData.bio, "profile")}
                            aria-label="Edit bio"
                        >
                            <Pencil className="h-4 w-4" />
                        </button>
                    </div>
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
                    onEdit={() => openEditDialog("Edit Weight", "weight", measurementsData.weight, "measurements")}
                />

                <ProfileInfoItem
                    label="Height"
                    value={measurementsData.height}
                    icon={<Ruler className="h-5 w-5" />}
                    editable
                    onEdit={() => openEditDialog("Edit Height", "height", measurementsData.height, "measurements")}
                />

                <ProfileInfoItem
                    label="Body Fat"
                    value={measurementsData.bodyFat}
                    icon={<Percent className="h-5 w-5" />}
                    editable
                    onEdit={() => openEditDialog("Edit Body Fat", "bodyFat", measurementsData.bodyFat, "measurements")}
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
                            />
                        ) : (
                            <input
                                id="new-value"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)}
                            />
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveEdit}>
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </ProfileLayout>
    );
}