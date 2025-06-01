import ApiService from './ApiService'

// get all
export async function apiGetRoles<T, U extends Record<string, unknown>>() {
    const res = await ApiService.fetchData<T>({
        url: '/role',
        method: 'get',
    })

    return res
}

// select roles
export async function apiSelectRoles<T, U extends Record<string, unknown>>() {
    const res = await ApiService.fetchData<T>({
        url: '/select/role',
        method: 'get',
    })

    return res
}

// get one role by id
export async function apiGetRole<T, U extends Record<string, unknown>>(
    data: U
) {
    const res = await ApiService.fetchData<T>({
        url: `/role/${data.id}`,
        method: 'get',
        data,
    })
    return res.data
}

// create
export async function apiCreateRole<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/role',
        method: 'post',
        data,
    })
}
