import reducer from './store'
import { injectReducer } from '@/store'
import AdaptableCard from '@/components/shared/AdaptableCard'
import PurchaseOrderTable from './components/PurchaseOrderTable'
import PurchaseOrderTableTools from './components/PurchaseOrderTableTools'

injectReducer('purchaseOrderList', reducer)

const FakturPajakList = () => {
    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Daftar Purchase Order</h3>
                <PurchaseOrderTableTools />
            </div>
            <PurchaseOrderTable />
        </AdaptableCard>
    )
}

export default FakturPajakList
