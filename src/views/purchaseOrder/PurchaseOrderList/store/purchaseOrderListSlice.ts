// File ini menangani operasi terkait daftar produk dalam aplikasi, termasuk memuat data produk, menghapus produk, dan mengelola status loading dan filter.

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { TableQueries } from '@/@types/common'
import {
    apiDeletePurchaseOrders,
    apiGetPurchaseOrders,
} from '@/services/PurchaseOrderService'

type PurchaseOrder = {
    id: string
    nomor: string
    nominal: number
    keterangan: string
    tanggal: string
    status: string
}

type PurchaseOrders = PurchaseOrder[]

type GetMasterPurchaseOrderResponse = {
    data: PurchaseOrders
    total: number
}

type FilterQueries = {
    name: string
    category: string[]
    status: number[]
    purchaseOrderStatus: number
}

export type PurchaseOrderListSlice = {
    loading: boolean
    deleteConfirmation: boolean
    selectedPurchaseOrder: string
    tableData: TableQueries
    filterData: FilterQueries
    purchaseOrderList: PurchaseOrder[]
}

type GetMasterPurchaseOrderData = TableQueries & { filterData?: FilterQueries }

export const SLICE_NAME = 'purchaseOrderList'

export const getPurchaseOrders = createAsyncThunk(
    SLICE_NAME + '/getPurchaseOrder',
    async (data: GetMasterPurchaseOrderData) => {
        const response = await apiGetPurchaseOrders<
            GetMasterPurchaseOrderResponse,
            GetMasterPurchaseOrderData
        >(data)
        return response.data
    }
)

export const deletePurchaseOrder = async (data: { id: string | string[] }) => {
    const response = await apiDeletePurchaseOrders<
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

const initialState: PurchaseOrderListSlice = {
    loading: false,
    deleteConfirmation: false,
    selectedPurchaseOrder: '',
    purchaseOrderList: [],
    tableData: initialTableData,
    filterData: {
        name: '',
        category: ['bags', 'cloths', 'devices', 'shoes', 'f'],
        status: [0, 1, 2],
        purchaseOrderStatus: 0,
    },
}

const PurchaseOrderListSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        updatePurchaseOrderList: (state, action) => {
            state.purchaseOrderList = action.payload
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
        setSelectedPurchaseOrder: (state, action) => {
            state.selectedPurchaseOrder = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPurchaseOrders.fulfilled, (state, action) => {
                state.purchaseOrderList = action.payload.data
                state.tableData.total = action.payload.total
                state.loading = false
            })
            .addCase(getPurchaseOrders.pending, (state) => {
                state.loading = true
            })
    },
})

export const {
    updatePurchaseOrderList,
    setTableData,
    setFilterData,
    toggleDeleteConfirmation,
    setSelectedPurchaseOrder,
} = PurchaseOrderListSlice.actions

export default PurchaseOrderListSlice.reducer
