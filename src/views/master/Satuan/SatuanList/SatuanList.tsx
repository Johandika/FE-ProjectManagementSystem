import reducer from './store'
import { injectReducer } from '@/store'
import AdaptableCard from '@/components/shared/AdaptableCard'
import SatuanTable from './components/SatuanTable'
import SatuanTableTools from './components/SatuanTableTools'

injectReducer('satuanList', reducer)

const SatuanList = () => {
    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Daftar Satuan</h3>
                <SatuanTableTools />
            </div>
            <SatuanTable />
        </AdaptableCard>
    )
}

export default SatuanList
