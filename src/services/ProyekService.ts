import ApiService from './ApiService'

// get all proyeks
export async function apiGetProyeks<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/project',
        method: 'get',
        data,
    })
}

//get all kliens
export async function apiGetKliens<T, U extends Record<string, unknown>>(
    data: U
) {
    const res = await ApiService.fetchData<T>({
        url: '/client',
        method: 'get',
        params: data, //ubah
    })

    return res
}

//get all berkases
export async function apiGetBerkases<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/berkas',
        method: 'get',
        data,
    })
}

//get all berkases
export async function apiGetSubkontraktors<
    T,
    U extends Record<string, unknown>
>(data: U) {
    const res = await ApiService.fetchData<T>({
        url: '/subkon',
        method: 'get',
        params: data,
    })

    return res
}

// delete
export async function apiDeleteProyeks<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/manajemen-proyek/delete',
        method: 'delete',
        data,
    })
}

// get by id
export async function apiGetProyek<T, U extends Record<string, unknown>>(
    params: U
) {
    const res = await ApiService.fetchData<T>({
        url: `/project/${params.id}`,
        method: 'get',
        params,
    })
    return res.data
}

// edit
export async function apiPutProyek<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/manajemen-proyek/update',
        method: 'put',
        data,
    })
}

// create
export async function apiCreateProyek<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/project',
        method: 'post',
        data,
    })
}

// {
//   "pekerjaan": "asgasgsadfsadg",
//   "pic": "asgsagas",
//   "nomor_kontrak": "asgsa",
//   "tanggal_service_po": "2025-04-16",
//   "tanggal_kontrak": "2025-04-16",
//   "tanggal_delivery": "2025-04-16",
//   "nilai_kontrak": 30000000,
//   "timeline": 122,
//   "idClient": "c5d2c9ab-9982-4fbd-b6f5-0dfc969af334",
//   "keterangan": "sfagagasdg",
//   "berkas": [
//     "d8ff8b1f-e88d-4461-a29d-aec9fb0de0c0",
//     "51341491-5119-4b0d-a527-066d4bb00ed6"
//   ],
//   "lokasi": [
//     {
//       "lokasi": "asdgasgsa",
//       "latitude": 1111,
//       "longitude": 1111
//     }
//   ],
//   "termin": [
//     {
//       "keterangan": "asgasgsadg",
//       "persen": 100
//     }
//   ],
//   "subkontraktor": [
//     {
//       "id": "c82dfca3-3ef0-454f-95ac-3aaa9a59cf13",
//       "nomor_surat": "1124121",
//       "nilai_subkontrak": 1234124,
//       "waktu_mulai_pelaksanaan": "2025-04-16",
//       "waktu_selesai_pelaksanaan": "2025-04-23",
//       "keterangan": "asdgasgsaddasg"
//     }
//   ]

//   "klien": "CLIENT 4",
// }
