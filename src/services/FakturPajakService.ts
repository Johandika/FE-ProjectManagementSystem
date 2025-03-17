import ApiService from './ApiService'

// get all
export async function apiGetFakturPajaks<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/faktur-pajak',
        method: 'post',
        data,
    })
}

// delete
export async function apiDeleteFakturPajaks<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: '/faktur-pajak/delete',
        method: 'delete',
        data,
    })
}

// get by id
export async function apiGetFakturPajak<T, U extends Record<string, unknown>>(
    params: U
) {
    return ApiService.fetchData<T>({
        url: '/faktur-pajak',
        method: 'get',
        params,
    })
}

// edit
export async function apiPutFakturPajak<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/faktur-pajak/update',
        method: 'put',
        data,
    })
}

// create
export async function apiCreateFakturPajak<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: '/faktur-pajak/create',
        method: 'post',
        data,
    })
}
