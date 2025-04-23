import ApiService from './ApiService'

// // create
// export async function apiCreateBerkasProyek<
//     T,
//     U extends Record<string, unknown>
// >(data: U) {
//     return ApiService.fetchData<T>({
//         url: '/berkasProyeks/create',
//         method: 'post',
//         data,
//     })
// }

// get by id
export async function apiGetTermin<T, U extends Record<string, unknown>>(
    params: U
) {
    return ApiService.fetchData<T>({
        url: '/termin',
        method: 'get',
        params,
    })
}

// update
export async function apiEditTermin<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/termin/update',
        method: 'put',
        data,
    })
}

// // delete
// export async function apiDeleteBerkasProyeks<
//     T,
//     U extends Record<string, unknown>
// >(data: U) {
//     return ApiService.fetchData<T>({
//         url: '/berkasProyeks/delete',
//         method: 'delete',
//         data,
//     })
// }
