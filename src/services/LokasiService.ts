import ApiService from './ApiService'

// get all lokasi by proyek
export async function apiGetLokasisByProyek<
    T,
    U extends Record<string, unknown>
>(data: U) {
    const res = await ApiService.fetchData<T>({
        url: `/lokasi/project/${data.id}`,
        method: 'get',
        data,
    })
    return res.data
}

// get one lokasi
export async function apiGetLokasi<T, U extends Record<string, unknown>>(
    data: U
) {
    const res = await ApiService.fetchData<T>({
        url: `/lokasi/${data.id}`,
        method: 'get',
        data,
    })

    return res.data
}

// create
export async function apiCreateLokasi<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/lokasi',
        method: 'post',
        data,
    })
}

// edit lokasi
export async function apiEditLokasi<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `/lokasi/${data.id}`,
        method: 'patch',
        data,
    })
}

// delete
export async function apiDeleteLokasi<T, U extends Record<string, unknown>>(
    data: U
) {
    if (Array.isArray(data.id)) {
        // jika ada penghapusan multiple
        return ApiService.fetchData<T>({
            url: '/lokasi/delete',
            method: 'delete',
            data,
        })
    } else {
        // Untuk id tunggal
        return ApiService.fetchData<T>({
            url: `/lokasi/${data.id}`,
            method: 'delete',
        })
    }
}
