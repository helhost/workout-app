import { useLocation } from "react-router-dom";
import NavLink from "./NavLink";
import { DesktopNavigationProps } from "../types";

export default function DesktopNavigation({ routes }: DesktopNavigationProps) {
    const location = useLocation();

    return (
        <nav className="hidden md:flex md:items-center md:space-x-8">
            {routes.map((route) => {
                // All routes now have icons, but we'll still display labels
                return (
                    <NavLink
                        key={route.path}
                        route={route}
                        isActive={location.pathname === route.path}
                        showLabel={true}
                    />
                );
            })}
        </nav>
    );
}