import { apiGetOneUser, apiGetUsers } from '@/services/UserService'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

type PenggunaData = {
    id?: string
    nama?: string
}

export type MasterPenggunaEditState = {
    loading: boolean
    penggunaData: PenggunaData
    onePenggunaData: any[]
    loadingOnePengguna: boolean
}

type GetPenggunaResponse = PenggunaData

export const SLICE_NAME = 'penggunaEdit'

export const getPengguna = createAsyncThunk(
    SLICE_NAME + '/getPengguna',
    async (data: { id: string }) => {
        try {
            const response = await apiGetUsers<
                GetPenggunaResponse,
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

export const getOnePengguna = createAsyncThunk(
    SLICE_NAME + '/getOnePengguna',
    async (data: { id: string }) => {
        const response = await apiGetOneUser<
            GetPenggunaResponse,
            { id: string }
        >(data)
        return response.data
    }
)

const initialState: MasterPenggunaEditState = {
    loading: true,
    loadingOnePengguna: true,
    penggunaData: {},
    onePenggunaData: [],
}

const penggunaEditSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPengguna.fulfilled, (state, action) => {
                state.penggunaData = action.payload
                state.loading = false
            })
            .addCase(getPengguna.pending, (state) => {
                state.loading = true
            })
            .addCase(getOnePengguna.fulfilled, (state, action) => {
                state.onePenggunaData = action.payload
                state.loadingOnePengguna = false
            })
            .addCase(getOnePengguna.pending, (state) => {
                state.loadingOnePengguna = true
            })
    },
})

export default penggunaEditSlice.reducer
