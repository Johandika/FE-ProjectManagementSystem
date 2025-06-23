import ApiService from './ApiService'

export async function apiSelectClient<T, U extends Record<string, unknown>>() {
    const res = await ApiService.fetchData<T>({
        url: '/select/client',
        method: 'get',
    })

    return res
}

export async function apiSelectDivisi<T, U extends Record<string, unknown>>() {
    const res = await ApiService.fetchData<T>({
        url: '/select/divisi',
        method: 'get',
    })

    return res
}
