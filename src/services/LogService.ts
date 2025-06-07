import ApiService from './ApiService'

// get all logs
export async function apiGetLogs<T, U extends Record<string, unknown>>(
    data: U
) {
    const params = new URLSearchParams()

    if (data.tanggal) params.append('tanggal', data.tanggal.toString())
    if (data.status) params.append('status', data.status.toString())
    if (data.idUser) params.append('idUser', data.idUser.toString())
    if (data.page) params.append('page', data.page.toString())
    if (data.limit) params.append('limit', data.limit.toString())

    const url = `/log${params.toString() ? `?${params.toString()}` : ''}`

    return ApiService.fetchData<T>({
        url,
        method: 'get',
    })
}
