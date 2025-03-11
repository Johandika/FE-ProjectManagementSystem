import { HiOutlineTemplate } from 'react-icons/hi'
import { TbShoppingCart, TbReportSearch, TbSettings } from 'react-icons/tb'
import { BiMoneyWithdraw } from 'react-icons/bi'
import { CgFileDocument } from 'react-icons/cg'
import { RiArchiveDrawerLine } from 'react-icons/ri'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    dashboard: <HiOutlineTemplate />,
    manajemenProyek: <RiArchiveDrawerLine />,
    manajemenPengadaan: <TbShoppingCart />,
    manajemenKeuangan: <BiMoneyWithdraw />,
    manajemenDokumen: <CgFileDocument />,
    laporan: <TbReportSearch />,
    pengaturan: <TbSettings />,
}

export default navigationIcon
