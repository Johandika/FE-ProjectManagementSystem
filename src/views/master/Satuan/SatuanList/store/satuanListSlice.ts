// File ini menangani operasi terkait daftar produk dalam aplikasi, termasuk memuat data produk, menghapus produk, dan mengelola status loading dan filter.

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { TableQueries } from '@/@types/common'
import { apiDeleteSatuans, apiGetSatuans } from '@/services/SatuanService'

type Satuan = {
    id: string
    satuan: string
}

type Satuans = Satuan[]

type GetMasterSatuanResponse = {
    data: Satuans
    total: number
}

type FilterQueries = {
    name: string
    category: string[]
    status: number[]
    satuanStatus: number
}

export type MasterSatuanListSlice = {
    loading: boolean
    deleteConfirmation: boolean
    selectedSatuan: string
    tableData: TableQueries
    filterData: FilterQueries
    satuanList: Satuan[]
}

type GetMasterSatuanData = TableQueries & { filterData?: FilterQueries }

export const SLICE_NAME = 'satuanList'

// get all satuans
export const getSatuans = createAsyncThunk(
    SLICE_NAME + '/getSatuans',
    async (data: GetMasterSatuanData) => {
        const response = await apiGetSatuans<
            GetMasterSatuanResponse,
            GetMasterSatuanData
        >(data)
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
    sort: {
        order: '',
        key: '',
    },
}

const initialState: MasterSatuanListSlice = {
    loading: false,
    deleteConfirmation: false,
    selectedSatuan: '',
    satuanList: [],
    tableData: initialTableData,
    filterData: {
        name: '',
        category: ['bags', 'cloths', 'devices', 'shoes', 'c'],
        status: [0, 1, 2],
        satuanStatus: 0,
    },
}

const satuanListSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        updateSatuanList: (state, action) => {
            state.satuanList = action.payload
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
        setSelectedSatuan: (state, action) => {
            state.selectedSatuan = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSatuans.fulfilled, (state, action) => {
                state.satuanList = action.payload.data
                state.tableData.total = action.payload.total
                state.loading = false
            })
            .addCase(getSatuans.pending, (state) => {
                state.loading = true
            })
    },
})

export const {
    updateSatuanList,
    setTableData,
    setFilterData,
    toggleDeleteConfirmation,
    setSelectedSatuan,
} = satuanListSlice.actions

export default satuanListSlice.reducer
