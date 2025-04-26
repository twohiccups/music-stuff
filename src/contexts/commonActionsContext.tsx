// src/contexts/commonActionsContext.tsx
"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { Action } from "@src/types/types";
import { Info as InfoIcon, Palette as PaletteIcon } from "@mui/icons-material";
import { useThemeContext } from "@src/contexts/themeContext";

// Create context for common actions
type CommonActionsContextType = Action[];
const CommonActionsContext = createContext<CommonActionsContextType>([]);

export function useCommonActionsContext() {
    return useContext(CommonActionsContext);
}

export function CommonActionsProvider({ children }: { children: ReactNode }) {
    const { toggleThemeOptions } = useThemeContext();

    // Define common actions array
    const commonActions: Action[] = [
        {
            name: "Info",
            icon: <InfoIcon />,
            onClick: () =>
                alert("This is a chord player. Choose a chord and hear how it sounds."),
        },
        {
            name: "Theme",
            icon: <PaletteIcon />,
            onClick: toggleThemeOptions,
        },
    ];

    return (
        <CommonActionsContext.Provider value={commonActions}>
            {children}
        </CommonActionsContext.Provider>
    );
}
