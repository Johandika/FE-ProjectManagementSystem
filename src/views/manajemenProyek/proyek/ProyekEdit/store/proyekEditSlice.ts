import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    apiGetProyek,
    apiPutProyek,
    apiDeleteProyeks,
    apiGetKliens,
    apiGetBerkases,
    apiGetSubkontraktors,
} from '@/services/ProyekService'
import { extractNumberFromString } from '@/utils/extractNumberFromString'
import { apiGetTermin } from '@/services/TerminService'
import {
    apiGetFakturPajak,
    apiGetFakturPajakByProyek,
    apiPutFakturPajak,
} from '@/services/FakturPajakService'
import { apiSelectBerkas } from '@/services/BerkasService'
import {
    apiGetAllBerkasByProyek,
    apiGetAllBerkasByTerminId,
    apiUpdateStatusBerkasProyek,
} from '@/services/BerkasProyekService'
import {
    apiDeletePurchaseOrders,
    apiGetPurchaseByProyek,
} from '@/services/PurchaseOrderService'
import {
    apiGetKeterangan,
    apiGetKeterangans,
} from '@/services/KeteranganService'

export const SLICE_NAME = 'proyekEdit'

interface Termin {
    keterangan: string
    persen: number
}

interface Lokasi {
    id?: string
    lokasi: string
    longitude: number
    latitude: number
}

interface BerkasByTerminId {
    idProject?: string
    idTerminProject?: string
    berkas: string[]
}

interface Subkontraktor {
    id?: string
    nama?: string
    waktu_mulai_pelaksanaan?: string
    waktu_selesai_pelaksanaan?: string
    nilai_subkontrak?: number
    nomor_surat: string
    nama_vendor_subkon: string
    nilai_subkon: number
    waktu_pelaksanaan_kerja: string[]
    keterangan: string
}

interface ProyekData {
    id?: string
    pekerjaan?: string
    klien?: string
    pic?: string
    nomor_kontrak?: string
    tanggal_service_po?: string
    tanggal_delivery?: string
    tanggal_kontrak?: string
    nilai_kontrak?: number
    realisasi?: number
    progress?: number
    sisa_waktu?: number
    keterangan?: string
    idDivisi?: string
    timeline_awal?: string
    timeline_akhir?: string
    timeline?: number
    status?: string
    idUser?: string
    idClient?: string
    berkas?: string[]
    Lokasis?: Lokasi[]
    Client?: { id: string; nama: string }
    TerminProjects?: Termin[]
    BerkasProjects?: Berkas[]
    SubkonProjects?: Subkontraktor[]
    subkontraktor?: Subkontraktor[]
    KeteranganProjects?: KeteranganData[]
}

interface KeteranganData {
    id: string
    keterangan: string
    tanggal: string
    IdProject?: string
    createdAt?: string
    updatedAt?: string
}

type Klien = {
    id: string
    nama: string
    keterangan: string
}
type Berkas = {
    id: string
    nama: string
}

interface Termin {
    id?: string
    nama?: string
    idProject: string
    idFakturPajak?: string
    status?: boolean
}

interface getAllBerkasByProyekData {
    id?: string
    nama?: string
    keterangan?: string
    status?: boolean
    idTerminProject?: string | null
}

type FakturPajak = {
    id?: string
    nomor?: string
    nominal?: number
    tanggal?: string
}

interface PurchaseOrder {
    id: string
    nomor_po: string
    nama: string
    tanggal_po: string
    pabrik: string
    harga: number
    status: string
    estimasi_pengerjaan: number
    idProject: string
    createdAt: string
    updatedAt: string
}

type GetProyekResponse = ProyekData
type GetKeteranganResponse = KeteranganData[]
type Kliens = Klien[]
type Berkases = Berkas[]
type Subkontraktors = Subkontraktor[]
type Termins = Termin[]
type getAllBerkasByProyekDatas = getAllBerkasByProyekData[]
type BerkasesByTerminId = BerkasByTerminId[]

type GetKliensResponse = {
    data: Kliens
    total: number
}

type GetAllBerkasesByTerminIdResponse = {
    data: BerkasesByTerminId
    total: number
}

type GetBerkasesResponse = {
    data: Berkases
    total: number
}

