import ApiService from './ApiService'

// get all notifications
export async function apiGetAllNotification() {
    return ApiService.fetchData<
        {
            id: string
            type: string
            pesan: string
            status_baca: boolean
            waktu_baca: string
        }[]
    >({
        url: '/notification',
        method: 'get',
    })
}

// get all notifications faktur pajak
export async function apiGetAllNotificationFakturPajak() {
    return ApiService.fetchData<
        {
            id: string
            type: string
            status_baca: boolean
            waktu_baca: string
            idUser: string
            idFakturPajak: string
            idAdendum: string
            pesan: string
        }[]
    >({
        url: '/notification/fakturpajak',
        method: 'get',
    })
}

// get total unread notifications
export async function apiGetUnreadNotification() {
    return ApiService.fetchData<
        {
            data: number
            message: string
            statusCode: number
        }[]
    >({
        url: '/notification/belum/dibaca',
        method: 'get',
    })
}

// get one and read notification
export async function apiGetOneAndReadNotification<
    T,
    U extends Record<string, unknown>
>(data: U) {
    const res = await ApiService.fetchData<T>({
        url: `/notification/${data.id}`,
        method: 'get',
        data,
    })
    return res.data
}

// create notification
export async function apiCreateNotification<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: '/notification',
        method: 'post',
        data,
    })
}

// delete one notification
export async function apiDeleteOneNotification<
    T,
    U extends Record<string, unknown>
>(data: U) {
    return ApiService.fetchData<T>({
        url: `/notification/${data.id}`,
        method: 'delete',
        data,
    })
}

// delete one notification
export async function apiDeleteAllReadNotification<
    T,
    U extends Record<string, unknown>
>() {
    return ApiService.fetchData<T>({
        url: `/notification/sudah/dibaca`,
        method: 'delete',
    })
}
