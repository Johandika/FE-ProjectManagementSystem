import reducer from './store'
import { injectReducer } from '@/store'
import AdaptableCard from '@/components/shared/AdaptableCard'
import PeranTable from './components/PeranTable'

injectReducer('peranList', reducer)

const PeranList = () => {
    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Daftar Peran</h3>
            </div>
            <PeranTable />
        </AdaptableCard>
    )
}

export default PeranList
