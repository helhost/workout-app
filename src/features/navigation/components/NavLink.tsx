import { Link } from "react-router-dom";
import { NavLinkProps } from "../types";

export default function NavLink({ route, isActive, onClick, showLabel = true }: NavLinkProps) {
    const baseClasses = `${isActive
        ? "text-blue-600 dark:text-blue-400"
        : "text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
        }`;

    return (
        <Link
            to={route.path}
            className={`text-base font-medium ${baseClasses} ${route.icon ? "flex items-center gap-2" : ""} md:inline-flex w-full md:w-auto py-2 md:py-0`}
            onClick={onClick}
        >
            {route.icon && route.icon}
            {showLabel && route.name}
        </Link>
    );
}