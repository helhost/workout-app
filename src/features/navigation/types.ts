import { ReactNode } from "react";

export interface RouteItem {
    name: string;
    path: string;
    icon?: ReactNode;
}

export interface NavLinkProps {
    route: RouteItem;
    isActive?: boolean; // Make isActive optional
    onClick?: () => void;
    showLabel?: boolean;
}

export interface DesktopNavigationProps {
    routes: RouteItem[];
}

export interface MobileNavigationProps {
    routes: RouteItem[];
    isOpen: boolean;
    onItemClick: () => void;
}