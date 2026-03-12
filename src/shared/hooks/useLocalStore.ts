import { useRef, useEffect } from 'react';
import type { ILocalStore } from '@shared/types/shared';

export const useLocalStore = <T extends ILocalStore>(creator: () => T): T => {
    const container = useRef<T | null>(null);
    if (container.current === null) {
        container.current = creator();
    }

    useEffect(() => {
        return () => { container.current?.destroy(); };
    }, []);

    return container.current;
};
