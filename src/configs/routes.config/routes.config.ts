import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'
import {
    ADMIN,
    DEVELOPER,
    OWNER,
    SUPER_ADMIN,
} from '@/constants/roles.constant'

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
        authority: [SUPER_ADMIN, ADMIN, DEVELOPER],
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
        authority: [SUPER_ADMIN, ADMIN, DEVELOPER],
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
        authority: [SUPER_ADMIN, OWNER, DEVELOPER],
    },
    {
        key: 'apps.tender',
        path: '/manajemen-proyek/tender-edit/:proyekId',
        component: lazy(
            () => import('@/views/manajemenProyek/tender/TenderEdit')
        ),
        authority: [SUPER_ADMIN, DEVELOPER],
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
        authority: [SUPER_ADMIN, DEVELOPER],
        meta: {
            header: 'Tambah Tender',
        },
    },
    // Tagihan Client
    {
        key: 'apps.tagihanKlien',
        path: '/manajemen-proyek/tagihan-klien',
        component: lazy(
            () =>
                import('@/views/manajemenProyek/tagihanKlien/TagihanKlienList')
        ),
        authority: [SUPER_ADMIN, OWNER, DEVELOPER],
    },
    {
        key: 'apps.tagihanProyek',
        path: '/manajemen-proyek/tagihan-proyek',
        component: lazy(
            () =>
                import(
                    '@/views/manajemenProyek/tagihanProyek/TagihanProyekList'
                )
        ),
        authority: [SUPER_ADMIN, OWNER, DEVELOPER],
    },
    // Adendum
    {
        key: 'apps.adendum',
        path: '/manajemen-proyek/adendum',
        component: lazy(
            () => import('@/views/manajemenProyek/adendum/AdendumList')
        ),
        authority: [SUPER_ADMIN, OWNER, DEVELOPER],
    },
    // Timeline
    {
        key: 'apps.timeline',
        path: '/manajemen-proyek/timeline',
        component: lazy(() => import('@/views/manajemenProyek/timeline')),
        authority: [SUPER_ADMIN, OWNER, DEVELOPER],
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
        authority: [SUPER_ADMIN, DEVELOPER],
        meta: {
            header: 'Ubah Klien',
        },
    },
    {
        key: 'apps.klien',
        path: '/master/klien-new',
        component: lazy(() => import('@/views/master/Klien/KlienNew')),
        authority: [SUPER_ADMIN, DEVELOPER],
        meta: {
            header: 'Tambah Klien',
        },
    },
    // Divisi
    {
        key: 'apps.divisi',
        path: '/master/divisi',
        component: lazy(() => import('@/views/master/Divisi/DivisiList')),
        authority: [],
    },
    {
        key: 'apps.divisi',
        path: '/master/divisi-edit/:divisiId',
        component: lazy(() => import('@/views/master/Divisi/DivisiEdit')),
        authority: [SUPER_ADMIN, DEVELOPER],
        meta: {
            header: 'Ubah Divisi',
        },
    },
    {
        key: 'apps.divisi',
        path: '/master/divisi-new',
        component: lazy(() => import('@/views/master/Divisi/DivisiNew')),
        authority: [SUPER_ADMIN, DEVELOPER],
        meta: {
            header: 'Tambah Divisi',
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
        authority: [SUPER_ADMIN, DEVELOPER],
        meta: {
            header: 'Ubah Satuan',
        },
    },
    {
        key: 'apps.satuan',
        path: '/master/satuan-new',
        component: lazy(() => import('@/views/master/Satuan/SatuanNew')),
        authority: [SUPER_ADMIN, DEVELOPER],
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
        authority: [SUPER_ADMIN, DEVELOPER],
        meta: {
            header: 'Ubah Berkas Tagihan',
        },
    },
    {
        key: 'apps.berkas',
        path: '/master/berkas-new',
        component: lazy(() => import('@/views/master/Berkas/BerkasNew')),
        authority: [SUPER_ADMIN, DEVELOPER],
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
        authority: [SUPER_ADMIN, DEVELOPER],
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
        authority: [SUPER_ADMIN, DEVELOPER],
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
        authority: [SUPER_ADMIN, DEVELOPER],
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
    // Logs
    {
        key: 'apps.logs',
        path: '/logs',
        component: lazy(() => import('@/views/logs/LogList')),
        authority: [],
    },
]
