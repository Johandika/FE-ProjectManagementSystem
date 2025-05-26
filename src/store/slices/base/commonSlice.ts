import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'
import { apiGetDashboard } from '@/services/DashboardService'

export type CommonState = {
    currentRouteKey: string
    dataDashboard: any
    loadingDashboard: boolean
    errorDashboard: string | null
}

export const initialState: CommonState = {
    currentRouteKey: '',
    dataDashboard: [],
    loadingDashboard: false,
    errorDashboard: null,
}

// Async thunk untuk fetch data
export const getDashboard = createAsyncThunk(
    `${SLICE_BASE_NAME}/common/getDashboard`,
    async (data: any) => {
        try {
            const response = await apiGetDashboard<any, any>(data)
            console.log('response.data', response.data)

            return response.data
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.message || 'Failed to fetch data'
            )
        }
    }
)

export const commonSlice = createSlice({
    name: `${SLICE_BASE_NAME}/common`,
    initialState,
    reducers: {
        setCurrentRouteKey: (state, action: PayloadAction<string>) => {
            state.currentRouteKey = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getDashboard.pending, (state) => {
                state.loadingDashboard = true
                state.errorDashboard = null
            })
            .addCase(getDashboard.fulfilled, (state, action) => {
                state.loadingDashboard = false
                state.dataDashboard = action.payload
            })
            .addCase(getDashboard.rejected, (state, action) => {
                state.loadingDashboard = false
                state.errorDashboard = action.payload as string
            })
    },
})

export const { setCurrentRouteKey } = commonSlice.actions

export default commonSlice.reducer
