import { BASE_URL } from "@shared/consts"
import axios from "axios"
import { action, computed, makeObservable, observable, runInAction } from "mobx"
import { LocalStorageItem } from "@shared/types/shared"
import type { IUser } from "@shared/store/models/user"

type PrivateFields = '_isInit' | '_error' | '_isLoading' | '_user'

export default class UserStore {
    private _error: string = ''
    private _isLoading: boolean = false
    private _isInit: boolean = false
    private _user: IUser | null = null

    constructor() {
        makeObservable<UserStore, PrivateFields>(this, {
            _error: observable,
            _isLoading: observable,
            _isInit: observable,
            _user: observable,

            checkAuth: action,
            loginUser: action,
            registerUser: action,
            logoutUser: action,

            isAuth: computed,
            error: computed,
            isLoading: computed,
            isInit: computed,
            user: computed
        })
    }

    get isAuth(): boolean {
        return Boolean(this._user)
    }

    get error(): string {
        return this._error
    }

    get isLoading(): boolean {
        return this._isLoading
    }

    get isInit(): boolean {
        return this._isInit
    }

    get user(): IUser | null {
        return this._user
    }

    async checkAuth() {
        const token = localStorage.getItem(LocalStorageItem.JWT)

        if (!token) {
            runInAction(() => {
                this._isInit = true
                this._user = null
            })
            return
        }

        try {
            const response = await axios.get<IUser>(`${BASE_URL}/users/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            runInAction(() => {
                this._user = response.data
            })
        } catch (error) {
            console.error(error)
            this.logoutUser()
        } finally {
            runInAction(() => {
                this._isInit = true
            })
        }
    }

    async loginUser(identifier: string, password: string) {
        this._error = ''
        this._isLoading = true

        try {
            const response = await axios.post(`${BASE_URL}/auth/local`, {
                identifier: identifier,
                password: password
            })

            runInAction(() => {
                this._user = response.data.user
                localStorage.setItem(LocalStorageItem.JWT, response.data.jwt)
                this._isLoading = false
            })
        } catch (error) {
            runInAction(() => {
                if (axios.isAxiosError(error)) {
                    if (error.response) {
                        this._error = error.response.data?.error?.message || 'Login failed'
                    } else {
                        this._error = 'Network error. Please try again later'
                    }
                } else {
                    this._error = 'An unexpected error occurred'
                }
                this._isLoading = false
            })
        }
    }

    async registerUser(username: string, email: string, password: string) {
        this._error = ''
        this._isLoading = true

        try {
            const response = await axios.post(`${BASE_URL}/auth/local/register`, {
                username: username,
                email: email,
                password: password
            })

            runInAction(() => {
                this._user = response.data.user
                localStorage.setItem(LocalStorageItem.JWT, response.data.jwt)
                this._isLoading = false
            })
        } catch (error) {
            runInAction(() => {
                if (axios.isAxiosError(error)) {
                    if (error.response) {
                        this._error = error.response.data?.error?.message || 'Registration failed';
                    } else {
                        this._error = 'Network error';
                    }
                }
                this._isLoading = false
            })
        }
    }

    logoutUser() {
        localStorage.removeItem(LocalStorageItem.JWT)
        this._user = null
    }
}