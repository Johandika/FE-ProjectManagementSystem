import ApiService from './ApiService'
import type {
    SignInCredential,
    SignUpCredential,
    ForgotPassword,
    ResetPassword,
    SignInResponse,
    SignUpResponse,
} from '@/@types/auth'
import { apiCreateRole, apiGetRoles } from './RoleService'

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

export async function apiSignOut() {
    return ApiService.fetchData({
        url: '/sign-out',
        method: 'post',
    })
}

export async function apiForgotPassword(data: ForgotPassword) {
    return ApiService.fetchData({
        url: '/forgot-password',
        method: 'post',
        data,
    })
}

export async function apiRegister(data) {
    console.log('data', data)
    await apiCreateRole({
        nama: 'Suped_Admin',
        keterangan: '-',
    })

    const roles = await apiGetRoles()
    const idRole = roles?.data.data[0].id
    const proceedData = {
        ...data,
        idRole,
    }
    console.log('proceedData', proceedData)

    const res = await ApiService.fetchData({
        url: '/user/register',
        method: 'post',
        data: proceedData,
    })

    console.log('res', res)

    return res
}

export async function apiResetPassword(data: ResetPassword) {
    return ApiService.fetchData({
        url: '/reset-password',
        method: 'post',
        data,
    })
}
