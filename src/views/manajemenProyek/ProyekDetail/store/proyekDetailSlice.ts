import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetBerkasProyek,
    apiPutBerkasProyek,
} from '@/services/BerkasProyekService'
import {
    apiGetFakturPajak,
    apiGetFakturPajakByProyek,
} from '@/services/FakturPajakService'
import { apiSelectBerkas } from '@/services/BerkasService'
import { apiGetLokasi, apiGetLokasisByProyek } from '@/services/LokasiService'
import {
    apiGetSubkontraktors,
    apiGetSubkontraktorsByProject,
} from '@/services/SubkontraktorService'

export const SLICE_NAME = 'proyekDetail'

interface BerkasProyekData {
    id?: string
    nama?: string
    idProject?: string
    idBerkas?: string
    status?: boolean
}
interface LokasiData {
    nama?: string
    latitude?: string
    longitude?: string
}

type FakturPajak = {
    id: string
    nomor: string
    nominal: number
    tanggal: string
    keterangan: string
    status: string
}

type LokasisByProyek = {
    id: string
    lokasi: string
    latitude: number
    longitude: string
    idProject: string
}

type SelectBerkas = {
    id: string
    nama: string
}

type SubkonByProyek = {
    id: string
    nama: string
    nomor_surat: string
    nilai_subkontrak: number
    waktu_mulai_pelaksanaan: string
    waktu_selesai_pelaksanaan: string
    keterangan: string
    idProject: string
    idSubkon: string
}

type BerkasProyeks = BerkasProyekData[]
type LokasiProyeks = LokasisByProyek[]
type SubkonProyek = SubkonByProyek[]
type Subkontraktors = SubkonByProyek[]

export type MasterProyekDetailState = {
    loadingBerkasProyeks: boolean
    loadingFakturPajaks: boolean
    loadingSelectBerkas: boolean
    loadingLokasiProyeks: boolean
    loadingLokasi: boolean
    loadingSubkonsByProyek: boolean
    loadingSubkonProyek: boolean
    loadingSubkontraktors: boolean
    berkasProyekData?: BerkasProyeks
    lokasiData?: LokasiProyeks
    lokasisByProyekData?: LokasiProyeks
    berkasFakturPajaks?: FakturPajak[]
    selectBerkasData?: SelectBerkas[]
    subkonByProyekData: SubkonProyek
    subkonProyekData: SubkonProyek
    subkontraktorsData?: Subkontraktors
}

// get subkopntraktors by project
export const getSubkonsByProyek = createAsyncThunk(
    SLICE_NAME + '/getSubkonsByProyek',
    async (data: { id: string }) => {
        const response = await apiGetSubkontraktorsByProject<
            SubkonProyek,
            { id: string }
        >(data)
        return response.data
    }
)

// get all subkopntraktors
export const getSubkontraktors = createAsyncThunk(
    SLICE_NAME + '/getSubkontraktors',
    async () => {
        const response = await apiGetSubkontraktors<SubkonProyek>()
        return response.data
    }
)

// get one subkopntraktor by project
export const getSubkonProyek = createAsyncThunk(
    SLICE_NAME + '/getSubkonProyek',
    async (data: { id: string }) => {
        const response = await apiGetSubkontraktorsByProject<
            SubkonProyek,
            { id: string }
        >(data)
        return response.data
    }
)

// ========================================================================

// get berkasProyek by id
export const getBerkasProyek = createAsyncThunk(
    SLICE_NAME + '/getBerkasProyek',
    async (data: { id: string }) => {
        const response = await apiGetBerkasProyek<
            BerkasProyeks,
            { id: string }
        >(data)
        return response.data
    }
)

// get all select berkas
export const selectBerkas = createAsyncThunk(
    SLICE_NAME + '/selectBerkas',
    async () => {
        const response = await apiSelectBerkas<SelectBerkas[]>()
        return response.data
    }
)

// get all lokasi by proyek
export const getLokasisByProyek = createAsyncThunk(
    SLICE_NAME + '/getLokasisByProyek',
    async (data: { id: string }) => {
        const response = await apiGetLokasisByProyek<
            LokasisByProyek,
            { id: string }
        >(data)
        return response
    }
)

// get one lokasi by id
export const getLokasi = createAsyncThunk(
    SLICE_NAME + '/getLokasi',

    async (data: { id: string }) => {
        const response = await apiGetLokasi<LokasisByProyek, { id: string }>(
            data
        )
        return response.data
    }
)

// update lokasi
export const updateLokasi = createAsyncThunk(
    SLICE_NAME + '/updateLokasi',

    async (data: LokasiData) => {
        const response = await apiGetLokasi<LokasisByProyek, BerkasProyekData>(
            data
        )
        return response.data
    }
)

