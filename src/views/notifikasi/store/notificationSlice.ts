import {
    apiGetAllNotification,
    apiGetOneAndReadNotification,
    apiGetUnreadNotification,
} from '@/services/NotificationService'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

type GetAllNotifications = {
    id: string
    type: string
    pesan: string
    status_baca: boolean
    waktu_baca: string | null
    createdAt: string
    updatedAt: string
}

export type NotificationState = {
    loading: boolean
    unreadNotification: boolean
    loadingGetOne: boolean
    dataOneNotification: GetAllNotifications[]
    dataUnreadsNotification: GetAllNotifications[]
    loadingUnreadNotification: boolean
    dataNotification: GetAllNotifications[]
    error?: string | null
}

export const SLICE_NAME = 'notification'

export const getAllNotification = createAsyncThunk(
    SLICE_NAME + '/getAllNotification',
    async () => {
        const response = await apiGetAllNotification()

        console.log('res', res)
        return response.data
    }
)

export const getOneNotificationAndRead = createAsyncThunk(
    SLICE_NAME + '/getOneNotificationAndRead',
    async (data: any) => {
        const response: any = await apiGetOneAndReadNotification(data)

        return response.data
    }
)

export const getUnreadNotifiaction = createAsyncThunk(
    SLICE_NAME + '/getUnreadNotifiaction',
    async (data: any) => {
        const response: any = await apiGetUnreadNotification(data)

        return response.data
    }
)

const initialState: NotificationState = {
    loading: false,
    loadingGetOne: false,
    dataOneNotification: [],
    dataNotification: [],
    unreadNotification: false,
    error: null,
    dataUnreadsNotification: [],
    loadingUnreadNotification: false,
}

const notificationSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        setUnreadNotification: (state, action) => {
            state.unreadNotification = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllNotification.fulfilled, (state, action) => {
                state.dataNotification = action.payload
                state.loading = false
            })
            .addCase(getAllNotification.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getAllNotification.rejected, (state, action) => {
                state.loading = false
                state.error =
                    action.error.message || 'Failed to fetch notifications'
            })
            .addCase(getOneNotificationAndRead.fulfilled, (state, action) => {
                state.dataOneNotification = action.payload
                state.loadingGetOne = false
            })
            .addCase(getOneNotificationAndRead.pending, (state) => {
                state.loadingGetOne = true
                state.error = null
            })
            .addCase(getUnreadNotifiaction.fulfilled, (state, action) => {
                state.dataUnreadsNotification = action.payload
                state.loadingGetOne = false
            })
            .addCase(getUnreadNotifiaction.pending, (state) => {
                state.loadingUnreadNotification = true
                state.error = null
            })
            .addCase(getOneNotificationAndRead.rejected, (state, action) => {
                state.loadingGetOne = false
                state.error =
                    action.error.message || 'Failed to fetch notifications'
            })
    },
})

export const { setUnreadNotification } = notificationSlice.actions

export default notificationSlice.reducer
