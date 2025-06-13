// File ini menangani operasi terkait daftar produk dalam aplikasi, termasuk memuat data produk, menghapus produk, dan mengelola status loading dan filter.

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { TableQueries } from '@/@types/common'
import { apiDeleteBerkases, apiGetBerkases } from '@/services/BerkasService'

type Berkas = {
    id: string
    nama: string
    keterangan: string
}

type Berkases = Berkas[]

type GetMasterBerkasResponse = {
    data: Berkases
    totaldataMasterBerkas: number
    totalPage: number
    total: number
}

type FilterQueries = {
    name: string
    category: string[]
    status: number[]
    berkasStatus: number
}

export type MasterBerkasListSlice = {
    loading: boolean
    deleteConfirmation: boolean
    selectedBerkas: string
    tableData: TableQueries
    filterData: FilterQueries
    berkasList: Berkas[]
}

type GetMasterBerkasData = TableQueries & { filterData?: FilterQueries }

export const SLICE_NAME = 'berkasList'

export const getBerkases = createAsyncThunk(
    SLICE_NAME + '/getBerkases',

    async (data: GetMasterBerkasData) => {
        const response = await apiGetBerkases<
            GetMasterBerkasResponse,
            GetMasterBerkasData
        >(data)

        console.log('response.data', response.data)
        return {
            data: response.data.data,
            total: response.data.totaldataMasterBerkas,
            totalPage: response.data.totalPage,
        }
    }
)

export const deleteBerkas = async (data: { id: string | string[] }) => {
    const response = await apiDeleteBerkases<
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

const initialState: MasterBerkasListSlice = {
    loading: false,
    deleteConfirmation: false,
    selectedBerkas: '',
    berkasList: [],
    tableData: initialTableData,
    filterData: {
        name: '',
        category: ['bags', 'cloths', 'devices', 'shoes', 'b'],
        status: [0, 1, 2],
        berkasStatus: 0,
    },
}

const berkasListSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        updateBerkasList: (state, action) => {
            state.berkasList = action.payload
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
        setSelectedBerkas: (state, action) => {
            state.selectedBerkas = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getBerkases.fulfilled, (state, action) => {
                state.berkasList = action.payload.data
                state.tableData.total = action.payload.total
                state.loading = false
            })
            .addCase(getBerkases.pending, (state) => {
                state.loading = true
            })
    },
})

export const {
    updateBerkasList,
    setTableData,
    setFilterData,
    toggleDeleteConfirmation,
    setSelectedBerkas,
} = berkasListSlice.actions

export default berkasListSlice.reducer
