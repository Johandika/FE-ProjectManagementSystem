import ApiService from './ApiService'

// get all user
export async function apiGetUsers(data: any) {
    const res = await ApiService.fetchData({
        url: '/user',
        method: 'get',
        params: data
            ? {
                  page: data.pageIndex,
                  limit: data.pageSize,
                  search: data.query || null,
                  idDivisi: data.filterData?.idDivisi || null,
                  type: data.filterData?.penggunaStatus || null,
              }
            : undefined,
    })

    return res
}

// get one user
export async function apiGetOneUser<T, U extends Record<string, unknown>>(
    data: U
) {
    const res = await ApiService.fetchData<T>({
        url: `/user/${data.id}`,
        method: 'get',
        data,
    })

    return res.data
}

// get profile
export async function apiGetProfile<T, U extends Record<string, unknown>>(
    data: U
) {
    const res = await ApiService.fetchData<T>({
        url: `/user/profile`,
        method: 'get',
        data,
    })
    return res.data
}

// update user
export async function apiUpdateUser<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `/user/${data.id}`,
        method: 'patch',
        data,
    })
}

// restore
export async function apiRestoreUser<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `/user/restore/${data.id}`,
        method: 'patch',
        data,
    })
}

// update password
export async function apiUpdatePassword<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `/user/password/${data.id}`,
        method: 'patch',
        data,
    })
}

// delete user
export async function apiDeleteUser<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `/user/softDeleted/${data.id}`,
        method: 'patch',
        data,
    })
}
