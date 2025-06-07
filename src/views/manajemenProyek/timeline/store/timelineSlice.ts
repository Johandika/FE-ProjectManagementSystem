import { apiGetTimelines } from '@/services/TimelineService'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import { apiGetCrmCalendar } from '@/services/CrmService'

type Timeline = {
    id: string
    title: string
    start: string
    end?: string
    timelineColor: string
    groupId?: undefined
}

type Timelines = Timeline[]

type GetCrmCalendarResponse = Timelines

export type CalendarState = {
    loading: boolean
    timelineList: Timelines
    dialogOpen: boolean
    selected: {
        type: string
    } & Partial<Timeline>
}

export const SLICE_NAME = 'crmCalendar'

export const getTimelines = createAsyncThunk(
    SLICE_NAME + '/getTimelines',
    async (data) => {
        const response = await apiGetTimelines<GetCrmCalendarResponse>(data)

        return response.data
    }
)

const initialState: CalendarState = {
    loading: false,
    timelineList: [],
    dialogOpen: false,
    selected: {
        type: '',
    },
}

const calendarSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        updateTimeline: (state, action) => {
            state.timelineList = action.payload
        },
        openDialog: (state) => {
            state.dialogOpen = true
        },
        closeDialog: (state) => {
            state.dialogOpen = false
        },
        setSelected: (state, action) => {
            state.selected = action.payload
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getTimelines.fulfilled, (state, action) => {
            state.timelineList = action.payload
        })
    },
})

export const { updateTimeline, openDialog, closeDialog, setSelected } =
    calendarSlice.actions

export default calendarSlice.reducer
