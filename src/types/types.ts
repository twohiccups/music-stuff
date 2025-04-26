import { ReactNode } from "react";

export interface Action {
    name: string,
    icon: ReactNode,
    onClick: () => void,
    mobileOnly?: boolean
}