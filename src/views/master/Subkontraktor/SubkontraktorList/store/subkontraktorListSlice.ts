// File ini menangani operasi terkait daftar produk dalam aplikasi, termasuk memuat data produk, menghapus produk, dan mengelola status loading dan filter.

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { TableQueries } from '@/@types/common'
import {
    apiDeleteSubkontraktors,
    apiGetSubkontraktors,
    apiRestoreSubkontraktor,
} from '@/services/SubkontraktorService'

type Subkontraktor = {
    id: string
    nama: string
}

type Subkontraktors = Subkontraktor[]

type GetMasterSubkontraktorResponse = {
    data: Subkontraktors
    totaldataSubkon: number
    totalPage: number
    total: number
}

type FilterQueries = {
    subkontraktorStatus: string
}

export type MasterSubkontraktorListSlice = {
    loading: boolean
    deleteConfirmation: boolean
    restoreConfirmation: boolean
    selectedSubkontraktor: string
    tableData: TableQueries
    filterData: FilterQueries
    subkontraktorList: Subkontraktor[]
}

type GetMasterSubkontraktorData = TableQueries & { filterData?: FilterQueries }

export const SLICE_NAME = 'subkontraktorList'

export const getSubkontraktors = createAsyncThunk(
    SLICE_NAME + '/getSubkontraktors',

    async (data: GetMasterSubkontraktorData) => {
        const response = await apiGetSubkontraktors<
            GetMasterSubkontraktorResponse,
            GetMasterSubkontraktorData
        >(data)

        return {
            data: response.data.data,
            total: response.data.totaldataSubkon,
            totalPage: response.data.totalPage,
        }
    }
)

export const deleteSubkontraktor = async (data: { id: string | string[] }) => {
    const response = await apiDeleteSubkontraktors<
        boolean,
        { id: string | string[] }
    >(data)
    return response.data
}

export const restoreSubkontraktor = async (data: { id: string | string[] }) => {
    const response = await apiRestoreSubkontraktor<
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

const initialState: MasterSubkontraktorListSlice = {
    loading: false,
    deleteConfirmation: false,
    restoreConfirmation: false,
    selectedSubkontraktor: '',
    subkontraktorList: [],
    tableData: initialTableData,
    filterData: {
        subkontraktorStatus: 'active',
    },
}

const subkontraktorListSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        updateSubkontraktorList: (state, action) => {
            state.subkontraktorList = action.payload
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
        setSelectedSubkontraktor: (state, action) => {
            state.selectedSubkontraktor = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSubkontraktors.fulfilled, (state, action) => {
                state.subkontraktorList = action.payload.data
                state.tableData.total = action.payload.total
                state.loading = false
            })
            .addCase(getSubkontraktors.pending, (state) => {
                state.loading = true
            })
    },
})

export const {
    updateSubkontraktorList,
    setTableData,
    setFilterData,
    toggleDeleteConfirmation,
    toggleRestoreConfirmation,
    setSelectedSubkontraktor,
} = subkontraktorListSlice.actions

export default subkontraktorListSlice.reducer