// get by id
export const getFakturPajak = createAsyncThunk(
    SLICE_NAME + '/getFakturPajak',

    async (data: { id: string }) => {
        const response = await apiGetFakturPajak<FakturPajak, { id: string }>(
            data
        )
        return response.data
    }
)

// update berkasProyek
// Tambahkan thunk untuk update berkas proyek
export const updateBerkasProyekStatus = createAsyncThunk(
    SLICE_NAME + '/updateBerkasProyekStatus',
    async (data: BerkasProyekData) => {
        const response = await apiPutBerkasProyek<any, BerkasProyekData>(data)
        return response.data
    }
)

const initialState: MasterProyekDetailState = {
    loadingBerkasProyeks: true,
    loadingFakturPajaks: true,
    loadingSelectBerkas: true,
    loadingLokasiProyeks: true,
    loadingLokasi: true,
    loadingSubkonsByProyek: true,
    loadingSubkonProyek: true,
    loadingSubkontraktors: true,
    lokasisByProyekData: [],
    lokasiData: [],
    selectBerkasData: [],
    berkasProyekData: [],
    berkasFakturPajaks: [],
    subkonByProyekData: [],
    subkonProyekData: [],
}

const proyekDetailSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getBerkasProyek.fulfilled, (state, action) => {
                state.berkasProyekData = action.payload
                state.loadingBerkasProyeks = false
            })
            .addCase(getBerkasProyek.pending, (state) => {
                state.loadingBerkasProyeks = true
            })
            .addCase(getLokasisByProyek.fulfilled, (state, action) => {
                state.lokasisByProyekData = action.payload
                state.loadingLokasiProyeks = false
            })
            .addCase(getLokasisByProyek.pending, (state) => {
                state.loadingLokasiProyeks = true
            })
            .addCase(getLokasisByProyek.rejected, (state) => {
                state.loadingLokasiProyeks = false
                state.lokasisByProyekData = [] // Reset to empty array on error
            })
            .addCase(getLokasi.fulfilled, (state, action) => {
                state.lokasiData = action.payload
                state.loadingLokasi = false
            })
            .addCase(getLokasi.pending, (state) => {
                state.loadingLokasi = true
            })
            .addCase(getLokasi.rejected, (state) => {
                state.loadingLokasi = false
                state.lokasiData = [] // Reset to empty array on error
            })
            .addCase(getSubkonsByProyek.fulfilled, (state, action) => {
                state.subkonByProyekData = action.payload
                state.loadingSubkonsByProyek = false
            })
            .addCase(getSubkonsByProyek.pending, (state) => {
                state.loadingSubkonsByProyek = true
            })
            .addCase(getSubkonsByProyek.rejected, (state) => {
                state.loadingSubkonsByProyek = false
                state.subkonByProyekData = [] // Reset to empty array on error
            })
            .addCase(getSubkontraktors.fulfilled, (state, action) => {
                state.subkontraktorsData = action.payload
                state.loadingSubkontraktors = false
            })
            .addCase(getSubkontraktors.pending, (state) => {
                state.loadingSubkontraktors = true
            })
            .addCase(getSubkonProyek.fulfilled, (state, action) => {
                state.subkonProyekData = action.payload
                state.loadingSubkonProyek = false
            })
            .addCase(getSubkonProyek.pending, (state) => {
                state.loadingSubkonProyek = true
            })
            .addCase(getSubkonProyek.rejected, (state) => {
                state.loadingSubkonProyek = false
                state.subkonProyekData = [] // Reset to empty array on error
            })
            .addCase(selectBerkas.fulfilled, (state, action) => {
                state.selectBerkasData = action.payload
                state.loadingSelectBerkas = false
            })
            .addCase(selectBerkas.pending, (state) => {
                state.loadingSelectBerkas = true
            })
            .addCase(getFakturPajak.fulfilled, (state, action) => {
                state.berkasProyekData = action.payload
                state.loadingFakturPajaks = false
            })
            .addCase(getFakturPajak.pending, (state) => {
                state.loadingFakturPajaks = true
            })
            // Tambahkan case untuk update berkas
            .addCase(updateBerkasProyekStatus.fulfilled, (state, action) => {
                // Update item di array berkasProyekData
                const updated = action.payload
                const index = state.berkasProyekData?.findIndex(
                    (item) => item.id === updated.id
                )
                if (index !== -1) {
                    state.berkasProyekData[index] = updated
                }
            })
    },
})

export default proyekDetailSlice.reducer
