import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetAllKeteranganTender,
    apiGetOneKeteranganTender,
} from '@/services/TenderService'

export const SLICE_NAME = 'tenderDetail'

type keteranganTender = {
    id: string
    tanggal: string
    keterangan: string
    idProject: string
    idTender: string
}

type KeteranganTenders = keteranganTender[]

export type MasterTenderDetailState = {
    loadingGetAllKeteranganTender: boolean
    loadingGetOneKeteranganTender: boolean
    keterangansTenderData: keteranganTender[]
    keteranganTenderData: keteranganTender[]
    deleteConfirmationOpen: boolean
    selectedKeterangan: string
}

// get keterangans by termin id
export const getKeterangansTender = createAsyncThunk(
    SLICE_NAME + '/getKeterangansTender',
    async (data: { id: string }) => {
        const response = await apiGetAllKeteranganTender<
            KeteranganTenders,
            { id: string }
        >(data)
        return response.data
    }
)

// get one item
export const getKeteranganTender = createAsyncThunk(
    SLICE_NAME + '/getKeteranganTender',
    async (data: { id: string }) => {
        const response = await apiGetOneKeteranganTender<
            keteranganTender,
            { id: string }
        >(data)
        return response.data
    }
)

const initialState: MasterTenderDetailState = {
    loadingGetAllKeteranganTender: false,
    loadingGetOneKeteranganTender: false,
    keterangansTenderData: [],
    keteranganTenderData: [],
    deleteConfirmationOpen: false,
    selectedKeterangan: '',
}

const tenderDetailSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        toggleDeleteConfirmationKeterangan: (state, action) => {
            state.deleteConfirmationOpen = action.payload
        },
        setSelectedKeterangan: (state, action) => {
            state.selectedKeterangan = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getKeterangansTender.fulfilled, (state, action) => {
                state.keterangansTenderData = action.payload
                state.loadingGetAllKeteranganTender = false
            })
            .addCase(getKeterangansTender.pending, (state) => {
                state.loadingGetAllKeteranganTender = true
            })
            .addCase(getKeteranganTender.fulfilled, (state, action) => {
                state.keteranganTenderData = action.payload
                state.loadingGetOneKeteranganTender = false
            })
            .addCase(getKeteranganTender.pending, (state) => {
                state.loadingGetOneKeteranganTender = true
            })
    },
})

export const { toggleDeleteConfirmationKeterangan, setSelectedKeterangan } =
    tenderDetailSlice.actions

export default tenderDetailSlice.reducer
