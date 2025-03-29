import { Link, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export default function NavigationBar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    const routes = [
        { name: "Stats", path: "/stats" },
        { name: "Settings", path: "/settings" },
        { name: "Profile", path: "/profile", icon: <User className="size-5" /> }
    ];

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
                            className="md:hidden p-2"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            ☰
                        </Button>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex md:items-center md:space-x-8">
                            {routes.map((route) => route.icon ? (
                                <Link
                                    key={route.path}
                                    to={route.path}
                                    className={`text-base font-medium flex items-center ${location.pathname === route.path
                                            ? "text-blue-600 dark:text-blue-400"
                                            : "text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                                        }`}
                                >
                                    {route.icon}
                                </Link>
                            ) : (
                                <Link
                                    key={route.path}
                                    to={route.path}
                                    className={`text-base font-medium ${location.pathname === route.path
                                            ? "text-blue-600 dark:text-blue-400"
                                            : "text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                                        }`}
                                >
                                    {route.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Mobile Navigation */}
                    {mobileMenuOpen && (
                        <nav className="mt-4 md:hidden space-y-2 py-2">
                            {routes.map((route) => (
                                <Link
                                    key={route.path}
                                    to={route.path}
                                    className={`block py-2 text-base font-medium ${location.pathname === route.path
                                            ? "text-blue-600 dark:text-blue-400"
                                            : "text-gray-800 dark:text-gray-200"
                                        } ${route.icon ? "flex items-center gap-2" : ""}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {route.icon && route.icon}
                                    {route.name}
                                </Link>
                            ))}
                        </nav>
                    )}
                </div>
            </header>

            <main className="container mx-auto px-4 py-6">
                <Outlet />
            </main>
        </>
    );
}