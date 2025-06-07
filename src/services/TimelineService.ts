import ApiService from './ApiService'

// get all adendum
export async function apiGetTimelines<T, U extends Record<string, unknown>>(
    data: U
) {
    const params = new URLSearchParams()

    if (data.awal) params.append('awal', data.awal.toString())
    if (data.akhir) params.append('akhir', data.akhir.toString())

    const url = `/dashboard/timeline${
        params.toString() ? `?${params.toString()}` : ''
    }`

    return ApiService.fetchData<T>({
        url,
        method: 'get',
    })
}
