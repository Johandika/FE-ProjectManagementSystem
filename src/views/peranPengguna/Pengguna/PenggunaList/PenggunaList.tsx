import reducer from './store'
import { injectReducer, useAppSelector } from '@/store'
import AdaptableCard from '@/components/shared/AdaptableCard'
import PenggunaTable from './components/PenggunaTable'
import PenggunaTableTools from './components/PenggunaTableTools'

injectReducer('penggunaList', reducer)

const PenggunaList = () => {
    const user = useAppSelector((state) => state.auth.user)

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Daftar Pengguna</h3>
                {user.authority === 'Super Admin' && <PenggunaTableTools />}
            </div>
            <PenggunaTable />
        </AdaptableCard>
    )
}

export default PenggunaList
