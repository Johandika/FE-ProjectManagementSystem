import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetBerkas,
    apiPutBerkas,
    apiDeleteBerkases,
} from '@/services/BerkasService'

type BerkasData = {
    id?: string
    nama?: string
    keterangan?: string
}

export type MasterBerkasEditState = {
    loading: boolean
    berkasData: BerkasData
}

type GetBerkasResponse = BerkasData

export const SLICE_NAME = 'berkasEdit'

export const getBerkas = createAsyncThunk(
    SLICE_NAME + '/getBerkases',
    async (data: { id: string }) => {
        try {
            const response = await apiGetBerkas<
                GetBerkasResponse,
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

export const updateBerkas = async <T, U extends Record<string, unknown>>(
    data: U
) => {
    try {
        const response = await apiPutBerkas<T, U>(data)
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

export const deleteBerkas = async <T, U extends Record<string, unknown>>(
    data: U
) => {
    const response = await apiDeleteBerkases<T, U>(data)
    return response.data
}

const initialState: MasterBerkasEditState = {
    loading: true,
    berkasData: {},
}

const berkasEditSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getBerkas.fulfilled, (state, action) => {
                state.berkasData = action.payload
                state.loading = false
            })
            .addCase(getBerkas.pending, (state) => {
                state.loading = true
            })
    },
})

export default berkasEditSlice.reducer
