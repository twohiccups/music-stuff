'use client';

import React, { createContext, useContext, ReactNode, useState } from 'react';
import { Action } from '@src/types/types';
import PaletteIcon from '@mui/icons-material/Palette';
import InfoDialog from '@app/polyrhythm/components/InfoDialog';
import { useThemeContext } from '@src/contexts/ThemeContext';

const CommonActionsContext = createContext<Action[]>([]);
export function useCommonActionsContext() {
    return useContext(CommonActionsContext);
}

export function CommonActionsProvider({ children }: { children: ReactNode }) {
    const { toggleThemeOptions } = useThemeContext();
    const [infoOpen, setInfoOpen] = useState(false);

    const actions: Action[] = [
        {
            name: 'Theme',
            icon: <PaletteIcon />,
            onClick: toggleThemeOptions,
        },
    ];

    return (
        <CommonActionsContext.Provider value={actions}>
            {children}
            <InfoDialog open={infoOpen} onClose={() => setInfoOpen(false)} />
        </CommonActionsContext.Provider>
    );
}
