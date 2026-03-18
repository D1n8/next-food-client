'use client'
import Input from '@components/Input';
import styles from '../Auth.module.scss'
import { useCallback, useState, useEffect } from 'react';
import Button from '@components/Button';
import Text from '@components/Text';
import Link from 'next/link';
import { routes } from '@config/routes';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '@/shared/store/RootStore';
import { useRouter } from 'next/navigation';
import ButtonEye from '@components/ButtonEye';

const Register = observer(() => {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string }>({})
    const router = useRouter()
    const { userStore } = useRootStore()

    useEffect(() => {
        userStore.clearError()
    }, [userStore])

    const validate = useCallback(() => {
        const newErrors: { username?: string; email?: string; password?: string } = {}

        if (username.length > 20) {
            newErrors.username = 'Maximum 20 characters allowed'
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            newErrors.email = 'Invalid email format'
        }

        if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }, [username, email, password])

    const submitRegister = useCallback(async (e: React.SubmitEvent) => {
        e.preventDefault()

        if (!validate()) {
            return
        }

        await userStore.registerUser(username, email, password)

        if (userStore.isAuth) {
            router.push(routes.profile.mask)
        }
    }, [username, email, password, userStore, validate])

    return (
        <div className={styles.authPage}>
            <form id='auth-form' className={styles.form} onSubmit={submitRegister}>
                <Text tag='h3' view='title' color='primary' className={styles.title}>Authorization</Text>

                <div className={styles.inputContainer}>
                    <label className={styles.label} htmlFor="username">Username</label>
                    <Input
                        placeholder='Your username'
                        style={{ width: '100%' }}
                        id='username'
                        value={username}
                        onChange={(val) => {
                            setUsername(val)
                            if (errors.username) setErrors(prev => ({ ...prev, username: undefined }))
                        }}
                        required />
                    {errors.username && <Text view='p-14' className={styles.fieldError}>{errors.username}</Text>}
                </div>

                <div className={styles.inputContainer}>
                    <label className={styles.label} htmlFor="email">Email</label>
                    <Input
                        placeholder='Your email'
                        style={{ width: '100%' }}
                        id='email'
                        type='email'
                        value={email}
                        onChange={(val) => {
                            setEmail(val)
                            if (errors.email) setErrors(prev => ({ ...prev, email: undefined }))
                        }}
                        required />
                    {errors.email && <Text view='p-14' className={styles.fieldError}>{errors.email}</Text>}
                </div>

                <div className={styles.inputContainer}>
                    <label className={styles.label} htmlFor="password">Password</label>
                    <Input
                        placeholder='Your password'
                        style={{ width: '100%' }}
                        id='password'
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(val) => {
                            setPassword(val)
                            if (errors.password) setErrors(prev => ({ ...prev, password: undefined }))
                        }}
                        required
                        afterSlot={
                            <ButtonEye show={showPassword} setIsShow={setShowPassword}/>
                        } />
                    {errors.password && <Text view='p-14' className={styles.fieldError}>{errors.password}</Text>}
                </div>

                <div className={styles.bottomContainer}>
                    <Link href={routes.login.mask}>
                        <Text className={styles.link}>I have an account</Text>
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

export default Register;