import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'
import { apiGetDashboard } from '@/services/DashboardService'
import {
    apiSelectClient,
    apiSelectClientCreate,
    apiSelectDivisi,
} from '@/services/SelectService'

export type CommonState = {
    currentRouteKey: string
    dataDashboard: any
    loadingDashboard: boolean
    loadingSelectClient: boolean
    loadingSelectClientCreate: boolean
    loadingSelectDivisi: boolean
    deletePasswordConfirmation: boolean
    selectClient: any
    selectClientCreate: any
    selectDivisi: any
    errorDashboard: string | null
}

export const initialState: CommonState = {
    currentRouteKey: '',
    dataDashboard: [],
    selectClient: [],
    selectClientCreate: [],
    selectDivisi: [],
    deletePasswordConfirmation: false,
    loadingDashboard: false,
    loadingSelectClient: false,
    loadingSelectClientCreate: false,
    loadingSelectDivisi: false,
    errorDashboard: null,
}

export const getDashboard = createAsyncThunk(
    `${SLICE_BASE_NAME}/common/getDashboard`,
    async (data: any) => {
        try {
            const response = await apiGetDashboard<any, any>(data)

            return response.data
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.message || 'Failed to fetch data'
            )
        }
    }
)

export const getSelectClient = createAsyncThunk(
    `${SLICE_BASE_NAME}/common/getSelectClients`,
    async () => {
        try {
            const response = await apiSelectClient<any, any>()

            return response.data
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.message || 'Failed to fetch data'
            )
        }
    }
)

export const getSelectClientCreate = createAsyncThunk(
    `${SLICE_BASE_NAME}/common/getSelectClientsCreate`,
    async () => {
        try {
            const response = await apiSelectClientCreate<any, any>()

            return response.data
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.message || 'Failed to fetch data'
            )
        }
    }
)

export const getSelectDivisi = createAsyncThunk(
    `${SLICE_BASE_NAME}/common/getSelectDivisis`,
    async () => {
        try {
            const response = await apiSelectDivisi<any, any>()

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
        setDeletePasswordConfirmation: (state, action) => {
            state.deletePasswordConfirmation = action.payload
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
            .addCase(getSelectClient.pending, (state) => {
                state.loadingSelectClient = true
            })
            .addCase(getSelectClient.fulfilled, (state, action) => {
                state.loadingSelectClient = false
                state.selectClient = action.payload
            })
            .addCase(getSelectClientCreate.pending, (state) => {
                state.loadingSelectClientCreate = true
            })
            .addCase(getSelectClientCreate.fulfilled, (state, action) => {
                state.loadingSelectClientCreate = false
                state.selectClientCreate = action.payload
            })
            .addCase(getSelectDivisi.pending, (state) => {
                state.loadingSelectDivisi = true
            })
            .addCase(getSelectDivisi.fulfilled, (state, action) => {
                state.loadingSelectDivisi = false
                state.selectDivisi = action.payload
            })
            .addCase(getDashboard.rejected, (state, action) => {
                state.loadingDashboard = false
                state.errorDashboard = action.payload as string
            })
    },
})

export const { setCurrentRouteKey, setDeletePasswordConfirmation } =
    commonSlice.actions

export default commonSlice.reducer
