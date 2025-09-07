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
    totaldataTender: number
    totalPage: number
}

type FilterQueries = {
    status: string
    filteruser: string
    idDivisi?: string
    idClient?: string
}

export type MasterTenderListSlice = {
    loading: boolean
    deleteConfirmation: boolean
    selectedTender: string
    tenderStatus: string
    progress: number
    updateConfirmation: boolean
    progressConfirmation: boolean
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
            total: response.data.totaldataTender,
            totalPage: response.data.totalPage,
        }
    }
)

export const initialTableData: TableQueries = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    query: '',
}

const initialState: MasterTenderListSlice = {
    loading: false,
    deleteConfirmation: false,
    selectedTender: '',
    updateConfirmation: false,
    tenderStatus: '',
    progress: 0,
    productList: [],
    tableData: initialTableData,
    filterData: {
        status: '',
    },
}

const tenderListSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        setTableData: (state, action) => {
            state.tableData = action.payload
        },
        setFilterData: (state, action) => {
            state.filterData = action.payload
        },
        toggleDeleteConfirmation: (state, action) => {
            state.deleteConfirmation = action.payload
        },
        setSelectedTender: (state, action) => {
            state.selectedTender = action.payload
        },
        setUpdateConfirmation: (state, action) => {
            state.updateConfirmation = action.payload
        },
        setProgressConfirmation: (state, action) => {
            state.progressConfirmation = action.payload
        },
        setTenderStatus: (state, action) => {
            state.tenderStatus = action.payload
        },
        setProgress: (state, action) => {
            state.progress = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTenders.fulfilled, (state, action) => {
                state.productList = action.payload.data
                state.tableData.total = action.payload.total
                state.tableData.totalPage = action.payload.totalPage
                state.loading = false
            })
            .addCase(getTenders.pending, (state) => {
                state.loading = true
            })
    },
})

export const {
    setTableData,
    setFilterData,
    toggleDeleteConfirmation,
    setSelectedTender,
    setUpdateConfirmation,
    setProgressConfirmation,
    setTenderStatus,
    setProgress,
} = tenderListSlice.actions

export default tenderListSlice.reducer
