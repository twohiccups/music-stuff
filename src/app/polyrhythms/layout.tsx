// src/app/polyrhythms/layout.tsx
"use client";

import React, { ReactNode } from "react";
import { PolyrhythmProvider } from "@src/contexts/PolyrhythmContext";

export default function PolyrhythmLayout({ children }: { children: ReactNode }) {
    return (
        <PolyrhythmProvider>
            {children}
        </PolyrhythmProvider>
    );
}
