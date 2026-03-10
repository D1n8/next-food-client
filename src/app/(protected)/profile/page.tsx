'use client'
import Button from '@components/Button'
import Text from '@components/Text'
import styles from './Profile.module.scss'
import { observer } from 'mobx-react-lite'
import { useCallback } from 'react'
import { useRootStore } from '@/shared/store/RootStore'

const Profile = observer(() => {
    const { userStore } = useRootStore()

    const handleLogout = useCallback(() => {
        userStore.logoutUser()
    }, [])

    return (
        <div className={styles.profilePage}>
            <div className={styles.topContainer}>
                <Text tag='h2' color='primary'>Profile</Text>
                <Button onClick={handleLogout}>Logout</Button>
            </div>

            <div className={styles.textContainer}>
                <Text view='p-18' color='primary'>Username: {userStore.user?.username}</Text>
                <Text view='p-18' color='primary'>Email: {userStore.user?.email}</Text>
            </div>
        </div>
    );
})

export default Profile;