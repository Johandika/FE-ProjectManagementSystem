import ApiService from './ApiService'

// get all keterangans
export async function apiGetKeterangans<T, U extends Record<string, unknown>>(
    data: U
) {
    const res = await ApiService.fetchData<T>({
        url: `/keteranganProject/project/${data.id}`,
        method: 'get',
        data,
    })

    return res
}

// get by id
export async function apiGetKeterangan<T, U extends Record<string, unknown>>(
    data: U
) {
    const res = await ApiService.fetchData<T>({
        url: `/keteranganProject/${data.id}`,
        method: 'get',
        data,
    })
    return res
}

// create
export async function apiCreateKeterangan<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/keteranganProject',
        method: 'post',
        data,
    })
}

// update
export async function apiPutKeterangan<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `/keteranganProject/${data.id}`,
        method: 'patch',
        data,
    })
}

// delete
export async function apiDeleteKeterangan<T, U extends Record<string, unknown>>(
    data: U
) {
    // Untuk id tunggal
    return ApiService.fetchData<T>({
        url: `/keteranganProject/${data.id}`,
        method: 'delete',
    })
}
