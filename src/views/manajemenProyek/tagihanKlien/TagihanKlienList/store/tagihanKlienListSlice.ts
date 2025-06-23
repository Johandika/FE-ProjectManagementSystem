// File ini menangani operasi terkait daftar produk dalam aplikasi, termasuk memuat data produk, menghapus produk, dan mengelola status loading dan filter.

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { TableQueries } from '@/@types/common'
import {
    apiGetTagihanKlien,
    apiGetTagihanKliens,
} from '@/services/TagihanService'

type TagihanKlien = {
    id: string
    nama: string
    keterangan: string
}

type TagihanKliens = TagihanKlien[]

// type GetMasterTagihanKlienResponse = {
//     data: TagihanKliens
//     total: number
// }
type GetMasterTagihanKlienResponse = {
    statusCode: number
    message: string
    data: TagihanKliens
    totalData: number
    totalPage: number
}

type FilterQueries = {
    name: string
    category: string[]
    status: number[]
    productStatus: number
}

export type MasterTagihanKlienListSlice = {
    loading: boolean
    loadingGetTagihanKlien: boolean
    deleteConfirmation: boolean
    selectedProduct: string
    tableData: TableQueries & { totalPage?: number }
    filterData: FilterQueries
    productList: TagihanKlien[]
    tagihanData: any
}

type GetMasterTagihanKlienData = TableQueries & { filterData?: FilterQueries }

export const SLICE_NAME = 'tagihanKlienList'

//get all
export const getTagihanKliens = createAsyncThunk(
    SLICE_NAME + '/getTagihanKliens',
    async (data: GetMasterTagihanKlienData) => {
        const response = await apiGetTagihanKliens<
            GetMasterTagihanKlienResponse,
            GetMasterTagihanKlienData
        >(data)
        // return response.data
        return {
            data: response.data.data,
            total: response.data.totalData,
            totalPage: response.data.totalPage,
        }
    }
)

//get one tagihan klien
export const getTagihanKlien = createAsyncThunk(
    SLICE_NAME + '/getTagihanKlien',
    async (data: GetMasterTagihanKlienData) => {
        const response = await apiGetTagihanKlien<
            GetMasterTagihanKlienResponse,
            GetMasterTagihanKlienData
        >(data)
        // return response.data
        return response.data
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

const initialState: MasterTagihanKlienListSlice = {
    loading: false,
    loadingGetTagihanKlien: false,
    deleteConfirmation: false,
    selectedProduct: '',
    productList: [],
    tagihanData: [],
    tableData: initialTableData,
    filterData: {
        name: '',
        category: ['bags', 'cloths', 'devices', 'shoes', 'd'],
        status: [0, 1, 2],
        productStatus: 0,
    },
}

const tagihanKlienListSlice = createSlice({
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
            .addCase(getTagihanKliens.fulfilled, (state, action) => {
                state.productList = action.payload.data
                state.tableData.total = action.payload.total
                state.tableData.totalPage = action.payload.totalPage
                state.loading = false
            })
            .addCase(getTagihanKliens.pending, (state) => {
                state.loading = true
            })
            .addCase(getTagihanKlien.fulfilled, (state, action) => {
                state.tagihanData = action.payload.data
                state.loadingGetTagihanKlien = false
            })
            .addCase(getTagihanKlien.pending, (state) => {
                state.loadingGetTagihanKlien = true
            })
    },
})

export const {
    updateProductList,
    setTableData,
    setFilterData,
    toggleDeleteConfirmation,
    setSelectedProduct,
} = tagihanKlienListSlice.actions

export default tagihanKlienListSlice.reducer
