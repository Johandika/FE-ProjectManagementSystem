import ApiService from './ApiService'

// get all
export async function apiGetSubkontraktors<
    T,
    U extends Record<string, unknown>
>(data: U) {
    const res = await ApiService.fetchData<T>({
        url: '/subkon',
        method: 'get',
        params: data, //ubah
    })

    return res
}

// delete
export async function apiDeleteSubkontraktors<
    T,
    U extends Record<string, unknown>
>(data: U) {
    if (Array.isArray(data.id)) {
        // jika ada penghapusan multiple
        return ApiService.fetchData<T>({
            url: '/subkon',
            method: 'delete',
            data,
        })
    } else {
        // Untuk id tunggal
        return ApiService.fetchData<T>({
            url: `/subkon/${data.id}`,
            method: 'delete',
        })
    }
}

// get by id
export async function apiGetSubkontraktor<T, U extends Record<string, unknown>>(
    params: U
) {
    const res = await ApiService.fetchData<T>({
        url: `/subkon/${params.id}`,
        method: 'get',
        params,
    })
    return res.data
}

// edit
export async function apiPutSubkontraktor<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `/subkon/${data.id}`,
        method: 'patch',
        data,
    })
}

// create
export async function apiCreateSubkontraktor<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: '/subkon',
        method: 'post',
        data,
    })
}
