import Tabs from '@/components/ui/Tabs'
import Detail from './components/Detail'
import PurchaseOrder from './components/PurchaseOrder'
import Termin from './components/Termin'
import Bastp from './components/Bastp'
import Adendum from './components/Adendum'
import Items from './components/Items'
// import { injectReducer } from '@/store'
// import reducer from '../ProyekEdit/store'

const { TabNav, TabList, TabContent } = Tabs

// injectReducer('proyekEdit', reducer)

export default function ProyekDetail() {
    return (
        <div>
            <Tabs defaultValue="tab1" variant="pill">
                <TabList className="pb-4 border-b border-gray-200">
                    <TabNav value="tab1">Detail</TabNav>
                    <TabNav value="tab2">Purchase Order</TabNav>
                    <TabNav value="tab3">Termin</TabNav>
                    <TabNav value="tab4">BASTP</TabNav>
                    <TabNav value="tab5">Adendum</TabNav>
                    <TabNav value="tab6">Items</TabNav>
                </TabList>
                <div className="px-4">
                    <TabContent value="tab1">
                        <Detail />
                    </TabContent>
                    <TabContent value="tab2">
                        <PurchaseOrder />
                    </TabContent>
                    <TabContent value="tab3">
                        <Termin />
                    </TabContent>
                    <TabContent value="tab4">
                        <Bastp />
                    </TabContent>
                    <TabContent value="tab5">
                        <Adendum />
                    </TabContent>
                    <TabContent value="tab6">
                        <Items />
                    </TabContent>
                </div>
            </Tabs>
        </div>
    )
}
