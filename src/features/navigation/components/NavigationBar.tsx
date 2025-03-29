import { Link, Outlet } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User, Settings, BarChart, Dumbbell } from "lucide-react";
import DesktopNavigation from "./DesktopNavigation";
import MobileNavigation from "./MobileNavigation";
import { RouteItem } from "../types";

export default function NavigationBar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const routes: RouteItem[] = [
        { name: "Stats", path: "/stats", icon: <BarChart className="size-5" /> },
        { name: "Workouts", path: "/workouts", icon: <Dumbbell className="size-5" /> },
        { name: "Settings", path: "/settings", icon: <Settings className="size-5" /> },
        { name: "Profile", path: "/profile", icon: <User className="size-5" /> }
    ];

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
    const closeMobileMenu = () => setMobileMenuOpen(false);

    return (
        <>
            <header className="border-b border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800">
                <div className="container mx-auto px-4 py-4">
                    {/* Logo and Brand */}
                    <div className="flex items-center justify-between">
                        <Link to="/" className="text-2xl font-bold">
                            AppName
                        </Link>

                        {/* Hamburger menu for mobile */}
                        <Button
                            className="md:hidden p-2 flex items-center justify-center"
                            onClick={toggleMobileMenu}
                            aria-label="Toggle navigation menu"
                            variant="ghost"
                        >
                            <span className="sr-only">Menu</span>
                            {mobileMenuOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="3" y1="12" x2="21" y2="12"></line>
                                    <line x1="3" y1="6" x2="21" y2="6"></line>
                                    <line x1="3" y1="18" x2="21" y2="18"></line>
                                </svg>
                            )}
                        </Button>

                        {/* Desktop Navigation */}
                        <DesktopNavigation routes={routes} />
                    </div>

                    {/* Mobile Navigation */}
                    <MobileNavigation
                        routes={routes}
                        isOpen={mobileMenuOpen}
                        onItemClick={closeMobileMenu}
                    />
                </div>
            </header>

            <main className="container mx-auto px-4 py-6">
                <Outlet />
            </main>
        </>
    );
}