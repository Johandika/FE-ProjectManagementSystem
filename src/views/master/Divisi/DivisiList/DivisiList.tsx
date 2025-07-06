import reducer from './store'
import { injectReducer } from '@/store'
import AdaptableCard from '@/components/shared/AdaptableCard'
import DivisiTable from './components/DivisiTable'
import DivisiTableTools from './components/DivisiTableTools'

injectReducer('divisiList', reducer)

const DivisiList = () => {
    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Daftar Divisi</h3>
                <DivisiTableTools />
            </div>
            <DivisiTable />
        </AdaptableCard>
    )
}

export default DivisiList
