import ApiService from './ApiService'

// get all
export async function apiGetDashboard<T, U extends GetDashboardRequest>(
    data: U
) {
    const params = new URLSearchParams()

    if (data.tahun) params.append('tahun', data.tahun.toString())

    const url = `/dashboard/totalProject${
        params.toString() ? `?${params.toString()}` : ''
    }`

    return ApiService.fetchData<T>({
        url,
        method: 'get',
    })
}
