// File ini menangani operasi terkait daftar produk dalam aplikasi, termasuk memuat data produk, menghapus produk, dan mengelola status loading dan filter.

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { TableQueries } from '@/@types/common'
import { apiGetTagihanProyeks } from '@/services/TagihanService'

type TagihanProyek = {
    id: string
    nama: string
    keterangan: string
}

type TagihanProyeks = TagihanProyek[]

// type GetMasterTagihanProyekResponse = {
//     data: TagihanProyeks
//     total: number
// }
type GetMasterTagihanProyekResponse = {
    statusCode: number
    message: string
    data: TagihanProyeks
    totalData: number
    totalPage: number
}

type FilterQueries = {
    name: string
    category: string[]
    status: number[]
    productStatus: number
}

export type MasterTagihanProyekListSlice = {
    loading: boolean
    loadingGetTagihanProyek: boolean
    deleteConfirmation: boolean
    selectedProduct: string
    tableData: TableQueries & { totalPage?: number }
    filterData: FilterQueries
    proyeksList: TagihanProyek[]
    tagihanData: any
}

type GetMasterTagihanProyekData = TableQueries & { filterData?: FilterQueries }

export const SLICE_NAME = 'tagihanProyekList'

//get all
export const getTagihanProyeks = createAsyncThunk(
    SLICE_NAME + '/getTagihanProyeks',
    async (data: GetMasterTagihanProyekData) => {
        const response = await apiGetTagihanProyeks<
            GetMasterTagihanProyekResponse,
            GetMasterTagihanProyekData
        >(data)
        // return response.data
        return {
            data: response.data.data,
            total: response.data.totalData,
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

const initialState: MasterTagihanProyekListSlice = {
    loading: false,
    loadingGetTagihanProyek: false,
    deleteConfirmation: false,
    selectedProduct: '',
    proyeksList: [],
    tagihanData: [],
    tableData: initialTableData,
    filterData: {
        name: '',
        category: ['bags', 'cloths', 'devices', 'shoes', 'd'],
        status: [0, 1, 2],
        productStatus: 0,
    },
}

const tagihanProyekListSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        updateProyeksList: (state, action) => {
            state.proyeksList = action.payload
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
            .addCase(getTagihanProyeks.fulfilled, (state, action) => {
                state.proyeksList = action.payload.data
                state.tableData.total = action.payload.total
                state.tableData.totalPage = action.payload.totalPage
                state.loading = false
            })
            .addCase(getTagihanProyeks.pending, (state) => {
                state.loading = true
            })
    },
})

export const {
    updateProyeksList,
    setTableData,
    setFilterData,
    toggleDeleteConfirmation,
    setSelectedProduct,
} = tagihanProyekListSlice.actions

export default tagihanProyekListSlice.reducer
