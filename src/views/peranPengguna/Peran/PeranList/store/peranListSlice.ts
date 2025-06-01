// File ini menangani operasi terkait daftar produk dalam aplikasi, termasuk memuat data produk, menghapus produk, dan mengelola status loading dan filter.

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { TableQueries } from '@/@types/common'
import { apiDeleteSatuans } from '@/services/SatuanService'
import { apiGetRoles, apiSelectRoles } from '@/services/RoleService'

type Satuan = {
    id: string
    satuan: string
}

type Satuans = Satuan[]

type GetMasterSatuanResponse = {
    data: Satuans
}

export type MasterPeranListSlice = {
    loading: boolean
    loadingSelectRoles: boolean
    deleteConfirmation: boolean
    selectedSatuan: string
    tableData: TableQueries
    peranList: Satuan[]
    selectRoles: any[]
}

export const SLICE_NAME = 'peranList'

// get all satuans
export const getRoles = createAsyncThunk(SLICE_NAME + '/getRoles', async () => {
    const response = await apiGetRoles()
    return response.data
})

// select roles
export const selectRoles = createAsyncThunk(
    SLICE_NAME + '/selectRoles',
    async () => {
        const response = await apiSelectRoles()
        return response.data
    }
)

export const deleteSatuan = async (data: { id: string | string[] }) => {
    const response = await apiDeleteSatuans<boolean, { id: string | string[] }>(
        data
    )
    return response.data
}

export const initialTableData: TableQueries = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    query: '',
}

const initialState: MasterPeranListSlice = {
    loading: false,
    loadingSelectRoles: false,
    deleteConfirmation: false,
    selectedSatuan: '',
    peranList: [],
    selectRoles: [],
    tableData: initialTableData,
}

const peranListSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        updateSatuanList: (state, action) => {
            state.peranList = action.payload
        },
        setTableData: (state, action) => {
            state.tableData = action.payload
        },
        toggleDeleteConfirmation: (state, action) => {
            state.deleteConfirmation = action.payload
        },
        setSelectedSatuan: (state, action) => {
            state.selectedSatuan = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getRoles.fulfilled, (state, action) => {
                state.peranList = action.payload.data
                state.tableData.total = action.payload.total
                state.loading = false
            })
            .addCase(getRoles.pending, (state) => {
                state.loading = true
            })
            .addCase(selectRoles.fulfilled, (state, action) => {
                state.selectRoles = action.payload.data
                state.tableData.total = action.payload.total
                state.loadingSelectRoles = false
            })
            .addCase(selectRoles.pending, (state) => {
                state.loadingSelectRoles = true
            })
    },
})

export const {
    updateSatuanList,
    setTableData,
    toggleDeleteConfirmation,
    setSelectedSatuan,
} = peranListSlice.actions

export default peranListSlice.reducer
