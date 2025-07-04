import { extractNumberFromString } from '@/utils/extractNumberFromString'
import ApiService from './ApiService'

// get all
export async function apiGetTenders<T, U extends Record<string, unknown>>(
    data: U
) {
    const res = await ApiService.fetchData<T>({
        url: '/tender',
        method: 'get',
        params: {
            limit: data.limit,
            page: data.page,
            status: data?.filterData?.status || null,
            idDivisi: data?.filterData?.idDivisi || null,
            search: data.query || null,
        },
    })

    return res
}

// delete
export async function apiDeleteTender<T, U extends Record<string, unknown>>(
    data: U
) {
    // Untuk id tunggal
    return ApiService.fetchData<T>({
        url: `/tender/${data.id}`,
        method: 'delete',
    })
}

// get by id
export async function apiGetTender<T, U extends Record<string, unknown>>(
    params: U
) {
    const res = await ApiService.fetchData<T>({
        url: `/tender/${params.id}`,
        method: 'get',
        params,
    })
    return res.data
}

// edit
export async function apiPutTender<T, U extends Record<string, unknown>>(
    data: U
) {
    const processedData = {
        ...data,
        nilai_kontrak: extractNumberFromString(
            data.nilai_kontrak as string | number
        ),
    }

    return ApiService.fetchData<T>({
        url: `/tender/${data.id}`,
        method: 'patch',
        data: processedData,
    })
}

// update status tender
export async function apiUpdateStatusPrioritasTender<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: `/tender/prioritas/${data.id}`,
        method: 'patch',
        data,
    })
}

// update status tender
export async function apiUpdateStatusTender<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: `/tender/status/${data.id}`,
        method: 'patch',
        data,
    })
}

// update status tender
export async function apiUpdateProgressTender<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: `/tender/progress/${data.id}`,
        method: 'patch',
        data,
    })
}

// create
export async function apiCreateTender<T, U extends Record<string, unknown>>(
    data: U
) {
    const processedData = {
        ...data,
        nilai_kontrak: extractNumberFromString(
            data.nilai_kontrak as string | number
        ),
    }

    const res = ApiService.fetchData<T>({
        url: '/tender',
        method: 'post',
        data: processedData,
    })

    return res
}

// =================== KETERANGAN TENDER =======================

// GetAll
export async function apiGetAllKeteranganTender<
    T,
    U extends Record<string, unknown>
>(data: U) {
    const res = await ApiService.fetchData<T>({
        url: `/keteranganTender/tender/${data.id}`,
        method: 'get',
        data,
    })

    return res
}

// Get By Id
export async function apiGetOneKeteranganTender<
    T,
    U extends Record<string, unknown>
>(data: U) {
    const res = await ApiService.fetchData<T>({
        url: `/keteranganTender/${data.id}`,
        method: 'get',
        data,
    })
    return res.data
}

// CREATE
export async function apiCreateKeteranganTender<
    T,
    U extends Record<string, unknown>
>(data: U) {
    const res = ApiService.fetchData<T>({
        url: '/keteranganTender',
        method: 'post',
        data: data,
    })

    return res
}

// UPDATE
export async function apiUpdateKeteranganTender<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: `/keteranganTender/${data.id}`,
        method: 'patch',
        data,
    })
}

// DELETE
export async function apiDeleteKeteranganTender<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: `/keteranganTender/${data.id}`,
        method: 'delete',
    })
}
