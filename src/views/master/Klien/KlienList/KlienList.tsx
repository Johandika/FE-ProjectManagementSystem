import reducer from './store'
import { injectReducer } from '@/store'
import AdaptableCard from '@/components/shared/AdaptableCard'
import KlienTable from './components/KlienTable'
import KlienTableTools from './components/KlienTableTools'

injectReducer('klienList', reducer)

const KlienList = () => {
    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Daftar Klien</h3>
                <KlienTableTools />
            </div>
            <KlienTable />
        </AdaptableCard>
    )
}

export default KlienList