type GetSubkontraktorsResponse = {
    data: Subkontraktors
    total: number
}
type SelectBerkas = {
    id: string
    nama: string
}

type GetPurchaseByProyekResponse = {
    statusCode: number
    message: string
    data: PurchaseOrder[]
    totaldataPurchase: number
    totalPage: number
}

export type MasterProyekEditState = {
    pekerjaanActive: string
    loading: boolean
    loadingKliens: boolean
    loadingBerkases: boolean
    loadingSubkontraktors: boolean
    loadingTermins: boolean
    loadingFakturPajak: boolean
    loadingSelectBerkas: boolean
    loadingKeterangans: boolean
    loadingKeterangan: boolean
    loadingPurchaseOrders: boolean
    loadingFakturPajakByProyekData: boolean
    updateBerkasStatus: boolean
    deleteConfirmationKeterangan: boolean
    selectedKeterangan: string
    proyekData: ProyekData
    loadingUpdateBerkasStatus: boolean
    loadingGetAllBerkasesByTermin: boolean
    getAllBerkasesByTerminIdData?: GetAllBerkasesByTerminIdResponse
    kliensData?: GetKliensResponse
    keterangansData?: GetKeteranganResponse
    keteranganData?: GetKeteranganResponse
    berkasesData?: GetBerkasesResponse
    subkontraktorsData?: GetSubkontraktorsResponse
    terminsData?: Termins
    getAllBerkasByProyekData?: getAllBerkasByProyekDatas
    loadingGetAllBerkasByProyek: boolean
    fakturPajakData?: FakturPajak[]
    fakturPajakByProyekData?: FakturPajak[]
    selectBerkasData?: SelectBerkas[]
    purchaseOrdersData: PurchaseOrder[]
}

// get proyeks
export const getProyek = createAsyncThunk(
    SLICE_NAME + '/getProyeks',
    async (data: { id: string }) => {
        const response = await apiGetProyek<GetProyekResponse, { id: string }>(
            data
        )
        return response.data
    }
)

// get all keterangans
export const getKeteranganByProject = createAsyncThunk(
    SLICE_NAME + '/getKeteranganByProject',
    async (data: { id: string }) => {
        const response = await apiGetKeterangans<
            GetKeteranganResponse,
            { id: string }
        >(data)
        return response.data
    }
)

// get keterangan
export const getKeterangan = createAsyncThunk(
    SLICE_NAME + '/getKeterangan',
    async (data: { id: string }) => {
        const response = await apiGetKeterangan<
            GetKeteranganResponse,
            { id: string }
        >(data)
        return response.data
    }
)

