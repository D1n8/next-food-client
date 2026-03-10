export interface IUser {
    id: number,
    documentId: string,
    username: string,
    email: string
}

export interface IAuthResponse {
    jwt: string,
    user: IUser
}