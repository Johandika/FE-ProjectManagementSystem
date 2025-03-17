import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetPurchaseOrder,
    apiPutPurchaseOrder,
    apiDeletePurchaseOrders,
} from '@/services/PurchaseOrderService'

type PurchaseOrderData = {
    id?: string
    nomor_po?: string
    nama?: string
    tanggal_po?: string
    pabrik?: string
    harga?: number
    status?: string
    estimasi_pengerjaan?: string
    idProject?: string
}

export type MasterPurchaseOrderEditState = {
    loading: boolean
    purchaseOrderData: PurchaseOrderData
}

type GetPurchaseOrderResponse = PurchaseOrderData

export const SLICE_NAME = 'purchaseOrderEdit'

export const getPurchaseOrder = createAsyncThunk(
    SLICE_NAME + '/getPurchaseOrders',
    async (data: { id: string }) => {
        const response = await apiGetPurchaseOrder<
            GetPurchaseOrderResponse,
            { id: string }
        >(data)
        return response.data
    }
)

export const updatePurchaseOrder = async <T, U extends Record<string, unknown>>(
    data: U
) => {
    const response = await apiPutPurchaseOrder<T, U>(data)
    return response.data
}

export const deletePurchaseOrder = async <T, U extends Record<string, unknown>>(
    data: U
) => {
    const response = await apiDeletePurchaseOrders<T, U>(data)
    return response.data
}

const initialState: MasterPurchaseOrderEditState = {
    loading: true,
    purchaseOrderData: {},
}

const purchaseOrderEditSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPurchaseOrder.fulfilled, (state, action) => {
                state.purchaseOrderData = action.payload
                state.loading = false
            })
            .addCase(getPurchaseOrder.pending, (state) => {
                state.loading = true
            })
    },
})

export default purchaseOrderEditSlice.reducer
