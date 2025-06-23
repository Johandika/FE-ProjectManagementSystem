import ApiService from './ApiService'

// get all tagihan klien
export async function apiGetTagihanKliens<T, U extends Record<string, unknown>>(
    data: U
) {
    console.log('apiGetTagihanKlien', data)

    const res = await ApiService.fetchData<T>({
        url: '/dashboard/tagihanClient',
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

// get one tagihan klien
export async function apiGetTagihanKlien<T, U extends Record<string, unknown>>(
    data: U
) {
    const res = await ApiService.fetchData<T>({
        url: `/dashboard/tagihanClient/${data.id}`,
        method: 'get',
        params: data,
    })

    return res
}

// get all tagihan project
export async function apiGetTagihanProyeks<
    T,
    U extends Record<string, unknown>
>(data: U) {
    const res = await ApiService.fetchData<T>({
        url: '/dashboard/tagihanProjectBelumBayar',
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
