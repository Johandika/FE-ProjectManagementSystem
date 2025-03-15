import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes = [
    {
        key: 'apps.dashboard',
        path: '/dashboard',
        component: lazy(() => import('@/views/Dashboard')),
        authority: [],
    },
    {
        key: 'apps.manajemenProyek',
        path: '/manajemen-proyek',
        component: lazy(
            () =>
                import(
                    '@/views/manajemenProyek/ManajemenProyekList/ManajemenProyekList'
                )
        ),
        authority: [],
    },
    {
        key: 'apps.purchaseOrder',
        path: '/manajemen-pengadaan/purchase-order',
        component: lazy(
            () => import('@/views/manajemenPengadaan/PurchaseOrder')
        ),
        authority: [],
    },
    {
        key: 'apps.subkontraktor',
        path: '/manajemen-pengadaan/subkontraktor',
        component: lazy(
            () => import('@/views/manajemenPengadaan/Subkontraktor')
        ),
        authority: [],
    },
    {
        key: 'apps.terminPembayaran',
        path: '/manajemen-keuangan/termin-pembayaran',
        component: lazy(
            () => import('@/views/manajemenKeuangan/TerminPembayaran')
        ),
        authority: [],
    },
    {
        key: 'apps.fakturPajak',
        path: '/manajemen-keuangan/faktur-pajak',
        component: lazy(() => import('@/views/manajemenKeuangan/FakturPajak')),
        authority: [],
    },
    {
        key: 'apps.beritaAcara',
        path: '/manajemen-dokumen/berita-acara',
        component: lazy(() => import('@/views/manajemenDokumen/BeritaAcara')),
        authority: [],
    },
    {
        key: 'apps.kelengkapanBerkas',
        path: '/manajemen-dokumen/kelengkapan-berkas',
        component: lazy(
            () => import('@/views/manajemenDokumen/KelengkapanBerkas')
        ),
        authority: [],
    },
    {
        key: 'apps.klien',
        path: '/master/klien',
        component: lazy(() => import('@/views/master/Klien/KlienList')),
        authority: [],
    },
    {
        key: 'apps.klien',
        path: '/master/klien-edit/:klienId',
        component: lazy(() => import('@/views/master/Klien/KlienEdit')),
        authority: [],
        meta: {
            header: 'Ubah Klien',
        },
    },
    {
        key: 'apps.klien',
        path: '/master/klien-new',
        component: lazy(() => import('@/views/master/Klien/KlienNew')),
        authority: [],
        meta: {
            header: 'Tambah Klien',
        },
    },
    {
        key: 'apps.berkas',
        path: '/master/berkas',
        component: lazy(() => import('@/views/master/Berkas/BerkasList')),
        authority: [],
    },
    {
        key: 'apps.berkas',
        path: '/master/berkas-edit/:berkasId',
        component: lazy(() => import('@/views/master/Berkas/BerkasEdit')),
        authority: [],
        meta: {
            header: 'Ubah Berkas',
        },
    },
    {
        key: 'apps.berkas',
        path: '/master/berkas-new',
        component: lazy(() => import('@/views/master/Berkas/BerkasNew')),
        authority: [],
        meta: {
            header: 'Tambah Berkas',
        },
    },
    {
        key: 'settings.pengaturanPengguna',
        path: '/pengaturan/pengguna',
        component: lazy(() => import('@/views/pengaturan/Pengguna')),
        authority: [],
    },
    {
        key: 'settings.pengaturanPeran',
        path: '/pengaturan/peran',
        component: lazy(() => import('@/views/pengaturan/Peran')),
        authority: [],
    },
    {
        key: 'appsSales.productNew',
        path: `manajemen-proyek/tambah-proyek`,
        component: lazy(
            () => import('@/views/manajemenProyek/TambahProyek/TambahProyek')
        ),
        authority: [],
        meta: {
            header: 'Tambah Proyek Baru',
        },
    },
]
