import reducer from './store'
import { injectReducer } from '@/store'
import AdaptableCard from '@/components/shared/AdaptableCard'
import FakturPajakTable from './components/FakturPajakTable'
import FakturPajakTableTools from './components/FakturPajakTableTools'

injectReducer('fakturPajakList', reducer)

const FakturPajakList = () => {
    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Daftar Faktur Pajak</h3>
                <FakturPajakTableTools />
            </div>
            <FakturPajakTable />
        </AdaptableCard>
    )
}

export default FakturPajakList
