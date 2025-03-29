import { useLocation } from "react-router-dom";
import NavLink from "./NavLink";
import { MobileNavigationProps } from "../types";

export default function MobileNavigation({ routes, isOpen, onItemClick }: MobileNavigationProps) {
    const location = useLocation();

    if (!isOpen) return null;

    return (
        <nav className="mt-4 md:hidden py-2">
            <ul className="flex flex-col space-y-4">
                {routes.map((route) => (
                    <li key={route.path} className="w-full">
                        <NavLink
                            route={route}
                            isActive={location.pathname === route.path}
                            onClick={onItemClick}
                            showLabel={true}
                        />
                    </li>
                ))}
            </ul>
        </nav>
    );
}