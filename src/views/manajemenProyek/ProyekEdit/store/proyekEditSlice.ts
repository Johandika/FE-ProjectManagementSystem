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
import { apiGetFakturPajak } from '@/services/FakturPajakService'

export const SLICE_NAME = 'proyekEdit'

interface Termin {
    keterangan: string
    persen: number
}

interface Lokasi {
    nama: string
    longitude: number
    latitude: number
}

interface Subkontraktor {
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
    status?: string
    idUser?: string
    idKlien?: string
    berkas?: string[]
    lokasi?: Lokasi[]
    termin?: Termin[]
    subkontraktor?: Subkontraktor[]
}

// interface BerkasProyekData {
//     id?: string
//     nama?: string
//     idProject?: string
//     idBerkas?: string
//     status?: boolean
// }

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

type FakturPajak = {
    id?: string
    nomor?: string
    nominal?: number
    tanggal?: string
}

type GetProyekResponse = ProyekData
type Kliens = Klien[]
type Berkases = Berkas[]
type Subkontraktors = Subkontraktor[]
type Termins = Termin[]
// type GetBerkasProyekResponse = BerkasProyekData[]

type GetKliensResponse = {
    data: Kliens
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

export type MasterProyekEditState = {
    loading: boolean
    loadingKliens: boolean
    loadingBerkases: boolean
    loadingSubkontraktors: boolean
    loadingTermins: boolean
    loadingFakturPajak: boolean
    proyekData: ProyekData
    kliensData?: GetKliensResponse
    berkasesData?: GetBerkasesResponse
    subkontraktorsData?: GetSubkontraktorsResponse
    terminsData?: Termins
    fakturPajakData?: FakturPajak[]
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

//kliens get
export const getKliens = createAsyncThunk(
    SLICE_NAME + '/getKliens',
    async () => {
        const response = await apiGetKliens<GetKliensResponse>()
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

// get by id
export const getFakturPajak = createAsyncThunk(
    SLICE_NAME + '/getFakturPajak',
    async (data: { id: string }) => {
        const response = await apiGetFakturPajak<FakturPajak, { id: string }>(
            data
        )
        console.log('id', data)
        return response.data
    }
)

export const updateProyek = async <T, U extends Record<string, unknown>>(
    data: U
) => {
    // Buat salinan data dan pastikan nilai numerik
    // Buat salinan data dan pastikan nilai numerik
    const processedData = {
        ...data,
        nilai_kontrak: extractNumberFromString(
            data.nilai_kontrak as string | number
        ),
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

const initialState: MasterProyekEditState = {
    loading: true,
    loadingKliens: true,
    loadingBerkases: true,
    loadingSubkontraktors: true,
    loadingTermins: true,
    loadingFakturPajak: true,
    terminsData: [],
    // loadingBerkasProyeks: true,
    // berkasProyekData: [],
    proyekData: {},
    fakturPajakData: [],
}

const proyekEditSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProyek.fulfilled, (state, action) => {
                state.proyekData = action.payload
                state.loading = false
            })
            .addCase(getProyek.pending, (state) => {
                state.loading = true
            })
            .addCase(getTermins.fulfilled, (state, action) => {
                state.terminsData = action.payload
                state.loadingTermins = false
            })
            .addCase(getTermins.pending, (state) => {
                state.loadingTermins = true
            })
            .addCase(getFakturPajak.fulfilled, (state, action) => {
                state.fakturPajakData = action.payload
                state.loadingFakturPajak = false
            })
            .addCase(getFakturPajak.pending, (state) => {
                state.loadingFakturPajak = true
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
    },
})

export default proyekEditSlice.reducer
