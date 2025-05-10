import ApiService from './ApiService'

// get all satuan
export async function apiGetSatuans<T, U extends Record<string, unknown>>(
    data: U
) {
    const res = ApiService.fetchData<T>({
        url: '/satuan',
        method: 'get',
        data,
    })
    return res
}

// delete
export async function apiDeleteSatuans<T, U extends Record<string, unknown>>(
    data: U
) {
    // Untuk id tunggal
    return ApiService.fetchData<T>({
        url: `/satuan/${data.id}`,
        method: 'delete',
    })
}

// get satuan by id
export async function apiGetSatuan<T, U extends Record<string, unknown>>(
    params: U
) {
    const res = await ApiService.fetchData<T>({
        url: `/satuan/${params.id}`,
        method: 'get',
        params,
    })
    return res.data
}

// update satuan
export async function apiPutSatuan<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `/satuan/${data.id}`,
        method: 'patch',
        data,
    })
}

// create satuan
export async function apiCreateSatuan<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/satuan',
        method: 'post',
        data,
    })
}
