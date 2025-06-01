import reducer from './store'
import { injectReducer } from '@/store'
import AdaptableCard from '@/components/shared/AdaptableCard'
import TenderTable from './components/TenderTable'
import TenderTableTools from './components/TenderTableTools'

injectReducer('tenderList', reducer)

const TenderList = () => {
    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Daftar Tender</h3>
                <TenderTableTools />
            </div>
            <TenderTable />
        </AdaptableCard>
    )
}

export default TenderList
