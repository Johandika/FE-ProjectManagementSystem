import ApiService from './ApiService'

// get all
export async function apiGetBerkases<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/berkas',
        method: 'get',
        data,
    })
}

// delete
export async function apiDeleteBerkases<T, U extends Record<string, unknown>>(
    data: U
) {
    if (Array.isArray(data.id)) {
        // jika ada penghapusan multiple
        return ApiService.fetchData<T>({
            url: '/berkas',
            method: 'delete',
            data,
        })
    } else {
        // Untuk id tunggal
        return ApiService.fetchData<T>({
            url: `/berkas/softDeleted/${data.id}`,
            method: 'delete',
        })
    }
}

// get by id
export async function apiGetBerkas<T, U extends Record<string, unknown>>(
    params: U
) {
    const res = await ApiService.fetchData<T>({
        url: `/berkas/${params.id}`,
        method: 'get',
        params,
    })
    return res.data
}

// edit
export async function apiPutBerkas<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `/berkas/${data.id}`,
        method: 'patch',
        data,
    })
}

// create
export async function apiCreateBerkas<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/berkas',
        method: 'post',
        data,
    })
}
