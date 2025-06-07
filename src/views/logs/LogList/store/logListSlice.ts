import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { TableProyekQueries, TableQueries } from '@/@types/common'

import { apiGetLogs } from '@/services/LogService'

type Log = {
    id: string
    type: string
    pesan: string
    tanggal: string
    status: string
    User: { id: string; nama: string; email: string }
}

type Logs = Log[]

type GetMasterLogResponse = {
    statusCode: number
    message: string
    data: Logs
    totaldataLog: number
    totalPage: number
}

type FilterQueries = {
    name: string
    category: string[]
    status: number[]
    productStatus: number
}

export type MasterLogListSlice = {
    loading: boolean
    tableData: TableQueries & { totalPage?: number }
    filterData: FilterQueries
    logsList: Log[]
}

type GetMasterLogData = TableProyekQueries & { filterData?: FilterQueries }

export const SLICE_NAME = 'logList'

//get all
export const getLogs = createAsyncThunk(
    SLICE_NAME + '/getLogs',
    async (data: GetMasterLogData) => {
        const response = await apiGetLogs<
            GetMasterLogResponse,
            GetMasterLogData
        >(data)

        // return response.data
        return {
            data: response.data.data,
            total: response.data.totaldataLog,
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

const initialState: MasterLogListSlice = {
    loading: false,
    logsList: [],
    tableData: initialTableData,
    filterData: {
        name: '',
        category: ['bags', 'cloths', 'devices', 'shoes', 'd'],
        status: [0, 1, 2],
        productStatus: 0,
    },
}

const logListSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        setTableData: (state, action) => {
            state.tableData = action.payload
        },
        setFilterData: (state, action) => {
            state.filterData = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getLogs.fulfilled, (state, action) => {
                state.logsList = action.payload.data
                state.tableData.total = action.payload.total
                state.tableData.totalPage = action.payload.totalPage
                state.loading = false
            })
            .addCase(getLogs.pending, (state) => {
                state.loading = true
            })
    },
})

export const { setTableData, setFilterData } = logListSlice.actions

export default logListSlice.reducer
