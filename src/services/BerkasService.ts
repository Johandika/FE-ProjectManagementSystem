import ApiService from './ApiService'

// get all
export async function apiGetBerkases<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/master/berkases',
        method: 'post',
        data,
    })
}

// delete
export async function apiDeleteBerkases<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/master/berkases/delete',
        method: 'delete',
        data,
    })
}

// get by id
export async function apiGetBerkas<T, U extends Record<string, unknown>>(
    params: U
) {
    return ApiService.fetchData<T>({
        url: '/master/berkas',
        method: 'get',
        params,
    })
}

// edit
export async function apiPutBerkas<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/master/berkases/update',
        method: 'put',
        data,
    })
}

// create
export async function apiCreateBerkas<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/master/berkases/create',
        method: 'post',
        data,
    })
}
