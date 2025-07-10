// File ini menangani operasi terkait daftar produk dalam aplikasi, termasuk memuat data produk, menghapus produk, dan mengelola status loading dan filter.

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { TableQueries } from '@/@types/common'
import {
    apiDeleteDivisi,
    apiGetDivisis,
    apiRestoreDivisi,
} from '@/services/DivisiService'

type Divisi = {
    id: string
    nama: string
    keterangan: string
}

type Divisies = Divisi[]

type GetMasterDivisiResponse = {
    data: Divisies
    totaldataMasterDivisi: number
    totalPage: number
    total: number
}

type FilterQueries = {
    name: string
    category: string[]
    status: number[]
    divisiStatus: string
}

export type MasterDivisiListSlice = {
    loading: boolean
    deleteConfirmation: boolean
    restoreConfirmation: boolean
    selectedDivisi: string
    tableData: TableQueries
    filterData: FilterQueries
    divisiList: Divisi[]
}

type GetMasterDivisiData = TableQueries & { filterData?: FilterQueries }

export const SLICE_NAME = 'divisiList'

export const getDivisies = createAsyncThunk(
    SLICE_NAME + '/getDivisies',

    async (data: GetMasterDivisiData) => {
        const response = await apiGetDivisis<
            GetMasterDivisiResponse,
            GetMasterDivisiData
        >(data)

        return {
            data: response.data.data,
            total: response.data.totaldataDivisi,
            totalPage: response.data.totalPage,
        }
    }
)

export const deleteDivisi = async (data: { id: string | string[] }) => {
    const response = await apiDeleteDivisi<boolean, { id: string | string[] }>(
        data
    )
    return response.data
}

export const restoreDivisi = async (data: { id: string | string[] }) => {
    const response = await apiRestoreDivisi<boolean, { id: string | string[] }>(
        data
    )
    return response.data
}

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

const initialState: MasterDivisiListSlice = {
    loading: false,
    deleteConfirmation: false,
    selectedDivisi: '',
    divisiList: [],
    restoreConfirmation: false,
    tableData: initialTableData,
    filterData: {
        name: '',
        category: ['bags', 'cloths', 'devices', 'shoes', 'b'],
        status: [0, 1, 2],
        divisiStatus: 'active',
    },
}

const divisiListSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        updateDivisiList: (state, action) => {
            state.divisiList = action.payload
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
        setSelectedDivisi: (state, action) => {
            state.selectedDivisi = action.payload
        },
        toggleRestoreConfirmation: (state, action) => {
            state.restoreConfirmation = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getDivisies.fulfilled, (state, action) => {
                state.divisiList = action.payload.data
                state.tableData.total = action.payload.total
                state.loading = false
            })
            .addCase(getDivisies.pending, (state) => {
                state.loading = true
            })
    },
})

export const {
    updateDivisiList,
    setTableData,
    setFilterData,
    toggleDeleteConfirmation,
    toggleRestoreConfirmation,
    setSelectedDivisi,
} = divisiListSlice.actions

export default divisiListSlice.reducer
