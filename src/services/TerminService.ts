import ApiService from './ApiService'

// create
export async function apiCreateTermin<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/terminProject',
        method: 'post',
        data,
    })
}

// get by id
export async function apiGetOneTermin<T, U extends Record<string, unknown>>(
    params: U
) {
    return ApiService.fetchData<T>({
        url: `/termin/${params.id}`,
        method: 'get',
        params,
    })
}

// get termin by project
export async function apiGetTermin<T, U extends Record<string, unknown>>(
    params: U
) {
    const res = await ApiService.fetchData<T>({
        url: `/terminProject/project/${params.id}`,
        method: 'get',
        params,
    })
    return res.data
}

// update
export async function apiEditTermin<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `/terminProject/${data.id}`,
        method: 'patch',
        data,
    })
}

// delete
export async function apiDeleteTermin<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `/terminProject/${data.id}`,
        method: 'delete',
        data,
    })
}
