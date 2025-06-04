import ApiService from './ApiService'

// get all user
export async function apiGetUsers() {
    const res = await ApiService.fetchData({
        url: '/user',
        method: 'get',
    })

    return res
}

// get one user
export async function apiGetOneUser<T, U extends Record<string, unknown>>(
    data: U
) {
    const res = await ApiService.fetchData<T>({
        url: `/user/${data.id}`,
        method: 'get',
        data,
    })

    return res.data
}

// get profile
export async function apiGetProfile<T, U extends Record<string, unknown>>(
    data: U
) {
    const res = await ApiService.fetchData<T>({
        url: `/user/profile`,
        method: 'get',
        data,
    })
    return res.data
}

// update user
export async function apiUpdateUser<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `/user/${data.id}`,
        method: 'patch',
        data,
    })
}

// update password
export async function apiUpdatePassword<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `/user/password/${data.id}`,
        method: 'patch',
        data,
    })
}

// delete user
export async function apiDeleteUser<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `/user/softDeleted/${data.id}`,
        method: 'patch',
        data,
    })
}
