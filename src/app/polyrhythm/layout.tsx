// src/app/polyrhythm/layout.tsx
"use client";

import React, { ReactNode } from "react";
import { PolyrhythmProvider } from "@src/contexts/PolyrhythmContext";
import { CommonActionsProvider } from "@src/contexts/CommonActionsContext";

export default function PolyrhythmLayout({ children }: { children: ReactNode }) {
    return (
        <PolyrhythmProvider>
            <CommonActionsProvider>
                {children}
            </CommonActionsProvider>
        </PolyrhythmProvider>
    );
}
