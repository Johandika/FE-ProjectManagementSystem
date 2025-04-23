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
