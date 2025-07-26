import NavLink from "./NavLink";
import { MobileNavigationProps } from "../types";

export default function MobileNavigation({ routes, isOpen, onItemClick }: MobileNavigationProps) {
    if (!isOpen) return null;

    return (
        <nav className="mt-4 md:hidden py-2">
            <ul className="flex flex-col space-y-4">
                {routes.map((route) => (
                    <li key={route.path} className="w-full">
                        <NavLink
                            route={route}
                            onClick={onItemClick}
                            showLabel={true}
                        />
                    </li>
                ))}
            </ul>
        </nav>
    );
}