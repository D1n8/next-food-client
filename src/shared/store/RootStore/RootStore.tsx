'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { enableStaticRendering } from 'mobx-react-lite';
import UIStore from '../UIStore';
import UserStore from '../UserStore';
import ShoppingStore from '../ShoppingStore';

enableStaticRendering(typeof window === 'undefined');

export class RootStore {
    uiStore: UIStore;
    userStore: UserStore;
    shoppingStore: ShoppingStore;
    constructor() {
        this.uiStore = new UIStore();
        this.userStore = new UserStore();
        this.shoppingStore = new ShoppingStore();
    }
}

let clientStore: RootStore | undefined;

const RootStoreContext = createContext<RootStore | null>(null);

export const RootStoreProvider = ({ children }: { children: React.ReactNode }) => {
    const [store] = useState(() => {
        if (typeof window === 'undefined') return new RootStore();
        if (!clientStore) clientStore = new RootStore();
        return clientStore;
    });

    useEffect(() => {
        if (!store.userStore.isInit) {
            store.userStore.checkAuth();
        }

        store.uiStore.initTheme();
        store.shoppingStore.init();
    }, [store]);

    return (
        <RootStoreContext.Provider value={store}>
            {children}
        </RootStoreContext.Provider>
    );
};

export const useRootStore = (): RootStore => {
    const context = useContext(RootStoreContext);
    if (!context) throw new Error('useRootStore must be used within RootStoreProvider');
    return context;
};