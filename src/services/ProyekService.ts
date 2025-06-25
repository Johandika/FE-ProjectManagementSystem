import ApiService from './ApiService'

export interface GetProyeksRequest {
    page?: number
    limit?: number
    query?: string
    filterData?: {
        order: string
        progress: number
        idClient: string
        idDivisi: string
    }
}

export async function apiGetProyeks<T, U extends GetProyeksRequest>(data: U) {
    // Membangun query string parameters
    const params = new URLSearchParams()

    // Menangani pagination
    if (data.page) params.append('page', data.page.toString())
    if (data.limit) params.append('limit', data.limit.toString())
    if (data.filterData?.idDivisi)
        params.append('idDivisi', data.filterData?.idDivisi?.toString())

    // Menangani pencarian
    if (data.query && data.query.trim() !== '')
        params.append('search', data.query)

    // Menangani pengurutan
    if (data.filterData?.order)
        params.append('order', data.filterData.order.toString())

    // Menangani progress
    if (data.filterData?.progress)
        params.append('progress', data.filterData.progress.toString())

    // Menangani idClient
    if (data.filterData?.idClient)
        params.append('idClient', data.filterData.idClient.toString())

    // URL dengan query parameters
    const url = `/project${params.toString() ? `?${params.toString()}` : ''}`

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

// update status diproses proyek
export async function apiUpdateStatusDiprosesProyek<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: `/project/status-diproses/${data.id}`,
        method: 'patch',
        data,
    })
}

// update status selesai proyek
export async function apiUpdateStatusSelesaiProyek<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: `/project/status-selesai/${data.id}`,
        method: 'patch',
        data,
    })
}
