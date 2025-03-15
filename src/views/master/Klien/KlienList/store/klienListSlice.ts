// File ini menangani operasi terkait daftar produk dalam aplikasi, termasuk memuat data produk, menghapus produk, dan mengelola status loading dan filter.

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { TableQueries } from '@/@types/common'
import { apiDeleteKliens, apiGetKliens } from '@/services/KlienService'

type Klien = {
    id: string
    nama: string
    keterangan: string
}

type Kliens = Klien[]

type GetMasterKlienResponse = {
    data: Kliens
    total: number
}

type FilterQueries = {
    name: string
    category: string[]
    status: number[]
    productStatus: number
}

export type MasterKlienListSlice = {
    loading: boolean
    deleteConfirmation: boolean
    selectedProduct: string
    tableData: TableQueries
    filterData: FilterQueries
    productList: Klien[]
}

type GetMasterKlienData = TableQueries & { filterData?: FilterQueries }

export const SLICE_NAME = 'klienList'

export const getKliens = createAsyncThunk(
    SLICE_NAME + '/getKliens',
    async (data: GetMasterKlienData) => {
        const response = await apiGetKliens<
            GetMasterKlienResponse,
            GetMasterKlienData
        >(data)
        return response.data
    }
)

export const deleteKlien = async (data: { id: string | string[] }) => {
    const response = await apiDeleteKliens<boolean, { id: string | string[] }>(
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

const initialState: MasterKlienListSlice = {
    loading: false,
    deleteConfirmation: false,
    selectedProduct: '',
    productList: [],
    tableData: initialTableData,
    filterData: {
        name: '',
        category: ['bags', 'cloths', 'devices', 'shoes', 'watches'],
        status: [0, 1, 2],
        productStatus: 0,
    },
}

const klienListSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        updateProductList: (state, action) => {
            state.productList = action.payload
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
        setSelectedProduct: (state, action) => {
            state.selectedProduct = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getKliens.fulfilled, (state, action) => {
                state.productList = action.payload.data
                state.tableData.total = action.payload.total
                state.loading = false
            })
            .addCase(getKliens.pending, (state) => {
                state.loading = true
            })
    },
})

export const {
    updateProductList,
    setTableData,
    setFilterData,
    toggleDeleteConfirmation,
    setSelectedProduct,
} = klienListSlice.actions

export default klienListSlice.reducer
