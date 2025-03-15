import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetKlien,
    apiPutKlien,
    apiDeleteKliens,
} from '@/services/KlienService'

type KlienData = {
    id?: string
    nama?: string
    keterangan?: string
}

export type MasterKlienEditState = {
    loading: boolean
    klienData: KlienData
}

type GetKlienResponse = KlienData

export const SLICE_NAME = 'klienEdit'

export const getKlien = createAsyncThunk(
    SLICE_NAME + '/getKliens',
    async (data: { id: string }) => {
        const response = await apiGetKlien<GetKlienResponse, { id: string }>(
            data
        )
        return response.data
    }
)

export const updateKlien = async <T, U extends Record<string, unknown>>(
    data: U
) => {
    const response = await apiPutKlien<T, U>(data)
    return response.data
}

export const deleteKlien = async <T, U extends Record<string, unknown>>(
    data: U
) => {
    const response = await apiDeleteKliens<T, U>(data)
    return response.data
}

const initialState: MasterKlienEditState = {
    loading: true,
    klienData: {},
}

const klienEditSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getKlien.fulfilled, (state, action) => {
                state.klienData = action.payload
                state.loading = false
            })
            .addCase(getKlien.pending, (state) => {
                state.loading = true
            })
    },
})

export default klienEditSlice.reducer
