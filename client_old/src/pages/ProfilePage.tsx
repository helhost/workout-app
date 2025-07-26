import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { ProfileLayout, ProfileCard, ProfileSection, ProfileInfoItem } from '@/features/profile';
import { Button } from '@/components/ui/button';
import { User } from '@shared';
import { getUser } from '@/features/auth/api';
import { updateName, updateBio, getLatestMeasurements } from '@/features/profile/api';

export default function ProfilePage() {
    const [profile, setProfile] = useState<User.UserFull | null>(null);
    const [measurements, setMeasurements] = useState<User.SimpleMeasurements | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [editingName, setEditingName] = useState(false);
    const [editingBio, setEditingBio] = useState(false);
    const [nameInput, setNameInput] = useState('');
    const [bioInput, setBioInput] = useState('');

    // Fetch user profile and measurements
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setIsLoading(true);
                const { profile } = await getUser();
                const { measurements } = await getLatestMeasurements();

                setProfile(profile);
                setMeasurements(measurements);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
                toast.error('Failed to load profile');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    // Handle name update
    const handleNameUpdate = async () => {
        if (!profile) return;

        try {
            const { user } = await updateName(nameInput);
            setProfile(prev => prev ? { ...prev, name: user.name } : null);
            setEditingName(false);
            toast.success('Name updated successfully');
        } catch (error) {
            console.error('Failed to update name:', error);
            toast.error('Failed to update name');
        }
    };

    // Handle bio update
    const handleBioUpdate = async () => {
        if (!profile) return;

        try {
            const { user } = await updateBio(bioInput);
            setProfile(prev => prev ? { ...prev, bio: user.bio } : null);
            setEditingBio(false);
            toast.success('Bio updated successfully');
        } catch (error) {
            console.error('Failed to update bio:', error);
            toast.error('Failed to update bio');
        }
    };

    // Refresh profile data after image update
    const handleImageUpdated = async () => {
        try {
            const { profile: updatedProfile } = await getUser();
            setProfile(updatedProfile);
        } catch (error) {
            console.error('Failed to refresh profile:', error);
        }
    };

    if (isLoading) {
        return (
            <ProfileLayout>
                <div className="text-center">Loading profile...</div>
            </ProfileLayout>
        );
    }

    if (!profile) {
        return (
            <ProfileLayout>
                <div className="text-center">Failed to load profile</div>
            </ProfileLayout>
        );
    }

    return (
        <ProfileLayout>
            {/* Profile Card */}
            <ProfileCard
                name={profile.name}
                email={profile.email}
                bio={profile.bio}
                hasProfileImage={!!profile.profileImage}
                onImageUpdated={handleImageUpdated}
                onEditName={() => {
                    setNameInput(profile.name);
                    setEditingName(true);
                }}
                onEditBio={() => {
                    setBioInput(profile.bio);
                    setEditingBio(true);
                }}
            />

            {/* Personal Information Section */}
            <ProfileSection
                title="Personal Information"
                description="Manage your basic profile details"
            >
                {editingName ? (
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            className="flex-grow border rounded px-2 py-1"
                            placeholder="Enter your name"
                        />
                        <Button
                            size="sm"
                            onClick={handleNameUpdate}
                            disabled={!nameInput.trim()}
                        >
                            Save
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingName(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                ) : (
                    <ProfileInfoItem
                        label="Name"
                        value={profile.name}
                        editable
                        onEdit={() => {
                            setNameInput(profile.name);
                            setEditingName(true);
                        }}
                    />
                )}

                {editingBio ? (
                    <div className="flex items-center space-x-2">
                        <textarea
                            value={bioInput}
                            onChange={(e) => setBioInput(e.target.value)}
                            className="flex-grow border rounded px-2 py-1"
                            placeholder="Write something about yourself"
                            rows={3}
                        />
                        <div className="flex flex-col space-y-2">
                            <Button
                                size="sm"
                                onClick={handleBioUpdate}
                            >
                                Save
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingBio(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <ProfileInfoItem
                        label="Bio"
                        value={profile.bio || "No bio added"}
                        editable
                        onEdit={() => {
                            setBioInput(profile.bio || '');
                            setEditingBio(true);
                        }}
                    />
                )}
            </ProfileSection>

            {/* Measurements Section */}
            <ProfileSection
                title="Body Measurements"
                description="Track your latest body metrics"
            >
                <ProfileInfoItem
                    label="Weight"
                    value={measurements?.weight
                        ? `${measurements.weight.value} kg`
                        : "No weight data"
                    }
                />
                <ProfileInfoItem
                    label="Height"
                    value={measurements?.height
                        ? `${measurements.height.value} cm`
                        : "No height data"
                    }
                />
                <ProfileInfoItem
                    label="Body Fat"
                    value={measurements?.bodyFat
                        ? `${measurements.bodyFat.value}%`
                        : "No body fat data"
                    }
                />
            </ProfileSection>
        </ProfileLayout>
    );
}