import ApiService from './ApiService'

// get all
export async function apiGetPurchaseOrders<
    T,
    U extends Record<string, unknown>
>(data: U) {
    const res = await ApiService.fetchData<T>({
        url: '/purchase',
        method: 'get',
        params: data, //ubah
    })

    return res
}

// delete
export async function apiDeletePurchaseOrders<
    T,
    U extends Record<string, unknown>
>(data: U) {
    if (Array.isArray(data.id)) {
        // jika ada penghapusan multiple
        return ApiService.fetchData<T>({
            url: '/purchase/delete',
            method: 'delete',
            data,
        })
    } else {
        // Untuk id tunggal
        return ApiService.fetchData<T>({
            url: `/purchase/${data.id}`,
            method: 'delete',
        })
    }
}

// get by id
export async function apiGetPurchaseOrder<T, U extends Record<string, unknown>>(
    params: U
) {
    const res = await ApiService.fetchData<T>({
        url: `/purchase/${params.id}`,
        method: 'get',
        params,
    })
    return res.data
}

// get by id
export async function apiGetPurchaseByProyek<
    T,
    U extends Record<string, unknown>
>(data: U) {
    const res = await ApiService.fetchData<T>({
        url: `/purchase/project/${data.id}`,
        method: 'get',
        data,
    })

    return res.data
}

// edit
export async function apiPutPurchaseOrder<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `/purchase/${data.id}`,
        method: 'patch',
        data,
    })
}

// update status lunas
export async function apiUpdateStatusLunasPurchase<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: `/purchase/status-lunas/${data.id}`,
        method: 'patch',
        data,
    })
}

// update status kirim
export async function apiUpdateStatusKirimPurchase<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: `/purchase/status-kirim/${data.id}`,
        method: 'patch',
        data,
    })
}

// update status sampai
export async function apiUpdateStatusSampaiPurchase<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: `/purchase/status-sampai/${data.id}`,
        method: 'patch',
        data,
    })
}

// create
export async function apiCreatePurchaseOrder<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: '/purchase',
        method: 'post',
        data,
    })
}

// ===========================================

// create detail purchase
export async function apiCreateDetailPurchase<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: '/purchase/detail',
        method: 'post',
        data,
    })
}

// create detail purchase
export async function apiUpdateDetailPurchase<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: `/purchase/detail/${data.id}`,
        method: 'patch',
        data,
    })
}

// delete
export async function apiDeleteDetailPurchaseOrder<
    T,
    U extends Record<string, unknown>
>(data: U) {
    // Untuk id tunggal
    return ApiService.fetchData<T>({
        url: `/purchase/detail/${data.id}`,
        method: 'delete',
    })
}
