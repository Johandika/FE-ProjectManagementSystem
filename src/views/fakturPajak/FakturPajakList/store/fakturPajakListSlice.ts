// File ini menangani operasi terkait daftar produk dalam aplikasi, termasuk memuat data produk, menghapus produk, dan mengelola status loading dan filter.

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { TableQueries } from '@/@types/common'
import {
    apiDeleteFakturPajaks,
    apiGetFakturPajaks,
} from '@/services/FakturPajakService'

type FakturPajak = {
    id: string
    nomor: string
    nominal: number
    keterangan: string
    tanggal: string
    status: string
}

type FakturPajaks = FakturPajak[]

type GetMasterFakturPajakResponse = {
    data: FakturPajaks
    total: number
}

type FilterQueries = {
    name: string
    category: string[]
    status: number[]
    fakturPajakStatus: number
}

export type FakturPajakListSlice = {
    loading: boolean
    deleteConfirmation: boolean
    selectedFakturPajak: string
    tableData: TableQueries
    filterData: FilterQueries
    fakturPajakList: FakturPajak[]
}

type GetMasterFakturPajakData = TableQueries & { filterData?: FilterQueries }

export const SLICE_NAME = 'fakturPajakList'

export const getFakturPajaks = createAsyncThunk(
    SLICE_NAME + '/getFakturPajaks',
    async (data: GetMasterFakturPajakData) => {
        const response = await apiGetFakturPajaks<
            GetMasterFakturPajakResponse,
            GetMasterFakturPajakData
        >(data)
        return response.data
    }
)

export const deleteFakturPajak = async (data: { id: string | string[] }) => {
    const response = await apiDeleteFakturPajaks<
        boolean,
        { id: string | string[] }
    >(data)
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

const initialState: FakturPajakListSlice = {
    loading: false,
    deleteConfirmation: false,
    selectedFakturPajak: '',
    fakturPajakList: [],
    tableData: initialTableData,
    filterData: {
        name: '',
        category: ['bags', 'cloths', 'devices', 'shoes', 'watches'],
        status: [0, 1, 2],
        fakturPajakStatus: 0,
    },
}

const fakturPajakListSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        updateFakturPajakList: (state, action) => {
            state.fakturPajakList = action.payload
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
        setSelectedFakturPajak: (state, action) => {
            state.selectedFakturPajak = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getFakturPajaks.fulfilled, (state, action) => {
                state.fakturPajakList = action.payload.data
                state.tableData.total = action.payload.total
                state.loading = false
            })
            .addCase(getFakturPajaks.pending, (state) => {
                state.loading = true
            })
    },
})

export const {
    updateFakturPajakList,
    setTableData,
    setFilterData,
    toggleDeleteConfirmation,
    setSelectedFakturPajak,
} = fakturPajakListSlice.actions

export default fakturPajakListSlice.reducer
