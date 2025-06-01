import ApiService from './ApiService'
import type {
    SignInCredential,
    SignUpCredential,
    ForgotPassword,
    ResetPassword,
    SignInResponse,
    SignUpResponse,
    Register,
} from '@/@types/auth'

export async function apiSignIn(data: SignInCredential) {
    return ApiService.fetchData<SignInResponse>({
        url: '/user/login',
        method: 'post',
        data,
    })
}

export async function apiSignUp(data: SignUpCredential) {
    return ApiService.fetchData<SignUpResponse>({
        url: '/sign-up',
        method: 'post',
        data,
    })
}

export async function apiSignOut(data: { authorization: string }) {
    const res = ApiService.fetchData({
        url: '/user/logout',
        method: 'post',
        data,
    })

    return res
}

export async function apiForgotPassword(data: ForgotPassword) {
    return ApiService.fetchData({
        url: '/forgot-password',
        method: 'post',
        data,
    })
}

export async function apiRegister(data: Register) {
    const res = await ApiService.fetchData({
        url: '/user/register',
        method: 'post',
        data,
    })

    return res
}

export async function apiResetPassword(data: { id: string }) {
    console.log('dataiii', data.id)
    return ApiService.fetchData({
        url: `/user/reset-password/${data.id}`,
        method: 'patch',
        data,
    })
}
