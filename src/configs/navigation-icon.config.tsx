import { HiOutlineTemplate } from 'react-icons/hi'
import { TbShoppingCart, TbReportSearch, TbSettings } from 'react-icons/tb'
import { BiMoneyWithdraw } from 'react-icons/bi'
import { CgFileDocument } from 'react-icons/cg'
import { RiArchiveDrawerLine } from 'react-icons/ri'
import { FiDatabase } from 'react-icons/fi'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    dashboard: <HiOutlineTemplate />,
    manajemenProyek: <RiArchiveDrawerLine />,
    manajemenPengadaan: <TbShoppingCart />,
    manajemenKeuangan: <BiMoneyWithdraw />,
    manajemenDokumen: <CgFileDocument />,
    laporan: <TbReportSearch />,
    pengaturan: <TbSettings />,
    master: <FiDatabase />,
}

export default navigationIcon
