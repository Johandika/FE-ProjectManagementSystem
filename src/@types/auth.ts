export type SignInCredential = {
    userName: string
    password: string
}

export type SignInResponse = {
    statusCode: number
    message: string
    role: string
    username: string
    email: string
    authorization: string
}

export type SignUpResponse = SignInResponse

export type SignUpCredential = {
    userName: string
    email: string
    password: string
}

export type ForgotPassword = {
    email: string
}

export type Register = {
    nama: string
    email: string
    password: string
    nomor_telepon: string
    idRole: string
}
