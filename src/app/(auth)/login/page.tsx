'use client'
import styles from '../Auth.module.scss'
import Text from '@components/Text';
import Input from '@components/Input';
import { useCallback, useState } from 'react';
import Button from '@components/Button';
import { routes } from '@config/routes';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useRootStore } from '@/shared/store/RootStore';
import { useRouter } from 'next/navigation';
import ButtonEye from '@components/ButtonEye';

const Login = observer(() => {
    const [identifier, setIdentifier] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const { userStore } = useRootStore()
    const router = useRouter()

    const submitLogin = useCallback(async (e: React.SubmitEvent) => {
        e.preventDefault()
        await userStore.loginUser(identifier, password)

        if (userStore.isAuth) {
            router.push(routes.profile.mask)
        }
    }, [identifier, password, userStore])

    return (
        <div className={styles.authPage}>
            <form id='login-form' className={styles.form} onSubmit={submitLogin}>
                <Text tag='h3' color='primary' className={styles.title}>Login</Text>

                <div className={styles.inputContainer}>
                    <label className={styles.label} htmlFor="identifier">Email or Username</label>
                    <Input
                        id='identifier'
                        style={{ width: '100%' }}
                        value={identifier}
                        onChange={setIdentifier}
                        placeholder='Your identifier'
                        required />
                </div>

                <div className={styles.inputContainer}>
                    <label className={styles.label} htmlFor="loginPassword">Password</label>
                    <Input
                        id='loginPassword'
                        style={{ width: '100%' }}
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={setPassword}
                        placeholder='Your password'
                        required
                        afterSlot={
                           <ButtonEye show={showPassword} setIsShow={setShowPassword}/>
                        } />
                </div>

                <div className={styles.bottomContainer}>
                    <Link href={routes.register.mask}>
                        <Text className={styles.link}>I don't have an account</Text>
                    </Link>
                    <Button type='submit'>Confirm</Button>
                </div>

                {userStore.error && (
                    <Text view='p-16' className={styles.error}>{userStore.error}</Text>
                )}
            </form>
        </div>
    );
})

export default Login;