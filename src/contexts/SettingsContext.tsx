// src/contexts/SettingsContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface SettingsContextType {
    openSettings(): void;
    closeSettings(): void;
    isOpen: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function useSettingsContext() {
    const ctx = useContext(SettingsContext);
    if (!ctx) throw new Error("useSettingsContext must be used within a SettingsProvider");
    return ctx;
}

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const openSettings = () => setIsOpen(true);
    const closeSettings = () => setIsOpen(false);

    return (
        <SettingsContext.Provider value={{ isOpen, openSettings, closeSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}