//kliens get
export const getKliens = createAsyncThunk(
    SLICE_NAME + '/getKliens',
    async () => {
        const response = await apiGetKliens<GetKliensResponse>()
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

//berkases get
export const getBerkases = createAsyncThunk(
    SLICE_NAME + '/getBerkases',
    async () => {
        const response = await apiGetBerkases<GetBerkasesResponse>()
        return response.data
    }
)

//subkontraktors get
export const getSubkontraktors = createAsyncThunk(
    SLICE_NAME + '/getSubkontraktors',
    async () => {
        const response = await apiGetSubkontraktors<GetSubkontraktorsResponse>()
        return response.data
    }
)

// get termin by id
export const getTermins = createAsyncThunk(
    SLICE_NAME + '/getTermins',
    async (data: { id: string }) => {
        const response = await apiGetTermin<Termin, { id: string }>(data)

        return response.data
    }
)

// get purchase by proyek id
export const getPurchaseByProyek = createAsyncThunk(
    SLICE_NAME + '/getPurchaseByProyek',
    async (data: { id: string }) => {
        const response = await apiGetPurchaseByProyek<
            GetPurchaseByProyekResponse,
            { id: string }
        >(data)

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

// get all faktur pajak by proyek id
export const getFakturPajakByProyekId = createAsyncThunk(
    SLICE_NAME + '/getFakturPajakByProyekId',
    async (data: { id: string }) => {
        const response = await apiGetFakturPajakByProyek<
            FakturPajak,
            { id: string }
        >(data)
        return response.data
    }
)

// get all berkases by termin id
export const getAllBerkasesByTermin = createAsyncThunk(
    SLICE_NAME + '/getAllBerkasesByTermin',
    async (data: { id: string }) => {
        const response = await apiGetAllBerkasByTerminId<
            FakturPajak,
            { id: string }
        >(data)
        return response.data
    }
)

// get all berkases by proyek
export const getAllBerkasByProyek = createAsyncThunk(
    SLICE_NAME + '/getAllBerkasByProyek',
    async (data: { id: string }) => {
        const response = await apiGetAllBerkasByProyek<
            FakturPajak,
            { id: string }
        >(data)
        return response.data
    }
)

// Tambahkan di file slice
export const updateBerkasProyekStatus = createAsyncThunk(
    SLICE_NAME + '/updateBerkasProyekStatus',
    async (data: { id: string; status: boolean }) => {
        const response = await apiUpdateStatusBerkasProyek<
            boolean,
            typeof data
        >(data)
        return response
    }
)

// Update faktur pajak
export const updateFakturPajak = async <T, U extends Record<string, unknown>>(
    data: U
) => {
    try {
        const response = await apiPutFakturPajak<T, U>(data)
        return response.data
    } catch (error: any) {
        // Tangkap error dan kembalikan dalam format yang konsisten
        if (error.response && error.response.data) {
            // Ekstrak pesan error dari respons
            const errorMessage = Array.isArray(error.response.data.message)
                ? error.response.data.message[0]
                : error.response.data.message || 'Terjadi kesalahan'

            return {
                statusCode: error.response.status || 400,
                message: errorMessage,
            }
        }

        // Jika tidak ada format error yang konsisten, gunakan format default
        return {
            statusCode: 500,
            message: 'Terjadi kesalahan pada server',
        }
    }
}

export const updateProyek = async <T, U extends Record<string, unknown>>(
    data: U
) => {
    // Buat salinan data dan pastikan nilai numerik
    const processedData = {
        ...data,
        nilai_kontrak: extractNumberFromString(
            data.nilai_kontrak as string | number
        ),
        timeline: extractNumberFromString(data.timeline as string | number),
        progress: extractNumberFromString(data.progress as string | number),
        realisasi: extractNumberFromString(data.realisasi as string | number),
        sisa_waktu: extractNumberFromString(data.sisa_waktu as string | number),
        termin: Array.isArray(data.termin)
            ? (
                  data.termin as Array<{
                      keterangan: string
                      persen: string | number
                  }>
              ).map((item) => ({
                  keterangan: item.keterangan,
                  persen: extractNumberFromString(item.persen),
              }))
            : data.termin,
    }

    const response = await apiPutProyek<T, U>(processedData)
    return response.data
}

export const deleteProyek = async <T, U extends Record<string, unknown>>(
    data: U
) => {
    const response = await apiDeleteProyeks<T, U>(data)
    return response.data
}

export const deletePurchase = async <T, U extends Record<string, unknown>>(
    data: U
) => {
    const response = await apiDeletePurchaseOrders<T, U>(data)
    return response.data
}

export const setPekerjaanActive = createAsyncThunk(
    SLICE_NAME + '/setPekerjaanActive',
    async (pekerjaan: string) => {
        return pekerjaan
    }
)

const initialState: MasterProyekEditState = {
    pekerjaanActive: '',
    loading: true,
    loadingKliens: true,
    loadingBerkases: true,
    loadingSubkontraktors: true,
    loadingTermins: true,
    loadingSelectBerkas: true,
    loadingFakturPajak: true,
    loadingPurchaseOrders: true,
    loadingKeterangans: true,
    loadingKeterangan: true,
    loadingFakturPajakByProyekData: true,
    loadingGetAllBerkasByProyek: true,
    loadingGetAllBerkasesByTermin: true,
    deleteConfirmationKeterangan: false,
    selectedKeterangan: '',
    terminsData: [],
    keterangansData: [],
    keteranganData: [],
    getAllBerkasByProyekData: [],
    selectBerkasData: [],
    getAllBerkasesByTerminIdData: [],
    proyekData: {},
    fakturPajakData: [],
    fakturPajakByProyekData: [],
    purchaseOrdersData: [],
}

const proyekEditSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        toggleDeleteConfirmationKeterangan: (state, action) => {
            state.deleteConfirmationKeterangan = action.payload
        },
        setSelectedKeterangan: (state, action) => {
            state.selectedKeterangan = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(setPekerjaanActive.fulfilled, (state, action) => {
                state.pekerjaanActive = action.payload
            })
            .addCase(getProyek.fulfilled, (state, action) => {
                state.proyekData = action.payload
                state.loading = false
            })
            .addCase(getProyek.pending, (state) => {
                state.loading = true
            })
            .addCase(getKeteranganByProject.fulfilled, (state, action) => {
                state.keterangansData = action.payload
                state.loadingKeterangans = false
            })
            .addCase(getKeteranganByProject.pending, (state) => {
                state.loadingKeterangans = true
            })
            .addCase(getKeterangan.fulfilled, (state, action) => {
                state.keteranganData = action.payload
                state.loadingKeterangan = false
            })
            .addCase(getKeterangan.pending, (state) => {
                state.loadingKeterangan = true
            })
            .addCase(getTermins.fulfilled, (state, action) => {
                state.terminsData = action.payload
                state.loadingTermins = false
            })
            .addCase(getTermins.pending, (state) => {
                state.loadingTermins = true
            })
            .addCase(getAllBerkasByProyek.fulfilled, (state, action) => {
                state.getAllBerkasByProyekData = action.payload
                state.loadingGetAllBerkasByProyek = false
            })
            .addCase(getAllBerkasByProyek.pending, (state) => {
                state.loadingGetAllBerkasByProyek = true
            })
            .addCase(updateBerkasProyekStatus.fulfilled, (state, action) => {
                state.updateBerkasStatus = action.payload
                state.loadingTermins = false
            })
            .addCase(updateBerkasProyekStatus.pending, (state) => {
                state.loadingUpdateBerkasStatus = true
            })
            .addCase(selectBerkas.fulfilled, (state, action) => {
                state.selectBerkasData = action.payload
                state.loadingSelectBerkas = false
            })
            .addCase(selectBerkas.pending, (state) => {
                state.loadingSelectBerkas = true
            })
            .addCase(getFakturPajak.fulfilled, (state, action) => {
                state.fakturPajakData = action.payload
                state.loadingFakturPajak = false
            })
            .addCase(getFakturPajak.pending, (state) => {
                state.loadingFakturPajak = true
            })
            .addCase(getFakturPajakByProyekId.fulfilled, (state, action) => {
                state.fakturPajakByProyekData = action.payload
                state.loadingFakturPajakByProyekData = false
            })
            .addCase(getFakturPajakByProyekId.pending, (state) => {
                state.loadingFakturPajakByProyekData = true
            })
            .addCase(getAllBerkasesByTermin.fulfilled, (state, action) => {
                state.getAllBerkasesByTerminIdData = action.payload
                state.loadingGetAllBerkasesByTermin = false
            })
            .addCase(getAllBerkasesByTermin.pending, (state) => {
                state.loadingGetAllBerkasesByTermin = true
            })
            .addCase(getKliens.fulfilled, (state, action) => {
                state.kliensData = action.payload
                state.loadingKliens = false
            })
            .addCase(getKliens.pending, (state) => {
                state.loadingKliens = true
            })
            .addCase(getBerkases.fulfilled, (state, action) => {
                state.berkasesData = action.payload
                state.loadingBerkases = false
            })
            .addCase(getBerkases.pending, (state) => {
                state.loadingBerkases = true
            })
            .addCase(getSubkontraktors.fulfilled, (state, action) => {
                state.subkontraktorsData = action.payload
                state.loadingSubkontraktors = false
            })
            .addCase(getSubkontraktors.pending, (state) => {
                state.loadingSubkontraktors = true
            })
            // handle Purchaseby Proyek
            .addCase(getPurchaseByProyek.fulfilled, (state, action) => {
                state.purchaseOrdersData = action.payload
                state.loadingPurchaseOrders = false
            })
            .addCase(getPurchaseByProyek.pending, (state) => {
                state.loadingPurchaseOrders = true
            })
            .addCase(getPurchaseByProyek.rejected, (state) => {
                state.loadingPurchaseOrders = false
                state.purchaseOrdersData = [] // Reset to empty array on error
            })
    },
})

export const { toggleDeleteConfirmationKeterangan, setSelectedKeterangan } =
    proyekEditSlice.actions

export default proyekEditSlice.reducer
