import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetSubkontraktor,
    apiPutSubkontraktor,
    apiDeleteSubkontraktors,
} from '@/services/SubkontraktorService'

type SubkontraktorData = {
    id?: string
    nama?: string
    keterangan?: string
}

export type MasterSubkontraktorEditState = {
    loading: boolean
    subkontraktorData: SubkontraktorData
}

type GetSubkontraktorResponse = SubkontraktorData

export const SLICE_NAME = 'subkontraktorEdit'

export const getSubkontraktor = createAsyncThunk(
    SLICE_NAME + '/getSubkontraktors',
    async (data: { id: string }) => {
        const response = await apiGetSubkontraktor<
            GetSubkontraktorResponse,
            { id: string }
        >(data)
        return response.data
    }
)

export const updateSubkontraktor = async <T, U extends Record<string, unknown>>(
    data: U
) => {
    const response = await apiPutSubkontraktor<T, U>(data)
    return response.data
}

export const deleteSubkontraktor = async <T, U extends Record<string, unknown>>(
    data: U
) => {
    const response = await apiDeleteSubkontraktors<T, U>(data)
    return response.data
}

const initialState: MasterSubkontraktorEditState = {
    loading: true,
    subkontraktorData: {},
}

const subkontraktorEditSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getSubkontraktor.fulfilled, (state, action) => {
                state.subkontraktorData = action.payload
                state.loading = false
            })
            .addCase(getSubkontraktor.pending, (state) => {
                state.loading = true
            })
    },
})

export default subkontraktorEditSlice.reducer
