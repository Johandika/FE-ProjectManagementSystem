import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { TableProyekQueries, TableQueries } from '@/@types/common'
import {
    apiGetAdendums,
    apiGetAdendumsByProyek,
} from '@/services/AdendumService'

type Adendum = {
    id: string
    status: string
    dasar_adendum: string
    DetailAdendums: any[]
    tanggal: string
}

type Adendums = Adendum[]

type GetMasterAdendumResponse = {
    statusCode: number
    message: string
    data: Adendums
    totaldataAdendum: number
    totalPage: number
}

type FilterQueries = {
    name: string
    category: string[]
    status: number[]
    productStatus: number
}

export type MasterAdendumListSlice = {
    loading: boolean
    deleteConfirmation: boolean
    selectedAdendum: string
    adendumStatus: string
    updateConfirmation: boolean
    tableData: TableQueries & { totalPage?: number }
    filterData: FilterQueries
    adendumsList: Adendum[]
    adendumsByProyekList: Adendum[]
    loadingAdendumsByProyek: boolean
}

type GetMasterAdendumData = TableProyekQueries & { filterData?: FilterQueries }

export const SLICE_NAME = 'adendumList'

//get all
export const getAdendums = createAsyncThunk(
    SLICE_NAME + '/getAdendums',
    async (data: GetMasterAdendumData) => {
        const response = await apiGetAdendums<
            GetMasterAdendumResponse,
            GetMasterAdendumData
        >(data)

        // return response.data
        return {
            data: response.data.data,
            total: response.data.totaldataAdendum,
            totalPage: response.data.totalPage,
        }
    }
)

//get all
export const getAdendumsByProyek = createAsyncThunk(
    SLICE_NAME + '/getAdendumsByProyek',
    async (data: GetMasterAdendumData) => {
        const response = await apiGetAdendumsByProyek<
            GetMasterAdendumResponse,
            GetMasterAdendumData
        >(data)

        // return response.data
        return {
            data: response.data,
        }
    }
)

export const initialTableData: TableQueries = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    query: '',
}

const initialState: MasterAdendumListSlice = {
    loading: false,
    deleteConfirmation: false,
    updateConfirmation: false,
    selectedAdendum: '',
    adendumStatus: '',
    adendumsList: [],
    adendumsByProyekList: [],
    loadingAdendumsByProyek: false,
    tableData: initialTableData,
    filterData: {
        name: '',
        category: [],
        status: [0, 1, 2],
        productStatus: 0,
    },
}

const adendumListSlice = createSlice({
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
        toggleUpdateConfirmation: (state, action) => {
            state.updateConfirmation = action.payload
        },
        toggleDeleteConfirmation: (state, action) => {
            state.deleteConfirmation = action.payload
        },
        setSelectedAdendum: (state, action) => {
            state.selectedAdendum = action.payload
        },
        setAdendumStatus: (state, action) => {
            state.adendumStatus = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAdendums.fulfilled, (state, action) => {
                state.adendumsList = action.payload.data
                state.tableData.total = action.payload.total
                state.tableData.totalPage = action.payload.totalPage
                state.loading = false
            })
            .addCase(getAdendums.pending, (state) => {
                state.loading = true
            })
            .addCase(getAdendumsByProyek.fulfilled, (state, action) => {
                state.adendumsByProyekList = action.payload.data
                state.loadingAdendumsByProyek = false
            })
            .addCase(getAdendumsByProyek.pending, (state) => {
                state.loadingAdendumsByProyek = true
            })
    },
})

export const {
    updateProductList,
    setTableData,
    setFilterData,
    toggleUpdateConfirmation,
    toggleDeleteConfirmation,
    setSelectedAdendum,
    setAdendumStatus,
} = adendumListSlice.actions

export default adendumListSlice.reducer
