// File ini menangani operasi terkait daftar produk dalam aplikasi, termasuk memuat data produk, menghapus produk, dan mengelola status loading dan filter.

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { TableQueries } from '@/@types/common'
import { apiGetUsers } from '@/services/UserService'

type Pengguna = {
    id: string
    pengguna: string
}

type Penggunas = Pengguna[]

type GetMasterPenggunaResponse = {
    data: Penggunas
    total: number
}

type FilterQueries = {
    idDivisi: string
}

export type MasterPenggunaListSlice = {
    loading: boolean
    deleteConfirmation: boolean
    selectedPengguna: string
    tableData: TableQueries
    filterData: FilterQueries
    penggunaList: Pengguna[]
    dialogUpdatePassword: boolean
    dialogResetPassword: boolean
    idUserActive: string
}

type GetMasterPenggunaData = TableQueries & { filterData?: FilterQueries }

export const SLICE_NAME = 'penggunaList'

// get all penggunas
export const getPenggunas = createAsyncThunk(
    SLICE_NAME + '/apiGetUsers',
    async (data: GetMasterPenggunaData) => {
        const response = await apiGetUsers(data)
        return {
            data: response.data.data,
            total: response.data.totaldataUser,
            totalPage: response.data.totalPage,
        }
    }
)

export const initialTableData: TableQueries = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: {
        order: '',
        key: '',
    },
}

const initialState: MasterPenggunaListSlice = {
    loading: false,
    deleteConfirmation: false,
    selectedPengguna: '',
    penggunaList: [],
    dialogUpdatePassword: false,
    dialogResetPassword: false,
    idUserActive: '',
    tableData: initialTableData,
    filterData: {
        idDivisi: '',
    },
}

const penggunaListSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        updatePenggunaList: (state, action) => {
            state.penggunaList = action.payload
        },
        setTableData: (state, action) => {
            state.tableData = action.payload
        },
        setFilterData: (state, action) => {
            state.filterData = action.payload
        },
        toggleDeleteConfirmation: (state, action) => {
            state.deleteConfirmation = action.payload
        },
        setSelectedPengguna: (state, action) => {
            state.selectedPengguna = action.payload
        },
        setDialogUpdatePassword: (state, action) => {
            state.dialogUpdatePassword = action.payload
        },
        setDialogResetPassword: (state, action) => {
            state.dialogResetPassword = action.payload
        },
        setIdUserActive: (state, action) => {
            state.idUserActive = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPenggunas.fulfilled, (state, action) => {
                state.penggunaList = action.payload.data
                state.tableData.total = action.payload.total
                state.loading = false
            })
            .addCase(getPenggunas.pending, (state) => {
                state.loading = true
            })
    },
})

export const {
    updatePenggunaList,
    setTableData,
    setFilterData,
    toggleDeleteConfirmation,
    setDialogUpdatePassword,
    setDialogResetPassword,
    setIdUserActive,
    setSelectedPengguna,
} = penggunaListSlice.actions

export default penggunaListSlice.reducer
