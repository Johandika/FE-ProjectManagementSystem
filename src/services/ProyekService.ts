import ApiService from './ApiService'

// get all proyeks
// export async function apiGetProyeks<T, U extends Record<string, unknown>>(
//     data: U
// ) {
//     return ApiService.fetchData<T>({
//         url: `/project`,
//         method: 'get',
//         data,
//     })
// }
export interface GetProyeksRequest {
    page?: number
    limit?: number
    query?: string
    sort?: {
        key?: string
        order?: string
    }
    filterData?: {
        name?: string
        category?: string[]
        status?: number[]
        proyekStatus?: number
    }
}

export async function apiGetProyeks<T, U extends GetProyeksRequest>(data: U) {
    // Membangun query string parameters
    const params = new URLSearchParams()

    // Menangani pagination
    if (data.page) params.append('page', data.page.toString())
    if (data.limit) params.append('limit', data.limit.toString())

    // Menangani pencarian
    if (data.query && data.query.trim() !== '')
        params.append('search', data.query)

    // Menangani pengurutan
    if (data.sort?.key && data.sort.order) {
        params.append('sortBy', data.sort.key)
        params.append('sortOrder', data.sort.order)
    }

    // // Menangani filter jika diperlukan
    // if (data.filterData?.proyekStatus)
    //     params.append('status', data.filterData.proyekStatus.toString())

    // // Jika ada filter tambahan yang perlu diterapkan
    // if (data.filterData?.name) params.append('name', data.filterData.name)

    // URL dengan query parameters
    const url = `/project${params.toString() ? `?${params.toString()}` : ''}`
    console.log('url', url)
    return ApiService.fetchData<T>({
        url,
        method: 'get',
    })
}

//get all kliens
export async function apiGetKliens<T, U extends Record<string, unknown>>(
    data: U
) {
    const res = await ApiService.fetchData<T>({
        url: '/client',
        method: 'get',
        params: data, //ubah
    })

    return res
}

//get all berkases
export async function apiGetBerkases<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/berkas',
        method: 'get',
        data,
    })
}

//get all berkases
export async function apiGetSubkontraktors<
    T,
    U extends Record<string, unknown>
>(data: U) {
    const res = await ApiService.fetchData<T>({
        url: '/subkon',
        method: 'get',
        params: data,
    })

    return res
}

// delete
export async function apiDeleteProyeks<T, U extends Record<string, unknown>>(
    data: U
) {
    if (Array.isArray(data.id)) {
        // jika ada penghapusan multiple
        return ApiService.fetchData<T>({
            url: '/project/delete',
            method: 'patch',
            data,
        })
    } else {
        // Untuk id tunggal
        return ApiService.fetchData<T>({
            url: `/project/softDeleted/${data.id}`,
            method: 'patch',
        })
    }
}

// get by id
export async function apiGetProyek<T, U extends Record<string, unknown>>(
    params: U
) {
    const res = await ApiService.fetchData<T>({
        url: `/project/${params.id}`,
        method: 'get',
        params,
    })
    return res.data
}

// edit
export async function apiPutProyek<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `/project/${data.id}`,
        method: 'patch',
        data,
    })
}

// create
export async function apiCreateProyek<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/project',
        method: 'post',
        data,
    })
}

// update status retensi
export async function apiUpdateStatusRetensi<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: `/project/status-retensi/${data.id}`,
        method: 'patch',
        data,
    })
}
