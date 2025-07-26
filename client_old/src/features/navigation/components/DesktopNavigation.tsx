import NavLink from "./NavLink";
import { DesktopNavigationProps } from "../types";

export default function DesktopNavigation({ routes }: DesktopNavigationProps) {
    return (
        <nav className="hidden md:flex md:items-center md:space-x-8">
            {routes.map((route) => {
                return (
                    <NavLink
                        key={route.path}
                        route={route}
                        showLabel={true}
                    />
                );
            })}
        </nav>
    );
}