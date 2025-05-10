import ApiService from './ApiService'

// get all bastp
export async function apiGetBastps<T, U extends Record<string, unknown>>(
    data: U
) {
    const res = await ApiService.fetchData<T>({
        url: `/bastp/project/${data.id}`,
        method: 'get',
        data,
    })

    return res
}

// delete bastp
export async function apiDeleteBastp<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `/bastp/${data.id}`,
        method: 'delete',
    })
}

// get by id
export async function apiGetBastp<T, U extends Record<string, unknown>>(
    data: U
) {
    const res = await ApiService.fetchData<T>({
        url: `/bastp/${data.id}`,
        method: 'get',
        data,
    })
    return res.data
}

// edit bastp
export async function apiPutBastp<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `/bastp/${data.id}`,
        method: 'patch',
        data,
    })
}

// create bastp
export async function apiCreateBastp<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/bastp',
        method: 'post',
        data,
    })
}
