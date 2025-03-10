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
            () => import('@/views/manajemenProyek/ManajemenProyek')
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
]
