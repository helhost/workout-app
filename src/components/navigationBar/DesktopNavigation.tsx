import { useLocation } from "react-router-dom";
import NavLink from "./NavLink";
import { RouteItem } from "./types";

interface DesktopNavigationProps {
    routes: RouteItem[];
}

export default function DesktopNavigation({ routes }: DesktopNavigationProps) {
    const location = useLocation();

    return (
        <nav className="hidden md:flex md:items-center md:space-x-8">
            {routes.map((route) => {
                const isIconOnly = !!route.icon && route.name === "Profile";

                return (
                    <NavLink
                        key={route.path}
                        route={route}
                        isActive={location.pathname === route.path}
                        showLabel={!isIconOnly}
                    />
                );
            })}
        </nav>
    );
}