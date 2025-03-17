import ApiService from './ApiService'

// get all
export async function apiGetProyeks<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/manajemen-proyek',
        method: 'post',
        data,
    })
}

// delete
export async function apiDeleteProyeks<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/manajemen-proyek/delete',
        method: 'delete',
        data,
    })
}

// get by id
export async function apiGetProyek<T, U extends Record<string, unknown>>(
    params: U
) {
    return ApiService.fetchData<T>({
        url: '/manajemen-proyek',
        method: 'get',
        params,
    })
}

// edit
export async function apiPutProyek<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/manajemen-proyek/update',
        method: 'put',
        data,
    })
}

// create
export async function apiCreateProyek<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/manajemen-proyek/create',
        method: 'post',
        data,
    })
}
