import ApiService from './ApiService'

// get all
export async function apiGetSubkontraktors<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: '/master/subkontraktors',
        method: 'post',
        data,
    })
}

// delete
export async function apiDeleteSubkontraktors<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: '/master/subkontraktors/delete',
        method: 'delete',
        data,
    })
}

// get by id
export async function apiGetSubkontraktor<T, U extends Record<string, unknown>>(
    params: U
) {
    return ApiService.fetchData<T>({
        url: '/master/subkontraktor',
        method: 'get',
        params,
    })
}

// edit
export async function apiPutSubkontraktor<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/master/subkontraktors/update',
        method: 'put',
        data,
    })
}

// create
export async function apiCreateSubkontraktor<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: '/master/subkontraktors/create',
        method: 'post',
        data,
    })
}
