import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetTender } from '@/services/TenderService'
import { apiGetKliens } from '@/services/KlienService'

type TenderData = {
    id?: string
    pekerjaan: string
    client: string
    idClient: string
    nilai_kontrak: number
    status: string
}

type KlienData = {
    id?: string
    pekerjaan: string
    client: string
    idClient: string
    nilai_kontrak: number
    status: string
}

export type MasterTenderEditState = {
    loading: boolean
    loadingKliens: boolean
    tenderData: TenderData[]
    kliensData: KlienData[]
}

type GetTenderResponse = TenderData
type GetKlienResponse = KlienData

export const SLICE_NAME = 'tenderEdit'

export const getTender = createAsyncThunk(
    SLICE_NAME + '/getTender',
    async (data: { id: string }) => {
        const response = await apiGetTender<GetTenderResponse, { id: string }>(
            data
        )

        return response.data
    }
)

export const getKliens = createAsyncThunk(
    SLICE_NAME + '/getKliens',
    async () => {
        const response = await apiGetKliens<GetKlienResponse>()
        return response.data
    }
)

const initialState: MasterTenderEditState = {
    loading: true,
    loadingKliens: true,
    tenderData: [],
    kliensData: [],
}

const tenderEditSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTender.fulfilled, (state, action) => {
                state.tenderData = action.payload
                state.loading = false
            })
            .addCase(getTender.pending, (state) => {
                state.loading = true
            })
            .addCase(getKliens.fulfilled, (state, action) => {
                state.kliensData = action.payload
                state.loadingKliens = false
            })
            .addCase(getKliens.pending, (state) => {
                state.loadingKliens = true
            })
    },
})

export default tenderEditSlice.reducer
