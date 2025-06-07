import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type {
    TableLogQueries,
    TableProyekQueries,
    TableQueries,
} from '@/@types/common'

import { apiGetLogs } from '@/services/LogService'
import { apiGetUsers } from '@/services/UserService'

type Log = {
    id: string
    type: string
    pesan: string
    tanggal: string
    status: string
    User: { id: string; nama: string; email: string }
}

type User = {
    id: string
    nama: string
    email: string
    nomor_telepon: string
    status_aktif: boolean
    status_login: boolean
    last_login: string
    idRole: string
    Role: {
        id: string
        nama: string
    }
}

type Logs = Log[]
type Users = User[]

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
    idUser: string
}

export type MasterLogListSlice = {
    loading: boolean
    loadingPenggunas: boolean
    tableData: TableQueries & { totalPage?: number }
    filterData: FilterQueries
    logsList: Log[]
    penggunaList: Users[]
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
        console.log('data response log', response.data)

        // return response.data
        return {
            data: response.data.data,
            total: response.data.totaldataLog,
            totalPage: response.data.totalPage,
        }
    }
)

// get all penggunas
export const getPenggunas = createAsyncThunk(
    SLICE_NAME + '/getPenggunas',
    async () => {
        const response = await apiGetUsers()

        return response.data
    }
)

export const initialTableData: TableLogQueries = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    query: '',
    idUser: '',
}

const initialState: MasterLogListSlice = {
    loading: false,
    loadingPenggunas: false,
    logsList: [],
    penggunaList: [],
    tableData: initialTableData,
    filterData: {
        name: '',
        category: [],
        status: [],
        idUser: '',
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
            .addCase(getPenggunas.fulfilled, (state, action) => {
                state.penggunaList = action.payload
                state.loadingPenggunas = false
            })
            .addCase(getPenggunas.pending, (state) => {
                state.loadingPenggunas = true
            })
    },
})

export const { setTableData, setFilterData } = logListSlice.actions

export default logListSlice.reducer
