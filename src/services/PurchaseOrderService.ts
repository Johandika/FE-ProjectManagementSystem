import ApiService from './ApiService'

// get all
export async function apiGetPurchaseOrders<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: '/purchase-order',
        method: 'post',
        data,
    })
}

// delete
export async function apiDeletePurchaseOrders<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: '/purchase-order/delete',
        method: 'delete',
        data,
    })
}

// get by id
export async function apiGetPurchaseOrder<T, U extends Record<string, unknown>>(
    params: U
) {
    return ApiService.fetchData<T>({
        url: '/purchase-order',
        method: 'get',
        params,
    })
}

// edit
export async function apiPutPurchaseOrder<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/purchase-order/update',
        method: 'put',
        data,
    })
}

// create
export async function apiCreatePurchaseOrder<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: '/purchase-order/create',
        method: 'post',
        data,
    })
}
