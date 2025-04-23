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
        try {
            const response = await apiGetKlien<
                GetKlienResponse,
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

export const updateKlien = async <T, U extends Record<string, unknown>>(
    data: U
) => {
    try {
        const response = await apiPutKlien<T, U>(data)
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
