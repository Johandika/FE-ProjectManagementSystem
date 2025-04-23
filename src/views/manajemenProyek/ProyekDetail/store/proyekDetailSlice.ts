import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetBerkasProyek,
    apiPutBerkasProyek,
} from '@/services/BerkasProyekService'
import {
    apiGetFakturPajak,
    apiGetFakturPajaks,
} from '@/services/FakturPajakService'

export const SLICE_NAME = 'proyekDetail'

interface BerkasProyekData {
    id?: string
    nama?: string
    idProject?: string
    idBerkas?: string
    status?: boolean
}

type FakturPajak = {
    id: string
    nomor: string
    nominal: number
    tanggal: string
}

type BerkasProyeks = BerkasProyekData[]

export type MasterProyekDetailState = {
    loadingBerkasProyeks: boolean
    berkasProyekData?: BerkasProyeks
    loadingFakturPajaks: boolean
    berkasFakturPajaks?: FakturPajak[]
}

// get berkasProyek by id
export const getBerkasProyek = createAsyncThunk(
    SLICE_NAME + '/getBerkasProyek',
    async (data: { id: string }) => {
        const response = await apiGetBerkasProyek<
            BerkasProyeks,
            { id: string }
        >(data)
        return response.data
    }
)

// get all fakturPajak
export const getFakturPajaks = createAsyncThunk(
    SLICE_NAME + '/getFakturPajaks',
    async () => {
        const response = await apiGetFakturPajaks<FakturPajak[]>()
        return response.data
    }
)

// get by id
export const getFakturPajak = createAsyncThunk(
    SLICE_NAME + '/getFakturPajak',

    async (data: { id: string }) => {
        const response = await apiGetFakturPajak<FakturPajak, { id: string }>(
            data
        )
        return response.data
    }
)

// update berkasProyek
// Tambahkan thunk untuk update berkas proyek
export const updateBerkasProyekStatus = createAsyncThunk(
    SLICE_NAME + '/updateBerkasProyekStatus',
    async (data: BerkasProyekData) => {
        const response = await apiPutBerkasProyek<any, BerkasProyekData>(data)
        return response.data
    }
)

const initialState: MasterProyekDetailState = {
    loadingBerkasProyeks: true,
    loadingFakturPajaks: true,
    berkasProyekData: [],
    berkasFakturPajaks: [],
}

const proyekDetailSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getBerkasProyek.fulfilled, (state, action) => {
                state.berkasProyekData = action.payload
                state.loadingBerkasProyeks = false
            })
            .addCase(getBerkasProyek.pending, (state) => {
                state.loadingBerkasProyeks = true
            })
            .addCase(getFakturPajaks.fulfilled, (state, action) => {
                state.berkasProyekData = action.payload
                state.loadingFakturPajaks = false
            })
            .addCase(getFakturPajaks.pending, (state) => {
                state.loadingFakturPajaks = true
            })
            // Tambahkan case untuk update berkas
            .addCase(updateBerkasProyekStatus.fulfilled, (state, action) => {
                // Update item di array berkasProyekData
                const updated = action.payload
                const index = state.berkasProyekData.findIndex(
                    (item) => item.id === updated.id
                )
                if (index !== -1) {
                    state.berkasProyekData[index] = updated
                }
            })
    },
})

export default proyekDetailSlice.reducer
