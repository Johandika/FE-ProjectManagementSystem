import ApiService from './ApiService'

// get all
export async function apiGetDashboard<T, U extends GetDashboardRequest>(
    data: U
) {
    const params = new URLSearchParams()

    if (data.tanggal_awal)
        params.append('tanggal_awal', data.tanggal_awal.toString())
    if (data.tanggal_akhir)
        params.append('tanggal_akhir', data.tanggal_akhir.toString())

    const url = `/dashboard/totalProject${
        params.toString() ? `?${params.toString()}` : ''
    }`

    return ApiService.fetchData<T>({
        url,
        method: 'get',
    })
}
