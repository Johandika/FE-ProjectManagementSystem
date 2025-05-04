import ApiService from './ApiService'

// get all items by proyek
export async function apiGetItemsByProyek<T, U extends Record<string, unknown>>(
    data: U
) {
    const res = await ApiService.fetchData<T>({
        url: `/itemProject/project/${data.id}`,
        method: 'get',
        data,
    })
    return res.data
}

// get one item
export async function apiGetItem<T, U extends Record<string, unknown>>(
    data: U
) {
    const res = await ApiService.fetchData<T>({
        url: `/itemProject/${data.id}`,
        method: 'get',
        data,
    })

    return res.data
}

// create item
export async function apiCreateItem<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/itemProject',
        method: 'post',
        data,
    })
}

// udpate item
export async function apiEditItem<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `/itemProject/${data.id}`,
        method: 'patch',
        data,
    })
}

// udpate  status item proyek
export async function apiUpdateStatusItemProyek<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: `/itemProject/status/${data.id}`,
        method: 'patch',
        data,
    })
}

// delete
export async function apiDeleteItem<T, U extends Record<string, unknown>>(
    data: U
) {
    if (Array.isArray(data.id)) {
        // jika ada penghapusan multiple
        return ApiService.fetchData<T>({
            url: '/itemProject/delete',
            method: 'delete',
            data,
        })
    } else {
        // Untuk id tunggal
        return ApiService.fetchData<T>({
            url: `/itemProject/${data.id}`,
            method: 'delete',
        })
    }
}

//  ============================== DETAIL ITEM ================================

// create detail item
export async function apiCreateDetailItem<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/itemProject/detail',
        method: 'post',
        data,
    })
}

// create detail item
export async function apiUpdateDetailItem<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `/itemProject/detail/${data.id}`,
        method: 'patch',
        data,
    })
}

// delete detail item
export async function apiDeleteDetailItem<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `/itemProject/detail/${data.id}`,
        method: 'delete',
    })
}
