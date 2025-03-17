import reducer from './store'
import { injectReducer } from '@/store'
import AdaptableCard from '@/components/shared/AdaptableCard'
import ProyekTable from './components/ProyekTable'
import ProyekTableTools from './components/ProyekTableTools'

injectReducer('proyekList', reducer)

const ProyekList = () => {
    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Daftar Proyek</h3>
                <ProyekTableTools />
            </div>
            <ProyekTable />
        </AdaptableCard>
    )
}

export default ProyekList
