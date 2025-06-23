import ApiService from './ApiService'

// get all divisi
export async function apiGetDivisis<T, U extends Record<string, unknown>>(
    data: U
) {
    const res = await ApiService.fetchData<T>({
        url: '/divisi',
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

// get by id
export async function apiGetDivisi<T, U extends Record<string, unknown>>(
    data: U
) {
    const res = await ApiService.fetchData<T>({
        url: `/divisi/${data.id}`,
        method: 'get',
        data,
    })
    return res.data
}

// create
export async function apiCreateDivisi<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/divisi',
        method: 'post',
        data,
    })
}

// edit
export async function apiUpdateDivisi<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `/divisi/${data.id}`,
        method: 'patch',
        data,
    })
}

// delete
export async function apiDeleteDivisi<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `/divisi/softDeleted/${data.id}`,
        method: 'patch',
    })
}
