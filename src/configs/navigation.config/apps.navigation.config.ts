import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'

const appsNavigationConfig: NavigationTree[] = [
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
                key: 'apps.purchaseOrder',
                path: '/purchase-order',
                title: 'Purchase Order',
                translateKey: 'nav.apps.purchaseOrder',
                icon: 'manajemenPengadaan',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            // Menu4
            {
                key: 'apps.fakturPajak',
                path: '/faktur-pajak',
                title: 'Faktur Pajak',
                translateKey: 'nav.apps.fakturPajak',
                icon: 'manajemenKeuangan',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            // Menu5
            {
                key: 'apps.master',
                path: '/master',
                title: 'Master',
                translateKey: 'nav.apps.master.collapse',
                icon: 'master',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                subMenu: [
                    {
                        key: 'apps.klien',
                        path: '/master/klien',
                        title: 'Klien List',
                        translateKey: 'nav.apps.master.item1',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                    {
                        key: 'apps.berkas',
                        path: '/master/berkas',
                        title: 'Berkas BASTP',
                        translateKey: 'nav.apps.master.item2',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                ],
            },
        ],
    },
    {
        key: 'settings',
        path: '',
        title: 'Settings',
        translateKey: 'nav.settings.settings',
        icon: '',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [],
        subMenu: [
            // Pengaturan
            {
                key: 'settings.pengaturan',
                path: '/pengaturan',
                title: 'Pengaturan',
                translateKey: 'nav.settings.pengaturan.collapse',
                icon: 'pengaturan',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                subMenu: [
                    {
                        key: 'settings.pengaturanPengguna',
                        path: '/pengaturan/pengguna',
                        title: 'Pengaturan Pengguna',
                        translateKey: 'nav.settings.pengaturan.item1',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                    {
                        key: 'settings.pengaturanPeran',
                        path: '/pengaturan/peran',
                        title: 'Pengaturan Peran',
                        translateKey: 'nav.settings.pengaturan.item2',
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

export default appsNavigationConfig
