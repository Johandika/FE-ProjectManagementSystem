import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE,
} from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'

const navigationConfig: NavigationTree[] = [
    {
        key: 'apps',
        path: '',
        title: 'Apps',
        translateKey: 'nav.apps.apps',
        icon: '',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [],
        subMenu: [
            // Menu1
            {
                key: 'apps.dashboard',
                path: '/dashboard',
                title: 'Dashboard',
                translateKey: 'nav.apps.dashboard',
                icon: 'dashboard',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            // Menu2
            {
                key: 'apps.manajemenProyek',
                path: '/manajemen-proyek',
                title: 'Manajemen Proyek',
                translateKey: 'nav.apps.manajemenProyek',
                icon: 'manajemenProyek',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            // Menu3
            {
                key: 'apps.manajemenPengadaan',
                path: '/manajemen-pengadaan',
                title: 'Manajemen Pengadaan',
                translateKey: 'nav.apps.manajemenPengadaan.collapse',
                icon: 'manajemenPengadaan',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                subMenu: [
                    {
                        key: 'apps.purchaseOrder',
                        path: '/manajemen-pengadaan/purchase-order',
                        title: 'Purchase Order',
                        translateKey: 'nav.apps.manajemenPengadaan.item1',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                    {
                        key: 'apps.subkontraktor',
                        path: '/manajemen-pengadaan/subkontraktor',
                        title: 'Subkontraktor',
                        translateKey: 'nav.apps.manajemenPengadaan.item2',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                ],
            },
            // Menu4
            {
                key: 'apps.manajemenKeuangan',
                path: '/manajemen-keuangan',
                title: 'Manajemen Keuangan',
                translateKey: 'nav.apps.manajemenKeuangan.collapse',
                icon: 'manajemenKeuangan',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                subMenu: [
                    {
                        key: 'apps.terminPembayaran',
                        path: '/manajemen-keuangan/termin-pembayaran',
                        title: 'Termin Pembayaran',
                        translateKey: 'nav.apps.manajemenKeuangan.item1',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                    {
                        key: 'apps.fakturPajak',
                        path: '/manajemen-keuangan/faktur-pajak',
                        title: 'Faktur Pajak',
                        translateKey: 'nav.apps.manajemenKeuangan.item2',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                ],
            },
            // Menu5
            {
                key: 'apps.laporan',
                path: '/laporan',
                title: 'Laporan',
                translateKey: 'nav.apps.laporan.collapse',
                icon: 'laporan',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                subMenu: [
                    {
                        key: 'apps.laporanProses',
                        path: '/laporan/laporan-proses',
                        title: 'Laporan Proses',
                        translateKey: 'nav.apps.laporan.item1',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                    {
                        key: 'apps.laporanKeuangan',
                        path: '/laporan/laporan-keuangan',
                        title: 'Laporan Keuangan',
                        translateKey: 'nav.apps.laporan.item2',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                ],
            },
        ],
    },
]

export default navigationConfig
