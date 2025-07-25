// File ini menangani operasi terkait daftar produk dalam aplikasi, termasuk memuat data produk, menghapus produk, dan mengelola status loading dan filter.

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { TableProyekQueries } from '@/@types/common'
import {
    apiDeleteProyeks,
    apiGetKliens,
    apiGetProyeks,
} from '@/services/ProyekService'

export const SLICE_NAME = 'proyekList'

type Proyek = {
    id: string
    pekerjaan: string
    pic: string
    idKlien: string
    nomor_kontrak: string
    tanggal_service_po: string
    tanggal_delivery: string
    nilai_kontrak: number
    realisasi: number
    progress: number
    status: string
    sisa_waktu?: number
    keterangan?: string
    idUser?: string
    berkas?: string[]
    lokasi?: string[]
    termin?: { keterangan: string; persen: number }[]
}

type Klien = {
    id?: string
    nama?: string
    keterangan?: string
}

type Proyeks = Proyek[]
type Kliens = Klien[]

type GetMasterProyekResponse = {
    data: Proyeks
    total: number
}

type GetMasterKlienResponse = {
    statusCode: number
    message: string
    data: Kliens
    totaldataClient: number
    totalPage: number
}

type FilterQueries = {
    order: string | null
    progress: number | null
    idClient?: string
    idDivisi?: string
}

export type ProyekListSlice = {
    loading: boolean
    kliensLoading: boolean
    deleteConfirmation: boolean
    updateConfirmation: boolean
    selectedProyek: string
    projectStatus: string
    tableData: TableProyekQueries
    filterData: FilterQueries
    proyekList: Proyek[]
    kliensList: Klien[]
}

// type GetMasterKlienData = TableProyekQueries & { filterData?: FilterQueries }
type GetMasterProyekData = TableProyekQueries & { filterData?: FilterQueries }

export const getProyeks = createAsyncThunk(
    SLICE_NAME + '/getProyeks',
    async (data: GetMasterProyekData) => {
        const response = await apiGetProyeks<
            GetMasterProyekResponse,
            GetMasterProyekData
        >(data)
        return {
            data: response.data,
            total: response.data.totaldataProject, // Simpan total data dari API baru
            totalPage: response.data.totalPage, // Opsional jika Anda perlu totalPage
        }
    }
)

export const getKliens = createAsyncThunk(
    SLICE_NAME + '/getKliens',
    async (data: GetMasterKlienData) => {
        const response = await apiGetKliens<
            GetMasterKlienResponse,
            GetMasterKlienData
        >(data)
        // return response.data
        return {
            data: response.data.data,
            total: response.data.totaldataClient,
            totalPage: response.data.totalPage,
        }
    }
)

export const deleteProyek = async (data: { id: string | string[] }) => {
    const response = await apiDeleteProyeks<boolean, { id: string | string[] }>(
        data
    )
    return response.data
}

export const initialTableData: TableProyekQueries = {
    total: 0,
    pageIndex: 1, // page aktif
    pageSize: 10, // total ata per page
    query: '', // search query
    filterData: {
        order: '',
        progress: 0,
    },
}

const initialState: ProyekListSlice = {
    loading: false,
    kliensLoading: false,
    deleteConfirmation: false,
    updateConfirmation: false,
    selectedProyek: '',
    projectStatus: '',
    proyekList: [],
    kliensList: [],
    tableData: initialTableData,
    filterData: {
        order: null,
        progress: null,
    },
}

const proyekListSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        updateProyekList: (state, action) => {
            state.proyekList = action.payload
        },
        updateKliensList: (state, action) => {
            state.kliensList = action.payload
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
        toggleUpdateConfirmation: (state, action) => {
            state.updateConfirmation = action.payload
        },
        setSelectedProyek: (state, action) => {
            state.selectedProyek = action.payload
        },
        setProjectStatus: (state, action) => {
            state.projectStatus = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProyeks.fulfilled, (state, action) => {
                state.proyekList = action.payload.data
                state.tableData.total = action.payload.data.totaldataProject
                state.tableData.totalPage = action.payload.data.totalPage
                state.loading = false
            })
            .addCase(getProyeks.pending, (state) => {
                state.loading = true
            })
            .addCase(getKliens.fulfilled, (state, action) => {
                state.kliensList = action.payload.data
                state.kliensLoading = false
            })
            .addCase(getKliens.pending, (state) => {
                state.kliensLoading = true
            })
    },
})

export const {
    updateProyekList,
    setTableData,
    setFilterData,
    toggleDeleteConfirmation,
    toggleUpdateConfirmation,
    setSelectedProyek,
    setProjectStatus,
    updateKliensList,
} = proyekListSlice.actions

export default proyekListSlice.reducer
