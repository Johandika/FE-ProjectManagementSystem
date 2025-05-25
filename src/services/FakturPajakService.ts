import ApiService from './ApiService'

// get all
export async function apiGetFakturPajaks<T, U extends Record<string, unknown>>(
    data: U
) {
    const res = await ApiService.fetchData<T>({
        url: '/fakturPajak',
        method: 'get',
        params: data, //ubah
    })

    return res
}

// get all faktur pajak by proyek
export async function apiGetFakturPajakByProyek<
    T,
    U extends Record<string, unknown>
>(data: U) {
    const res = await ApiService.fetchData<T>({
        url: `/fakturPajak/project/${data.id}`,
        method: 'get',
        data: data, //ubah
    })
    return res.data
}

// delete
export async function apiDeleteFakturPajaks<
    T,
    U extends Record<string, unknown>
>(data: U) {
    if (Array.isArray(data.id)) {
        // jika ada penghapusan multiple
        return ApiService.fetchData<T>({
            url: '/fakturPajak/delete',
            method: 'delete',
            data,
        })
    } else {
        // Untuk id tunggal
        return ApiService.fetchData<T>({
            url: `/fakturPajak/${data}`,
            method: 'delete',
        })
    }
}

// get one by id faktur
export async function apiGetFakturPajak<T, U extends Record<string, unknown>>(
    params: U
) {
    const res = await ApiService.fetchData<T>({
        url: `/purchase/${params.id}`,
        method: 'get',
        params,
    })
    return res.data
}

// edit
export async function apiPutFakturPajak<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `/fakturPajak/${data.id}`,
        method: 'patch',
        data,
    })
}

// update status faktur pajak
export async function apiUpdateStatusFaktur<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: `/fakturPajak/status/${data.id}`,
        method: 'patch',
        data,
    })
}

// create
export async function apiCreateFakturPajak<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: '/fakturPajak',
        method: 'post',
        data,
    })
}
