import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiGetKliens } from '@/services/ProyekService'

export const SLICE_NAME = 'proyekNew'

type Klien = {
    id: string
    nama: string
    keterangan: string
}

type Kliens = Klien[]

type GetKliensResponse = {
    data: Kliens
    total: number
}

export type MasterProyekNewState = {
    loadingKliens: boolean
    kliensData?: GetKliensResponse
}

//kliens get
export const getKliens = createAsyncThunk(
    SLICE_NAME + '/getKliens',
    async () => {
        const response = await apiGetKliens<GetKliensResponse>()
        return response.data
    }
)

const initialState: MasterProyekNewState = {
    loadingKliens: true,
}

const proyekNewSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getKliens.fulfilled, (state, action) => {
                state.kliensData = action.payload
                state.loadingKliens = false
            })
            .addCase(getKliens.pending, (state) => {
                state.loadingKliens = true
            })
    },
})

export default proyekNewSlice.reducer
