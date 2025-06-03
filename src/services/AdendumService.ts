import ApiService from './ApiService'

// get all adendum
export async function apiGetAdendums<T, U extends Record<string, unknown>>(
    data: U
) {
    const params = new URLSearchParams()

    if (data.idProject) params.append('idProject', data.idProject.toString())
    if (data.page) params.append('page', data.page.toString())
    if (data.limit) params.append('limit', data.limit.toString())

    const url = `/adendum${params.toString() ? `?${params.toString()}` : ''}`

    return ApiService.fetchData<T>({
        url,
        method: 'get',
    })
}

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

// create adendum timeline
export async function apiCreateAdendumTimeline<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: '/adendum/timeline',
        method: 'post',
        data,
    })
}

// create adendum lokasi
export async function apiCreateAdendumLokasi<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: '/adendum/lokasi',
        method: 'post',
        data,
    })
}

// create adendum nilai kontrak
export async function apiCreateAdendumNilaiKontrak<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: '/adendum/nilai-kontrak',
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
