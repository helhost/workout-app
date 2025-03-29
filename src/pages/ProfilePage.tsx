import { User } from "lucide-react";

export default function ProfilePage() {
    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">User Profile</h1>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col items-center mb-6">
                    <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-3">
                        <User className="h-12 w-12 text-gray-500 dark:text-gray-400" />
                    </div>
                    <h2 className="text-xl font-semibold">User Name</h2>
                    <p className="text-gray-500 dark:text-gray-400">user@example.com</p>
                </div>

                <div className="space-y-4">
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <h3 className="font-medium mb-2">Profile Information</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            This is where profile information would be displayed and possibly edited.
                        </p>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <h3 className="font-medium mb-2">Account Settings</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Account-specific settings would go here.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}