import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetBerkases,
    apiGetKliens,
    apiGetSubkontraktors,
} from '@/services/ProyekService'
import { apiGetSatuans } from '@/services/SatuanService'

export const SLICE_NAME = 'proyekNew'

type Klien = {
    id: string
    nama: string
    keterangan: string
}

type Berkas = {
    id: string
    nama: string
}

type Satuan = {
    id: string
    satuan: string
}

interface Subkontraktor {
    nama?: string
    id: string
    nomor_surat: string
    nilai_subkontrak: number
    waktu_mulai_pelaksanaan: string
    waktu_selesai_pelaksanaan: string
    keterangan: string
}

type Kliens = Klien[]
type Satuans = Satuan[]
type Berkases = Berkas[]
type Subkontraktors = Subkontraktor[]

type GetKliensResponse = {
    data: Kliens
    total: number
}

type GetSatuansResponse = {
    data: Satuans
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

export type MasterProyekNewState = {
    loading: boolean
    loadingKliens: boolean
    loadingBerkases: boolean
    loadingSatuans: boolean
    loadingSubkontraktors: boolean
    kliensData?: GetKliensResponse
    satuansData?: GetSatuansResponse
    berkasesData?: GetBerkasesResponse
    subkontraktorsData?: GetSubkontraktorsResponse
}

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

// get all satuans
export const getSatuans = createAsyncThunk(
    SLICE_NAME + '/getSatuans',
    async () => {
        const response = await apiGetSatuans<GetSatuansResponse>()
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

const initialState: MasterProyekNewState = {
    loading: true,
    loadingKliens: true,
    loadingSatuans: true,
    loadingBerkases: true,
    loadingSubkontraktors: true,
}

const proyekNewSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getKliens.fulfilled, (state, action) => {
                state.kliensData = action.payload
                state.loadingKliens = false
            })
            .addCase(getKliens.pending, (state) => {
                state.loadingKliens = true
            })
            .addCase(getSatuans.fulfilled, (state, action) => {
                state.satuansData = action.payload
                state.loadingSatuans = false
            })
            .addCase(getSatuans.pending, (state) => {
                state.loadingSatuans = true
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

export default proyekNewSlice.reducer
