import ApiService from './ApiService'

// get all
export async function apiGetSubkontraktors<
    T,
    U extends Record<string, unknown>
>(data: U) {
    const res = await ApiService.fetchData<T>({
        url: '/subkon',
        method: 'get',
        params: data
            ? {
                  page: data.pageIndex,
                  limit: data.pageSize,
                  search: data.query,
              }
            : undefined,
    })

    return res
}

// delete
export async function apiDeleteSubkontraktors<
    T,
    U extends Record<string, unknown>
>(data: U) {
    if (Array.isArray(data.id)) {
        // jika ada penghapusan multiple
        return ApiService.fetchData<T>({
            url: '/subkon',
            method: 'delete',
            data,
        })
    } else {
        // Untuk id tunggal
        return ApiService.fetchData<T>({
            url: `/subkon/${data.id}`,
            method: 'delete',
        })
    }
}

// get by id
export async function apiGetSubkontraktor<T, U extends Record<string, unknown>>(
    params: U
) {
    const res = await ApiService.fetchData<T>({
        url: `/subkon/${params.id}`,
        method: 'get',
        params,
    })
    return res.data
}

// edit
export async function apiPutSubkontraktor<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `/subkon/${data.id}`,
        method: 'patch',
        data,
    })
}

// create
export async function apiCreateSubkontraktor<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: '/subkon',
        method: 'post',
        data,
    })
}

// =====================================================

// get all subkon by project
export async function apiGetSubkontraktorsByProject<
    T,
    U extends Record<string, unknown>
>(data: U) {
    const res = await ApiService.fetchData<T>({
        url: `/subkonProject/project/${data.id}`,
        method: 'get',
        params: data,
    })

    return res
}

// get one subkon proyek
export async function apiGetSubkontraktorByProject<
    T,
    U extends Record<string, unknown>
>(data: U) {
    const res = await ApiService.fetchData<T>({
        url: `/subkonProject/${data.id}`,
        method: 'get',
        params: data,
    })

    return res
}

// get one subkon proyek
export async function apiCreateSubkontraktorProject<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: '/subkonProject',
        method: 'post',
        data,
    })
}

// update subkon proyek
export async function apiUpdateSubkontraktorProject<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: `/subkonProject/${data.id}`,
        method: 'patch',
        data,
    })
}

// update subkon proyek
export async function apiDeleteSubkontraktorsProject<
    T,
    U extends Record<string, unknown>
>(data: U) {
    if (Array.isArray(data.id)) {
        // jika ada penghapusan multiple
        return ApiService.fetchData<T>({
            url: '/subkonProject',
            method: 'delete',
            data,
        })
    } else {
        // Untuk id tunggal
        return ApiService.fetchData<T>({
            url: `/subkonProject/${data.id}`,
            method: 'delete',
        })
    }
}
