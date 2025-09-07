import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { TableProyekQueries, TableQueries } from '@/@types/common'
import { apiGetAllNotificationFakturPajak } from '@/services/NotificationService'

type FakturPajak = {
    id: string
    status: string
    dasar_fakturPajak: string
    DetailFakturPajaks: any[]
    tanggal: string
}

type FakturPajaks = FakturPajak[]

type GetMasterFakturPajakResponse = {
    statusCode: number
    message: string
    data: FakturPajaks
    totaldataFakturPajak: number
    totalPage: number
}

type FilterQueries = {
    name: string
    category: string[]
    status: number[]
    productStatus: number
}

export type MasterFakturPajakListSlice = {
    loading: boolean
    deleteConfirmation: boolean
    selectedFakturPajak: string
    fakturPajakStatus: string
    updateConfirmation: boolean
    tableData: TableQueries & { totalPage?: number }
    filterData: FilterQueries
    fakturPajaksList: FakturPajak[]
    fakturPajaksByProyekList: FakturPajak[]
    loadingFakturPajaksByProyek: boolean
}

type GetMasterFakturPajakData = TableProyekQueries & {
    filterData?: FilterQueries
}

export const SLICE_NAME = 'fakturPajakList'

//get all
export const getNotificationFakturPajaks = createAsyncThunk(
    SLICE_NAME + '/getNotificationFakturPajaks',
    async (data: GetMasterFakturPajakData) => {
        const response = await apiGetAllNotificationFakturPajak<
            GetMasterFakturPajakResponse,
            GetMasterFakturPajakData
        >(data)

        // return response.data
        return {
            data: response.data.data,
            // total: response.data.totaldataFakturPajak,
            // totalPage: response.data.totalPage,
        }
    }
)

export const initialTableData: TableQueries = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    query: '',
}

const initialState: MasterFakturPajakListSlice = {
    loading: false,
    deleteConfirmation: false,
    updateConfirmation: false,
    selectedFakturPajak: '',
    fakturPajakStatus: '',
    fakturPajaksList: [],
    fakturPajaksByProyekList: [],
    loadingFakturPajaksByProyek: false,
    tableData: initialTableData,
    filterData: {
        name: '',
        category: [],
        status: [0, 1, 2],
        productStatus: 0,
    },
}

const fakturPajakListSlice = createSlice({
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
        setSelectedFakturPajak: (state, action) => {
            state.selectedFakturPajak = action.payload
        },
        setFakturPajakStatus: (state, action) => {
            state.fakturPajakStatus = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getNotificationFakturPajaks.fulfilled, (state, action) => {
                state.fakturPajaksList = action.payload.data
                // state.tableData.total = action.payload.total
                // state.tableData.totalPage = action.payload.totalPage
                state.loading = false
            })
            .addCase(getNotificationFakturPajaks.pending, (state) => {
                state.loading = true
            })
    },
})

export const {
    updateProductList,
    setTableData,
    setFilterData,
    toggleUpdateConfirmation,
    toggleDeleteConfirmation,
    setSelectedFakturPajak,
    setFakturPajakStatus,
} = fakturPajakListSlice.actions

export default fakturPajakListSlice.reducer
