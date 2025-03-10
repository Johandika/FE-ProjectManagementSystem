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
                icon: 'dashboard',
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
                icon: 'dashboard',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                subMenu: [
                    {
                        key: 'apps.manajemenPengadaan.purchaseOrder',
                        path: '/manajemen-pengadaan/purchase-order',
                        title: 'Purchase Order',
                        translateKey: 'nav.apps.manajemenPengadaan.item1',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                    {
                        key: 'apps.manajemenPengadaan.subkontraktor',
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
                icon: 'dashboard',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                subMenu: [
                    {
                        key: 'apps.manajemenKeuangan.terminPembayaran',
                        path: '/manajemen-keuangan/termin-pembayaran',
                        title: 'Termin Pembayaran',
                        translateKey: 'nav.apps.manajemenPengadaan.item1',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                    {
                        key: 'apps.manajemenKeuangan.fakturPajak',
                        path: '/manajemen-keuangan/faktur-pajak',
                        title: 'Faktur Pajak',
                        translateKey: 'nav.apps.manajemenPengadaan.item2',
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
