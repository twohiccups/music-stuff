// src/contexts/pageActions.tsx
"use client";

import { createContext, ReactNode, useContext } from "react";
import { Action } from "@src/types/types";

const PageActionsContext = createContext<Action[]>([]);

export function usePageActionsContext() {
    return useContext(PageActionsContext);
}

/** Wrap any subtree that wants to add its own actions */
export function PageActionsProvider({
    actions,
    children,
}: {
    actions: Action[];
    children: ReactNode;
}) {
    return (
        <PageActionsContext.Provider value={actions}>
            {children}
        </PageActionsContext.Provider>
    );
}
