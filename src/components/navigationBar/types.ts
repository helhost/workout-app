import { ReactNode } from "react";

export interface RouteItem {
    name: string;
    path: string;
    icon?: ReactNode;
}

export interface NavLinkProps {
    route: RouteItem;
    isActive: boolean;
    onClick?: () => void;
    showLabel?: boolean;
}