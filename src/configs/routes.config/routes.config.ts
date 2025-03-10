import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes = [
    {
        key: 'dashboard',
        path: '/dashboard',
        component: lazy(() => import('@/views/Dashboard')),
        authority: [],
    },
    {
        key: 'manajemenProyek',
        path: '/manajemen-proyek',
        component: lazy(
            () => import('@/views/manajemenProyek/ManajemenProyek')
        ),
        authority: [],
    },
    {
        key: 'manajemenPengadaan.purchaseOrder',
        path: '/manajemen-pengadaan/purchase-order',
        component: lazy(
            () => import('@/views/manajemenPengadaan/PurchaseOrder')
        ),
        authority: [],
    },
    {
        key: 'manajemenPengadaan.subkontraktor',
        path: '/manajemen-pengadaan/subkontraktor',
        component: lazy(
            () => import('@/views/manajemenPengadaan/Subkontraktor')
        ),
        authority: [],
    },
    {
        key: 'manajemenKeuangan.terminPembayaran',
        path: '/manajemen-keuangan/termin-pembayaran',
        component: lazy(
            () => import('@/views/manajemenKeuangan/TerminPembayaran')
        ),
        authority: [],
    },
    {
        key: 'manajemenKeuangan.fakturPajak',
        path: '/manajemen-keuangan/faktur-pajak',
        component: lazy(() => import('@/views/manajemenKeuangan/FakturPajak')),
        authority: [],
    },
]
