import ApiService from './ApiService'

// get all
export async function apiGetKliens<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/master/kliens',
        method: 'post',
        data,
    })
}

// delete
export async function apiDeleteKliens<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/master/kliens/delete',
        method: 'delete',
        data,
    })
}

// get by id
export async function apiGetKlien<T, U extends Record<string, unknown>>(
    params: U
) {
    return ApiService.fetchData<T>({
        url: '/master/klien',
        method: 'get',
        params,
    })
}

// edit
export async function apiPutKlien<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/master/kliens/update',
        method: 'put',
        data,
    })
}

// create
export async function apiCreateKlien<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/master/kliens/create',
        method: 'post',
        data,
    })
}
