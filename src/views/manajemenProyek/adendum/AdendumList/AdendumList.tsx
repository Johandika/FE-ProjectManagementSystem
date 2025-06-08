import reducer from './store'
import { injectReducer } from '@/store'
import AdaptableCard from '@/components/shared/AdaptableCard'
import AdendumTable from './components/AdendumTable'
import AdendumTableTools from './components/AdendumTableTools'

injectReducer('adendumList', reducer)

const AdendumList = () => {
    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Daftar Adendum</h3>
                <AdendumTableTools />
            </div>
            <AdendumTable />
        </AdaptableCard>
    )
}

export default AdendumList
