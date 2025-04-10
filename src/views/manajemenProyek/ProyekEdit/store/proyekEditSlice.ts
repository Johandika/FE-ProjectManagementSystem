import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetProyek,
    apiPutProyek,
    apiDeleteProyeks,
    apiGetKliens,
    apiGetBerkases,
    apiGetSubkontraktors,
} from '@/services/ProyekService'
import { extractNumberFromString } from '@/utils/extractNumberFromString'

export const SLICE_NAME = 'proyekEdit'

interface Termin {
    keterangan: string
    persen: number
}

interface Lokasi {
    nama: string
    longitude: number
    latitude: number
}

interface Subkontraktor {
    nomor_surat: string
    nama_vendor_subkon: string
    nilai_subkon: number
    waktu_pelaksanaan_kerja: string[]
    keterangan: string
}

interface ProyekData {
    id?: string
    pekerjaan?: string
    klien?: string
    pic?: string
    nomor_spk?: string
    nomor_spo?: string
    tanggal_service_po?: string
    tanggal_delivery?: string
    tanggal_kontrak?: string
    nilai_kontrak?: number
    realisasi?: number
    progress?: number
    sisa_waktu?: number
    keterangan?: string
    status?: string
    idUser?: string
    idKlien?: string
    berkas?: string[]
    lokasi?: Lokasi[]
    termin?: Termin[]
    subkontraktor?: Subkontraktor[]
}

type Klien = {
    id: string
    nama: string
    keterangan: string
}
type Berkas = {
    id: string
    nama: string
}

type GetProyekResponse = ProyekData
type Kliens = Klien[]
type Berkases = Berkas[]
type Subkontraktors = Subkontraktor[]

type GetKliensResponse = {
    data: Kliens
    total: number
}

type GetBerkasesResponse = {
    data: Berkases
    total: number
}

type GetSubkontraktorsResponse = {
    data: Subkontraktors
    total: number
}

export type MasterProyekEditState = {
    loading: boolean
    loadingKliens: boolean
    loadingBerkases: boolean
    loadingSubkontraktors: boolean
    proyekData: ProyekData
    kliensData?: GetKliensResponse
    berkasesData?: GetBerkasesResponse
    subkontraktorsData?: GetSubkontraktorsResponse
}

export const getProyek = createAsyncThunk(
    SLICE_NAME + '/getProyeks',
    async (data: { id: string }) => {
        const response = await apiGetProyek<GetProyekResponse, { id: string }>(
            data
        )
        return response.data
    }
)

//kliens get
export const getKliens = createAsyncThunk(
    SLICE_NAME + '/getKliens',
    async () => {
        const response = await apiGetKliens<GetKliensResponse>()
        return response.data
    }
)

//berkases get
export const getBerkases = createAsyncThunk(
    SLICE_NAME + '/getBerkases',
    async () => {
        const response = await apiGetBerkases<GetBerkasesResponse>()
        return response.data
    }
)

//berkases get
export const getSubkontraktors = createAsyncThunk(
    SLICE_NAME + '/getSubkontraktors',
    async () => {
        const response = await apiGetSubkontraktors<GetSubkontraktorsResponse>()
        return response.data
    }
)

export const updateProyek = async <T, U extends Record<string, unknown>>(
    data: U
) => {
    // Buat salinan data dan pastikan nilai numerik
    // Buat salinan data dan pastikan nilai numerik
    const processedData = {
        ...data,
        nilai_kontrak: extractNumberFromString(
            data.nilai_kontrak as string | number
        ),
        progress: extractNumberFromString(data.progress as string | number),
        realisasi: extractNumberFromString(data.realisasi as string | number),
        sisa_waktu: extractNumberFromString(data.sisa_waktu as string | number),
    }

    const response = await apiPutProyek<T, U>(processedData)
    return response.data
}

export const deleteProyek = async <T, U extends Record<string, unknown>>(
    data: U
) => {
    const response = await apiDeleteProyeks<T, U>(data)
    return response.data
}

const initialState: MasterProyekEditState = {
    loading: true,
    loadingKliens: true,
    loadingBerkases: true,
    loadingSubkontraktors: true,
    proyekData: {},
}

const proyekEditSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProyek.fulfilled, (state, action) => {
                state.proyekData = action.payload
                state.loading = false
            })
            .addCase(getProyek.pending, (state) => {
                state.loading = true
            })
            .addCase(getKliens.fulfilled, (state, action) => {
                state.kliensData = action.payload
                state.loadingKliens = false
            })
            .addCase(getKliens.pending, (state) => {
                state.loadingKliens = true
            })
            .addCase(getBerkases.fulfilled, (state, action) => {
                state.berkasesData = action.payload
                state.loadingBerkases = false
            })
            .addCase(getBerkases.pending, (state) => {
                state.loadingBerkases = true
            })
            .addCase(getSubkontraktors.fulfilled, (state, action) => {
                state.subkontraktorsData = action.payload
                state.loadingSubkontraktors = false
            })
            .addCase(getSubkontraktors.pending, (state) => {
                state.loadingSubkontraktors = true
            })
    },
})

export default proyekEditSlice.reducer
