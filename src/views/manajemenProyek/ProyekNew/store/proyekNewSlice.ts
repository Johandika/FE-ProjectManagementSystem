import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    // apiGetProyek,
    // apiPutProyek,
    // apiDeleteProyeks,
    apiGetKliens,
} from '@/services/ProyekService'
// import { extractNumberFromString } from '@/utils/extractNumberFromString'

export const SLICE_NAME = 'proyekNew'

// interface Termin {
//     keterangan: string
//     persen: number
// }

// interface ProyekData {
//     id?: string
//     pekerjaan?: string
//     klien?: string
//     pic?: string
//     nomor_spk?: string
//     nomor_spj?: string
//     nomor_spo?: string
//     tanggal_service_po?: string
//     tanggal_delivery?: string
//     nilai_kontrak?: number
//     realisasi?: number
//     progress?: number
//     sisa_waktu?: number
//     keterangan?: string
//     status?: string
//     idUser?: string
//     idKlien?: string
//     berkas?: string[]
//     lokasi?: string[]
//     termin?: Termin[]
// }

type Klien = {
    id: string
    nama: string
    keterangan: string
}

// type GetProyekResponse = ProyekData
type Kliens = Klien[]

type GetKliensResponse = {
    data: Kliens
    total: number
}

export type MasterProyekNewState = {
    loading: boolean
    loadingKliens: boolean
    // proyekData: ProyekData
    kliensData?: GetKliensResponse
}

// export const getProyek = createAsyncThunk(
//     SLICE_NAME + '/getProyeks',
//     async (data: { id: string }) => {
//         const response = await apiGetProyek<GetProyekResponse, { id: string }>(
//             data
//         )
//         return response.data
//     }
// )

//kliens get
export const getKliens = createAsyncThunk(
    SLICE_NAME + '/getKliens',
    async () => {
        const response = await apiGetKliens<GetKliensResponse>()
        return response.data
    }
)

// export const updateProyek = async <T, U extends Record<string, unknown>>(
//     data: U
// ) => {
//     // Buat salinan data dan pastikan nilai numerik
//     // Buat salinan data dan pastikan nilai numerik
//     const processedData = {
//         ...data,
//         nilai_kontrak: extractNumberFromString(
//             data.nilai_kontrak as string | number
//         ),
//         progress: extractNumberFromString(data.progress as string | number),
//         realisasi: extractNumberFromString(data.realisasi as string | number),
//         sisa_waktu: extractNumberFromString(data.sisa_waktu as string | number),
//     }

//     console.log('processedData', processedData)

//     const response = await apiPutProyek<T, U>(processedData)
//     return response.data
// }

// export const deleteProyek = async <T, U extends Record<string, unknown>>(
//     data: U
// ) => {
//     const response = await apiDeleteProyeks<T, U>(data)
//     return response.data
// }

const initialState: MasterProyekNewState = {
    loading: true,
    loadingKliens: true,
    // proyekData: {},
}

const proyekNewSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // .addCase(getProyek.fulfilled, (state, action) => {
            //     state.proyekData = action.payload
            //     state.loading = false
            // })
            // .addCase(getProyek.pending, (state) => {
            //     state.loading = true
            // })
            .addCase(getKliens.fulfilled, (state, action) => {
                state.kliensData = action.payload
                state.loadingKliens = false
            })
            .addCase(getKliens.pending, (state) => {
                state.loadingKliens = true
            })
    },
})

export default proyekNewSlice.reducer
