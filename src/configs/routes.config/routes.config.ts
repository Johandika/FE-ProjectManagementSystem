import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes = [
    // Dashboard
    {
        key: 'apps.dashboard',
        path: '/dashboard',
        component: lazy(() => import('@/views/Dashboard')),
        authority: [],
    },
    // Proyek
    {
        key: 'apps.proyek',
        path: '/manajemen-proyek/proyek',
        component: lazy(
            () => import('@/views/manajemenProyek/proyek/ProyekList')
        ),
        authority: [],
    },
    {
        added: 'detailProyek',
        key: 'apps.proyek',
        path: '/manajemen-proyek-detail/:proyekId',
        component: lazy(
            () => import('@/views/manajemenProyek/proyek/ProyekDetail')
        ),
        authority: [],
        meta: {
            header: 'Detail Proyek',
        },
    },
    {
        key: 'apps.proyek',
        path: '/manajemen-proyek-edit/:proyekId',
        component: lazy(
            () => import('@/views/manajemenProyek/proyek/ProyekEdit')
        ),
        authority: [],
        meta: {
            header: 'Ubah Proyek',
        },
    },
    {
        key: 'apps.proyek',
        path: '/manajemen-proyek-new',
        component: lazy(
            () => import('@/views/manajemenProyek/proyek/ProyekNew')
        ),
        authority: [],
        meta: {
            header: 'Tambah Proyek',
        },
    },
    // Tender
    {
        key: 'apps.tender',
        path: '/manajemen-proyek/tender',
        component: lazy(
            () => import('@/views/manajemenProyek/tender/TenderList')
        ),
        authority: [],
    },
    {
        key: 'apps.tender',
        path: '/manajemen-proyek/tender-edit/:proyekId',
        component: lazy(
            () => import('@/views/manajemenProyek/tender/TenderEdit')
        ),
        authority: [],
        meta: {
            header: 'Ubah Tender',
        },
    },
    {
        key: 'apps.tender',
        path: '/manajemen-proyek/tender-new',
        component: lazy(
            () => import('@/views/manajemenProyek/tender/TenderNew')
        ),
        authority: [],
        meta: {
            header: 'Tambah Tender',
        },
    },
    // Klien
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
    // Satuan
    {
        key: 'apps.satuan',
        path: '/master/satuan',
        component: lazy(() => import('@/views/master/Satuan/SatuanList')),
        authority: [],
    },
    {
        key: 'apps.satuan',
        path: '/master/satuan-edit/:satuanId',
        component: lazy(() => import('@/views/master/Satuan/SatuanEdit')),
        authority: [],
        meta: {
            header: 'Ubah Satuan',
        },
    },
    {
        key: 'apps.satuan',
        path: '/master/satuan-new',
        component: lazy(() => import('@/views/master/Satuan/SatuanNew')),
        authority: [],
        meta: {
            header: 'Tambah Satuan',
        },
    },
    // Berkas
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
            header: 'Ubah Berkas Tagihan',
        },
    },
    {
        key: 'apps.berkas',
        path: '/master/berkas-new',
        component: lazy(() => import('@/views/master/Berkas/BerkasNew')),
        authority: [],
        meta: {
            header: 'Tambah Berkas Tagihan',
        },
    },
    // Subkontraktor
    {
        key: 'apps.subkontraktor',
        path: '/master/subkontraktor',
        component: lazy(
            () => import('@/views/master/Subkontraktor/SubkontraktorList')
        ),
        authority: [],
    },
    {
        key: 'apps.subkontraktor',
        path: '/master/subkontraktor-edit/:subkontraktorId',
        component: lazy(
            () => import('@/views/master/Subkontraktor/SubkontraktorEdit')
        ),
        authority: [],
        meta: {
            header: 'Ubah Subkontraktor',
        },
    },
    {
        key: 'apps.subkontraktor',
        path: '/master/subkontraktor-new',
        component: lazy(
            () => import('@/views/master/Subkontraktor/SubkontraktorNew')
        ),
        authority: [],
        meta: {
            header: 'Tambah Subkontraktor',
        },
    },
    // Pengaturan
    {
        key: 'apps.peran',
        path: '/peran-dan-pengguna/peran',
        component: lazy(() => import('@/views/peranPengguna/Peran/PeranList')),
        authority: [],
    },
    {
        key: 'apps.pengguna',
        path: '/peran-dan-pengguna/pengguna',
        component: lazy(
            () => import('@/views/peranPengguna/Pengguna/PenggunaList')
        ),
        authority: [],
    },
    {
        key: 'apps.peranDanPengguna',
        path: '/peran-dan-pengguna/pengguna-edit/:proyekId',
        component: lazy(
            () => import('@/views/peranPengguna/Pengguna/PenggunaEdit')
        ),
        authority: [],
        meta: {
            header: 'Ubah Pengguna',
        },
    },
    {
        key: 'apps.peranDanPengguna',
        path: '/peran-dan-pengguna/pengguna-new',
        component: lazy(
            () => import('@/views/peranPengguna/Pengguna/PenggunaNew')
        ),
        authority: [],
        meta: {
            header: 'Tambah Pengguna',
        },
    },
    // Notifikasi
    {
        path: '/semua-notifikasi',
        component: lazy(() => import('@/views/notifikasi/Notifikasi')),
        authority: [],
    },
]
