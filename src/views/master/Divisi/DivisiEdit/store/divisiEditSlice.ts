import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetDivisi,
    apiUpdateDivisi,
    apiDeleteDivisi,
} from '@/services/DivisiService'

type DivisiData = {
    id?: string
    nama?: string
    keterangan?: string
}

export type MasterDivisiEditState = {
    loading: boolean
    divisiData: DivisiData
}

type GetDivisiResponse = DivisiData

export const SLICE_NAME = 'divisiEdit'

export const getDivisi = createAsyncThunk(
    SLICE_NAME + '/getDivisies',
    async (data: { id: string }) => {
        try {
            const response = await apiGetDivisi<
                GetDivisiResponse,
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

export const updateDivisi = async <T, U extends Record<string, unknown>>(
    data: U
) => {
    try {
        const response = await apiUpdateDivisi<T, U>(data)
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

export const deleteDivisi = async <T, U extends Record<string, unknown>>(
    data: U
) => {
    const response = await apiDeleteDivisi<T, U>(data)
    return response.data
}

const initialState: MasterDivisiEditState = {
    loading: true,
    divisiData: {},
}

const divisiEditSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getDivisi.fulfilled, (state, action) => {
                state.divisiData = action.payload
                state.loading = false
            })
            .addCase(getDivisi.pending, (state) => {
                state.loading = true
            })
    },
})

export default divisiEditSlice.reducer
