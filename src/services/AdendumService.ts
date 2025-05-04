import ApiService from './ApiService'

// get all adendum by project
export async function apiGetAdendumsByProyek<
    T,
    U extends Record<string, unknown>
>(data: U) {
    const res = await ApiService.fetchData<T>({
        url: `/adendum/project/${data.id}`,
        method: 'get',
        data,
    })

    return res.data
}

// get one adendum
export async function apiGetAdendum<T, U extends Record<string, unknown>>(
    data: U
) {
    const res = await ApiService.fetchData<T>({
        url: `/adendum/${data.id}`,
        method: 'get',
        data,
    })

    return res.data
}

// create adendum
export async function apiCreateAdendum<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/adendum',
        method: 'post',
        data,
    })
}

// edit adendum
export async function apiEditAdendum<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `/adendum/${data.id}`,
        method: 'patch',
        data,
    })
}

// update status adendum
export async function apiUpdateStatusAdendum<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: `/adendum/status/${data.id}`,
        method: 'patch',
        data,
    })
}

// delete adendum
export async function apiDeleteAdendum<T, U extends Record<string, unknown>>(
    data: U
) {
    if (Array.isArray(data.id)) {
        // jika ada penghapusan multiple
        return ApiService.fetchData<T>({
            url: '/adendum/delete',
            method: 'delete',
            data,
        })
    } else {
        // Untuk id tunggal
        return ApiService.fetchData<T>({
            url: `/adendum/${data.id}`,
            method: 'delete',
        })
    }
}
