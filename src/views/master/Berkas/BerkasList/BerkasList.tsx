import reducer from './store'
import { injectReducer } from '@/store'
import AdaptableCard from '@/components/shared/AdaptableCard'
import BerkasTable from './components/BerkasTable'
import BerkasTableTools from './components/BerkasTableTools'

injectReducer('berkasList', reducer)

const BerkasList = () => {
    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Daftar Berkas BASTP</h3>
                <BerkasTableTools />
            </div>
            <BerkasTable />
        </AdaptableCard>
    )
}

export default BerkasList
