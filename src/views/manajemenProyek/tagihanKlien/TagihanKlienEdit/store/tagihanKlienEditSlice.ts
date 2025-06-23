import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetTagihanKlien,
    apiPutTagihanKlien,
    apiDeleteTagihanKliens,
} from '@/services/TagihanService'

type TagihanKlienData = {
    id?: string
    nama?: string
    keterangan?: string
}

export type MasterTagihanKlienEditState = {
    loading: boolean
    tagihanKlienData: TagihanKlienData
}

type GetTagihanKlienResponse = TagihanKlienData

export const SLICE_NAME = 'tagihanKlienEdit'

export const getTagihanKlien = createAsyncThunk(
    SLICE_NAME + '/getTagihanKliens',
    async (data: { id: string }) => {
        try {
            const response = await apiGetTagihanKlien<
                GetTagihanKlienResponse,
                { id: string }
            >(data)
            return response.data
        } catch (error: any) {
            // Tangkap error dan kembalikan dalam format yang konsisten
            if (error.response && error.response.data) {
                // Ekstrak pesan error dari respons
                const errorMessage = Array.isArray(error.response.data.message)
                    ? error.response.data.message[0]
                    : error.response.data.message || 'Terjadi kesalahan'

                return {
                    statusCode: error.response.status || 400,
                    message: errorMessage,
                }
            }

            // Jika tidak ada format error yang konsisten, gunakan format default
            return {
                statusCode: 500,
                message: 'Terjadi kesalahan pada server',
            }
        }
    }
)

export const updateTagihanKlien = async <T, U extends Record<string, unknown>>(
    data: U
) => {
    try {
        const response = await apiPutTagihanKlien<T, U>(data)
        return response.data
    } catch (error: any) {
        // Tangkap error dan kembalikan dalam format yang konsisten
        if (error.response && error.response.data) {
            // Ekstrak pesan error dari respons
            const errorMessage = Array.isArray(error.response.data.message)
                ? error.response.data.message[0]
                : error.response.data.message || 'Terjadi kesalahan'

            return {
                statusCode: error.response.status || 400,
                message: errorMessage,
            }
        }

        // Jika tidak ada format error yang konsisten, gunakan format default
        return {
            statusCode: 500,
            message: 'Terjadi kesalahan pada server',
        }
    }
}

export const deleteTagihanKlien = async <T, U extends Record<string, unknown>>(
    data: U
) => {
    const response = await apiDeleteTagihanKliens<T, U>(data)
    return response.data
}

const initialState: MasterTagihanKlienEditState = {
    loading: true,
    tagihanKlienData: {},
}

const tagihanKlienEditSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTagihanKlien.fulfilled, (state, action) => {
                state.tagihanKlienData = action.payload
                state.loading = false
            })
            .addCase(getTagihanKlien.pending, (state) => {
                state.loading = true
            })
    },
})

export default tagihanKlienEditSlice.reducer
