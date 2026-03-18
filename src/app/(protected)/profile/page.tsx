'use client'
import Button from '@components/Button'
import Text from '@components/Text'
import styles from './Profile.module.scss'
import userImg from 'public/user.png'
import Image from 'next/image'
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
            <Text tag='h2' view='title' color='primary' className={styles.title}>Profile</Text>
            <div className={styles.profile}>
                <Image className={styles.img} width={100} height={100} src={userImg} alt="Изображение" />
                <div className={styles.textContainer}>
                    <div className={styles.info}>
                        <Text view='p-20' className={styles.label} color='primary'>Username</Text>
                        <Text view='p-20' color='primary'>{userStore.user?.username}</Text>
                    </div>
                    <div className={styles.info}>
                        <Text view='p-20' className={styles.label} color='primary'>Email</Text>
                        <Text view='p-20' color='primary'>{userStore.user?.email}</Text>
                    </div>
                </div>
            </div>

            <div className={styles.btnContainer}>
                <Button onClick={handleLogout} className={styles.btn}>Logout</Button>
            </div>
        </div>
    );
})

export default Profile;