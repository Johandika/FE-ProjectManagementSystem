import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetBerkases, apiGetKliens } from '@/services/ProyekService'

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

type Kliens = Klien[]
type Berkases = Berkas[]

type GetKliensResponse = {
    data: Kliens
    total: number
}

type GetBerkasesResponse = {
    data: Berkases
    total: number
}

export type MasterProyekNewState = {
    loading: boolean
    loadingKliens: boolean
    loadingBerkases: boolean
    kliensData?: GetKliensResponse
    berkasesData?: GetBerkasesResponse
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

const initialState: MasterProyekNewState = {
    loading: true,
    loadingKliens: true,
    loadingBerkases: true,
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
            .addCase(getBerkases.fulfilled, (state, action) => {
                state.berkasesData = action.payload
                state.loadingBerkases = false
            })
            .addCase(getBerkases.pending, (state) => {
                state.loadingBerkases = true
            })
    },
})

export default proyekNewSlice.reducer
