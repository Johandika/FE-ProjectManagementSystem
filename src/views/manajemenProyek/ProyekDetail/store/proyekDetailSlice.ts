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
import {
    apiGetAdendum,
    apiGetAdendumsByProyek,
} from '@/services/AdendumService'
import { apiGetItem, apiGetItemsByProyek } from '@/services/ItemService'

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

type AdendumByProyek = {
    id: string
    dasar_adendum: string
    nilai_adendum: number
    nilai_sebelum_adendum: number
    tanggal: string
    idProject: string
    idUser: string
    status: string
}

type ItemProject = {
    id: string
    uraian: string
    satuan: string
    volume: number
    harga_satuan_materia: number
    harga_satuan_jasa: number
    jumlah_harga_material: number
    jumlah_harga_jasa: number
    status: string | null
}

type ItemByProyek = {
    id: string
    nama: string
    keterangan: string
    status: boolean
    DetailItemProjects: ItemProject[]
}

type BerkasProyeks = BerkasProyekData[]
type LokasiProyeks = LokasisByProyek[]
type SubkonProyek = SubkonByProyek[]
type AdendumProyek = AdendumByProyek[]
type ItemProyek = ItemByProyek[]
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
    loadingAdendumsByProyek: boolean
    loadingAdendum: boolean
    loadingItemsByProyek: boolean
    loadingItem: boolean
    itemsByProyekData?: ItemProyek
    itemData?: ItemProyek
    adendumsByProyekData?: AdendumProyek
    adendumData?: AdendumProyek
    berkasProyekData?: BerkasProyeks
    lokasiData?: LokasiProyeks
    lokasisByProyekData?: LokasiProyeks
    berkasFakturPajaks?: FakturPajak[]
    selectBerkasData?: SelectBerkas[]
    subkonByProyekData: SubkonProyek
    subkonProyekData: SubkonProyek
    subkontraktorsData?: Subkontraktors
}

// get items by project
export const getItemsByProyek = createAsyncThunk(
    SLICE_NAME + '/getItemsByProyek',
    async (data: { id: string }) => {
        const response = await apiGetItemsByProyek<ItemProyek, { id: string }>(
            data
        )
        return response.data
    }
)

// get one item
export const getItem = createAsyncThunk(
    SLICE_NAME + '/getItem',
    async (data: { id: string }) => {
        const response = await apiGetItem<ItemProyek, { id: string }>(data)
        return response.data
    }
)

// ========================================================================

// get adendums by project
export const getAdendumsByProyek = createAsyncThunk(
    SLICE_NAME + '/getAdendumsByProyek',
    async (data: { id: string }) => {
        const response = await apiGetAdendumsByProyek<
            AdendumProyek,
            { id: string }
        >(data)
        return response.data
    }
)

// get adendum
export const getAdendum = createAsyncThunk(
    SLICE_NAME + '/getAdendum',
    async (data: { id: string }) => {
        const response = await apiGetAdendum<AdendumProyek, { id: string }>(
            data
        )
        return response.data
    }
)

// ========================================================================

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
    loadingAdendumsByProyek: true,
    loadingAdendum: true,
    loadingItemsByProyek: true,
    loadingItem: true,
    lokasisByProyekData: [],
    lokasiData: [],
    itemsByProyekData: [],
    itemData: [],
    selectBerkasData: [],
    berkasProyekData: [],
    adendumsByProyekData: [],
    adendumData: [],
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
            .addCase(getAdendumsByProyek.fulfilled, (state, action) => {
                state.adendumsByProyekData = action.payload
                state.loadingAdendumsByProyek = false
            })
            .addCase(getAdendumsByProyek.pending, (state) => {
                state.loadingAdendumsByProyek = true
            })
            .addCase(getItemsByProyek.fulfilled, (state, action) => {
                state.itemsByProyekData = action.payload
                state.loadingItemsByProyek = false
            })
            .addCase(getItemsByProyek.pending, (state) => {
                state.loadingItemsByProyek = true
            })
            .addCase(getItem.fulfilled, (state, action) => {
                state.itemData = action.payload
                state.loadingItem = false
            })
            .addCase(getItem.pending, (state) => {
                state.loadingItem = true
            })
            .addCase(getAdendum.fulfilled, (state, action) => {
                state.adendumData = action.payload
                state.loadingAdendum = false
            })
            .addCase(getAdendum.pending, (state) => {
                state.loadingAdendum = true
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
