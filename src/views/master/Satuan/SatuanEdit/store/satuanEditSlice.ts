import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetSatuan,
    apiPutSatuan,
    apiDeleteSatuans,
} from '@/services/SatuanService'

type SatuanData = {
    id?: string
    nama?: string
}

export type MasterSatuanEditState = {
    loading: boolean
    satuanData: SatuanData
}

type GetSatuanResponse = SatuanData

export const SLICE_NAME = 'satuanEdit'

export const getSatuan = createAsyncThunk(
    SLICE_NAME + '/getSatuanes',
    async (data: { id: string }) => {
        try {
            const response = await apiGetSatuan<
                GetSatuanResponse,
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

export const updateSatuan = async <T, U extends Record<string, unknown>>(
    data: U
) => {
    try {
        const response = await apiPutSatuan<T, U>(data)
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

export const deleteSatuan = async <T, U extends Record<string, unknown>>(
    data: U
) => {
    const response = await apiDeleteSatuans<T, U>(data)
    return response.data
}

const initialState: MasterSatuanEditState = {
    loading: true,
    satuanData: {},
}

const satuanEditSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getSatuan.fulfilled, (state, action) => {
                state.satuanData = action.payload
                state.loading = false
            })
            .addCase(getSatuan.pending, (state) => {
                state.loading = true
            })
    },
})

export default satuanEditSlice.reducer
