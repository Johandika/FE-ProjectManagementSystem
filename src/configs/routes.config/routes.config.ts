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
    // Manajemen Proyek
    {
        key: 'apps.manajemenProyek',
        path: '/manajemen-proyek',
        component: lazy(() => import('@/views/manajemenProyek/ProyekList')),
        authority: [],
    },
    {
        added: 'detailProyek',
        key: 'apps.manajemenProyek',
        path: '/manajemen-proyek-detail/:proyekId',
        component: lazy(() => import('@/views/manajemenProyek/ProyekDetail')),
        authority: [],
        meta: {
            header: 'Detail Proyek',
        },
    },
    {
        key: 'apps.manajemenProyek',
        path: '/manajemen-proyek-edit/:proyekId',
        component: lazy(() => import('@/views/manajemenProyek/ProyekEdit')),
        authority: [],
        meta: {
            header: 'Ubah Proyek',
        },
    },
    {
        key: 'apps.manajemenProyek',
        path: '/manajemen-proyek-new',
        component: lazy(() => import('@/views/manajemenProyek/ProyekNew')),
        authority: [],
        meta: {
            header: 'Tambah Proyek',
        },
    },
    // edit detail menus
    // {
    //     key: 'apps.manajemenProyek',
    //     path: '/manajemen-proyek-edit/:proyekId',
    //     component: lazy(() => import('@/views/manajemenProyek/ProyekEdit')),
    //     authority: [],
    //     meta: {
    //         header: 'Ubah Proyek',
    //     },
    // },
    // Purchase Order
    // {
    //     key: 'apps.purchaseOrder',
    //     path: '/purchase-order',
    //     component: lazy(
    //         () => import('@/views/purchaseOrder/PurchaseOrderList')
    //     ),
    //     authority: [],
    // },
    // {
    //     key: 'apps.purchaseOrder',
    //     path: '/purchase-order-edit/:orderId',
    //     component: lazy(
    //         () => import('@/views/purchaseOrder/PurchaseOrderEdit')
    //     ),
    //     authority: [],
    //     meta: {
    //         header: 'Ubah Purchase Order',
    //     },
    // },
    // {
    //     key: 'apps.purchaseOrder',
    //     path: '/purchase-order-new',
    //     component: lazy(() => import('@/views/purchaseOrder/PurchaseOrderNew')),
    //     authority: [],
    //     meta: {
    //         header: 'Tambah Purchase Order',
    //     },
    // },
    // Faktur Pajak
    // {
    //     key: 'apps.fakturPajak',
    //     path: '/faktur-pajak',
    //     component: lazy(() => import('@/views/fakturPajak/FakturPajakList')),
    //     authority: [],
    // },
    // {
    //     key: 'apps.fakturPajak',
    //     path: '/faktur-pajak-edit/:klienId',
    //     component: lazy(() => import('@/views/fakturPajak/FakturPajakEdit')),
    //     authority: [],
    //     meta: {
    //         header: 'Ubah Faktur Pajak',
    //     },
    // },
    // {
    //     key: 'apps.fakturPajak',
    //     path: '/faktur-pajak-new',
    //     component: lazy(() => import('@/views/fakturPajak/FakturPajakNew')),
    //     authority: [],
    //     meta: {
    //         header: 'Tambah Faktur Pajak',
    //     },
    // },
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
            header: 'Ubah Berkas BASTP',
        },
    },
    {
        key: 'apps.berkas',
        path: '/master/berkas-new',
        component: lazy(() => import('@/views/master/Berkas/BerkasNew')),
        authority: [],
        meta: {
            header: 'Tambah Berkas BASTP',
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
    // Pengatuiran
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
]
