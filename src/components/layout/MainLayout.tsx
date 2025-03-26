import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu"
import { Link, useLocation, Outlet } from "react-router-dom"
import { cn } from "@/lib/utils"

const navigationLinks = [
    { to: "/", label: "Home" },
    { to: "/stats", label: "Stats" },
    { to: "/settings", label: "Settings" }
]

export default function MainLayout() {
    const { pathname } = useLocation()

    return (
        <div className="flex flex-col min-h-screen">
            {/* Nav bar */}
            <NavigationMenu className="fixed w-full z-50 bg-white dark:bg-gray-900 border-t md:border-t-0 md:border-b bottom-0 md:top-0 md:bottom-auto">
                <NavigationMenuList className="flex justify-around w-full">
                    {navigationLinks.map(({ to, label }) => (
                        <NavigationMenuItem key={to}>
                            <Link
                                to={to}
                                className={cn(
                                    "px-4 py-3 text-sm font-medium transition-colors",
                                    pathname === to ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                {label}
                            </Link>
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
            </NavigationMenu>

            {/* Page content */}
            <div className="pt-16 pb-20 md:pt-20 md:pb-0">
                <Outlet />
            </div>
        </div>
    )
}