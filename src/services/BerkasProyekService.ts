import ApiService from './ApiService'

// create
export async function apiCreateBerkasProyek<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: '/berkasProject',
        method: 'post',
        data,
    })
}

// get by id
export async function apiGetBerkasProyek<T, U extends Record<string, unknown>>(
    params: U
) {
    return ApiService.fetchData<T>({
        url: '/berkasProyek',
        method: 'get',
        params,
    })
}

// update
export async function apiPutBerkasProyek<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/berkasProyeks/update',
        method: 'put',
        data,
    })
}

// update status
export async function apiUpdateStatusBerkasProyek<
    T,
    U extends Record<string, unknown>
>(data: U) {
    const res = await ApiService.fetchData<T>({
        url: `/berkasProject/status/${data.id}`,
        method: 'patch',
        data,
    })
    return res.data
}

// delete
export async function apiDeleteBerkasProyek<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: `/berkasProject/${data.id}`,
        method: 'delete',
        data,
    })
}

// getAllBerkas By TerminId// get by id
export async function apiGetAllBerkasByTerminId<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: `/berkasProject/termin-project/${data.id}`,
        method: 'get',
        data,
    })
}

// getAllBerkas By TerminId// get by id
export async function apiGetAllBerkasByProyek<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: `/berkasProject/project/${data.id}`,
        method: 'get',
        data,
    })
}

// create berkas multiple
export async function apiCreateBerkasMultiple<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: '/berkasProject/multiple',
        method: 'post',
        data,
    })
}
