import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetFakturPajak,
    apiPutFakturPajak,
    apiDeleteFakturPajaks,
} from '@/services/FakturPajakService'

type FakturPajakData = {
    id?: string
    nomor?: string
    nominal?: number
    keterangan?: string
    tanggal?: string
    status?: string
}

export type MasterFakturPajakEditState = {
    loading: boolean
    fakturPajakData: FakturPajakData
}

type GetFakturPajakResponse = FakturPajakData

export const SLICE_NAME = 'fakturPajakEdit'

export const getFakturPajak = createAsyncThunk(
    SLICE_NAME + '/getFakturPajaks',
    async (data: { id: string }) => {
        const response = await apiGetFakturPajak<
            GetFakturPajakResponse,
            { id: string }
        >(data)
        return response.data
    }
)

export const updateFakturPajak = async <T, U extends Record<string, unknown>>(
    data: U
) => {
    const response = await apiPutFakturPajak<T, U>(data)
    return response.data
}

export const deleteFakturPajak = async <T, U extends Record<string, unknown>>(
    data: U
) => {
    const response = await apiDeleteFakturPajaks<T, U>(data)
    return response.data
}

const initialState: MasterFakturPajakEditState = {
    loading: true,
    fakturPajakData: {},
}

const fakturPajakEditSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getFakturPajak.fulfilled, (state, action) => {
                state.fakturPajakData = action.payload
                state.loading = false
            })
            .addCase(getFakturPajak.pending, (state) => {
                state.loading = true
            })
    },
})

export default fakturPajakEditSlice.reducer
