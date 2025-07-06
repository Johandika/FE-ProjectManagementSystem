// File ini menangani operasi terkait daftar produk dalam aplikasi, termasuk memuat data produk, menghapus produk, dan mengelola status loading dan filter.

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { TableQueries } from '@/@types/common'
import {
    apiDeleteKliens,
    apiGetKliens,
    apiRestoreKlien,
} from '@/services/KlienService'

type Klien = {
    id: string
    nama: string
    keterangan: string
}

type Kliens = Klien[]

// type GetMasterKlienResponse = {
//     data: Kliens
//     total: number
// }
type GetMasterKlienResponse = {
    statusCode: number
    message: string
    data: Kliens
    totaldataClient: number
    totalPage: number
}

type FilterQueries = {
    klienStatus: string
}

export type MasterKlienListSlice = {
    loading: boolean
    deleteConfirmation: boolean
    restoreConfirmation: boolean
    selectedKlien: string
    tableData: TableQueries & { totalPage?: number }
    filterData: FilterQueries
    productList: Klien[]
}

type GetMasterKlienData = TableQueries & { filterData?: FilterQueries }

export const SLICE_NAME = 'klienList'

//get all
export const getKliens = createAsyncThunk(
    SLICE_NAME + '/getKliens',
    async (data: GetMasterKlienData) => {
        const response = await apiGetKliens<
            GetMasterKlienResponse,
            GetMasterKlienData
        >(data)
        // return response.data
        return {
            data: response.data.data,
            total: response.data.totaldataClient,
            totalPage: response.data.totalPage,
        }
    }
)

// delete
export const deleteKlien = async (data: { id: string | string[] }) => {
    const response = await apiDeleteKliens<boolean, { id: string | string[] }>(
        data
    )
    return response.data
}

// restore
export const restoreKlien = async (data: { id: string | string[] }) => {
    const response = await apiRestoreKlien<boolean, { id: string | string[] }>(
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
    restoreConfirmation: false,
    selectedKlien: '',
    productList: [],
    tableData: initialTableData,
    filterData: {
        klienStatus: 'active',
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
        toggleRestoreConfirmation: (state, action) => {
            state.restoreConfirmation = action.payload
        },
        setSelectedKlien: (state, action) => {
            state.selectedKlien = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getKliens.fulfilled, (state, action) => {
                state.productList = action.payload.data
                state.tableData.total = action.payload.total
                state.tableData.totalPage = action.payload.totalPage
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
    toggleRestoreConfirmation,
    setSelectedKlien,
} = klienListSlice.actions

export default klienListSlice.reducer
