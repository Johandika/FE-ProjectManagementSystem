// File ini menangani operasi terkait daftar produk dalam aplikasi, termasuk memuat data produk, menghapus produk, dan mengelola status loading dan filter.

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { TableQueries } from '@/@types/common'
import { apiDeleteProyeks, apiGetProyeks } from '@/services/ProyekService'

type Proyek = {
    id: string
    nomor: string
    nominal: number
    keterangan: string
    tanggal: string
    status: string
}

type Proyeks = Proyek[]

type GetMasterProyekResponse = {
    data: Proyeks
    total: number
}

type FilterQueries = {
    name: string
    category: string[]
    status: number[]
    proyekStatus: number
}

export type ProyekListSlice = {
    loading: boolean
    deleteConfirmation: boolean
    selectedProyek: string
    tableData: TableQueries
    filterData: FilterQueries
    proyekList: Proyek[]
}

type GetMasterProyekData = TableQueries & { filterData?: FilterQueries }

export const SLICE_NAME = 'proyekList'

export const getProyeks = createAsyncThunk(
    SLICE_NAME + '/getProyeks',
    async (data: GetMasterProyekData) => {
        const response = await apiGetProyeks<
            GetMasterProyekResponse,
            GetMasterProyekData
        >(data)
        return response.data
    }
)

export const deleteProyek = async (data: { id: string | string[] }) => {
    const response = await apiDeleteProyeks<boolean, { id: string | string[] }>(
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

const initialState: ProyekListSlice = {
    loading: false,
    deleteConfirmation: false,
    selectedProyek: '',
    proyekList: [],
    tableData: initialTableData,
    filterData: {
        name: '',
        category: ['bags', 'cloths', 'devices', 'shoes', 'watches'],
        status: [0, 1, 2],
        proyekStatus: 0,
    },
}

const proyekListSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        updateProyekList: (state, action) => {
            state.proyekList = action.payload
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
        setSelectedProyek: (state, action) => {
            state.selectedProyek = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProyeks.fulfilled, (state, action) => {
                state.proyekList = action.payload.data
                state.tableData.total = action.payload.total
                state.loading = false
            })
            .addCase(getProyeks.pending, (state) => {
                state.loading = true
            })
    },
})

export const {
    updateProyekList,
    setTableData,
    setFilterData,
    toggleDeleteConfirmation,
    setSelectedProyek,
} = proyekListSlice.actions

export default proyekListSlice.reducer
