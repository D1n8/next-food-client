'use client'
import styles from '../Auth.module.scss'
import Text from '@components/Text';
import Input from '@components/Input';
import { useCallback, useState, useEffect } from 'react';
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
    const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({})
    const { userStore } = useRootStore()
    const router = useRouter()

    useEffect(() => {
        userStore.clearError()
    }, [userStore])

    const validate = useCallback(() => {
        const newErrors: { identifier?: string; password?: string } = {}

        if (identifier.length > 20) {
            newErrors.identifier = 'Maximum 20 characters allowed'
        }

        if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }, [identifier, password])

    const submitLogin = useCallback(async (e: React.SubmitEvent) => {
        e.preventDefault()

        if (!validate()) {
            return
        }

        await userStore.loginUser(identifier, password)

        if (userStore.isAuth) {
            router.push(routes.profile.mask)
        }
    }, [identifier, password, userStore, validate])

    return (
        <div className={styles.authPage}>
            <form id='login-form' className={styles.form} onSubmit={submitLogin}>
                <Text tag='h3' view='title' color='primary' className={styles.title}>Login</Text>

                <div className={styles.inputContainer}>
                    <label className={styles.label} htmlFor="identifier">Email or Username</label>
                    <Input
                        id='identifier'
                        style={{ width: '100%' }}
                        value={identifier}
                        onChange={(val) => {
                            setIdentifier(val)
                            if (errors.identifier) setErrors(prev => ({ ...prev, identifier: undefined }))
                        }}
                        placeholder='Your identifier'
                        required />
                    {errors.identifier && <Text view='p-14' className={styles.fieldError}>{errors.identifier}</Text>}
                </div>

                <div className={styles.inputContainer}>
                    <label className={styles.label} htmlFor="loginPassword">Password</label>
                    <Input
                        id='loginPassword'
                        style={{ width: '100%' }}
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(val) => {
                            setPassword(val)
                            if (errors.password) setErrors(prev => ({ ...prev, password: undefined }))
                        }}
                        placeholder='Your password'
                        required
                        afterSlot={
                           <ButtonEye show={showPassword} setIsShow={setShowPassword}/>
                        } />
                    {errors.password && <Text view='p-14' className={styles.fieldError}>{errors.password}</Text>}
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