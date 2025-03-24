// File ini menangani operasi terkait daftar produk dalam aplikasi, termasuk memuat data produk, menghapus produk, dan mengelola status loading dan filter.

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { TableQueries } from '@/@types/common'
import {
    apiDeleteProyeks,
    apiGetProyeks,
    apiGetKliens,
} from '@/services/ProyekService'

type Proyek = {
    id: string
    pekerjaan: string
    pic: string
    idKlien: string
    nomor_spk: string
    nomor_spo: string
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

type GetKliensResponse = {
    data: Kliens
    total: number
}

type FilterQueries = {
    name: string
    category: string[]
    status: number[]
    proyekStatus: number
}

export type ProyekListSlice = {
    loading: boolean
    kliensLoading: boolean
    deleteConfirmation: boolean
    selectedProyek: string
    tableData: TableQueries
    filterData: FilterQueries
    proyekList: Proyek[]
    kliensList: Klien[]
}

type GetMasterProyekData = TableQueries & { filterData?: FilterQueries }

export const SLICE_NAME = 'proyekList'

export const getProyeks = createAsyncThunk(
    SLICE_NAME + '/getProyeks',
    async (data: GetMasterProyekData) => {
        const response = await apiGetProyeks<
            GetMasterProyekResponse,
            GetMasterProyekData
        >(data)
        return response.data
    }
)

export const getKliens = createAsyncThunk(
    SLICE_NAME + '/getKliens',
    async () => {
        const response = await apiGetKliens<GetKliensResponse>()
        return response.data
    }
)

export const deleteProyek = async (data: { id: string | string[] }) => {
    const response = await apiDeleteProyeks<boolean, { id: string | string[] }>(
        data
    )
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

const initialState: ProyekListSlice = {
    loading: false,
    kliensLoading: false,
    deleteConfirmation: false,
    selectedProyek: '',
    proyekList: [],
    kliensList: [],
    tableData: initialTableData,
    filterData: {
        name: '',
        category: ['bags', 'cloths', 'devices', 'shoes', 'watches'],
        status: [0, 1, 2],
        proyekStatus: 0,
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
        setSelectedProyek: (state, action) => {
            state.selectedProyek = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProyeks.fulfilled, (state, action) => {
                state.proyekList = action.payload.data
                state.tableData.total = action.payload.total
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
    setSelectedProyek,
    updateKliensList,
} = proyekListSlice.actions

export default proyekListSlice.reducer
