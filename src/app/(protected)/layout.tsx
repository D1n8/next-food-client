'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '@/shared/store/RootStore';
import Loader from '@/shared/components/Loader';
import { routes } from '@/shared/config/routes';

const ProtectedLayout = observer(({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const { userStore } = useRootStore();

    useEffect(() => {
        if (userStore.isInit && !userStore.isAuth) {
            router.push(routes.login.mask);
        }
    }, [userStore.isInit, userStore.isAuth, router]);

    if (!userStore.isInit || !userStore.isAuth) {
        return (<div style={{ display: 'flex', width: "100%", justifyContent: 'center', marginTop: '50px' }}>
            <Loader size="l" />
        </div >);
    }

    return <>{children}</>;
});

export default ProtectedLayout;
