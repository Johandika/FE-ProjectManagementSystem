import ApiService from './ApiService'

// get all
export async function apiGetKliens<T, U extends Record<string, unknown>>(
    data: U
) {
    console.log('dat', data)
    const res = await ApiService.fetchData<T>({
        url: '/client',
        method: 'get',
        params: data
            ? {
                  page: data.pageIndex,
                  limit: data.pageSize,
                  search: data.query || null,
                  idDivisi: data.filterData?.idDivisi || null,
                  type: data.filterData?.klienStatus || null,
              }
            : undefined,
    })

    return res
}

// delete
export async function apiDeleteKliens<T, U extends Record<string, unknown>>(
    data: U
) {
    if (Array.isArray(data.id)) {
        // jika ada penghapusan multiple
        return ApiService.fetchData<T>({
            url: '/client/delete',
            method: 'patch',
            data,
        })
    } else {
        // Untuk id tunggal
        return ApiService.fetchData<T>({
            url: `/client/softDeleted/${data.id}`,
            method: 'patch',
        })
    }
}

// get by id
export async function apiGetKlien<T, U extends Record<string, unknown>>(
    params: U
) {
    const res = await ApiService.fetchData<T>({
        url: `/client/${params.id}`,
        method: 'get',
        params,
    })
    return res.data
}

// edit
export async function apiPutKlien<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `/client/${data.id}`,
        method: 'patch',
        data,
    })
}

// restore
export async function apiRestoreKlien<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `/client/restore/${data.id}`,
        method: 'patch',
        data,
    })
}

// create
export async function apiCreateKlien<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/client',
        method: 'post',
        data,
    })
}
