// File ini menangani operasi terkait daftar produk dalam aplikasi, termasuk memuat data produk, menghapus produk, dan mengelola status loading dan filter.

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { TableQueries } from '@/@types/common'
import { apiGetTenders } from '@/services/TenderService'

type Tender = {
    id: string
    nama: string
    keterangan: string
}

type Tenders = Tender[]

type GetMasterTenderResponse = {
    statusCode: number
    message: string
    data: Tenders
    totaldataClient: number
    totalPage: number
}

type FilterQueries = {
    name: string
    category: string[]
    status: number[]
    productStatus: number
}

export type MasterTenderListSlice = {
    loading: boolean
    deleteConfirmation: boolean
    selectedProduct: string
    tableData: TableQueries & { totalPage?: number }
    filterData: FilterQueries
    productList: Tender[]
}

type GetMasterTenderData = TableQueries & { filterData?: FilterQueries }

export const SLICE_NAME = 'tenderList'

//get all
export const getTenders = createAsyncThunk(
    SLICE_NAME + '/getTenders',
    async (data: GetMasterTenderData) => {
        const response = await apiGetTenders<
            GetMasterTenderResponse,
            GetMasterTenderData
        >(data)
        // return response.data
        return {
            data: response.data.data,
            total: response.data.totaldataClient,
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

const initialState: MasterTenderListSlice = {
    loading: false,
    deleteConfirmation: false,
    selectedProduct: '',
    productList: [],
    tableData: initialTableData,
    filterData: {
        name: '',
        category: ['bags', 'cloths', 'devices', 'shoes', 'd'],
        status: [0, 1, 2],
        productStatus: 0,
    },
}

const tenderListSlice = createSlice({
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
            .addCase(getTenders.fulfilled, (state, action) => {
                state.productList = action.payload.data
                state.tableData.total = action.payload.total
                state.tableData.totalPage = action.payload.totalPage //TAMBAHAN TOTAL PAGE
                state.loading = false
            })
            .addCase(getTenders.pending, (state) => {
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
} = tenderListSlice.actions

export default tenderListSlice.reducer
