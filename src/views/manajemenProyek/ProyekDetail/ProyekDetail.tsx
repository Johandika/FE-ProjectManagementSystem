import Tabs from '@/components/ui/Tabs'
import Detail from './components/Detail'
import PurchaseOrder from './components/PurchaseOrder'
import Termin from './components/Termin'
import Adendum from './components/Adendum'
import Items from './components/Items'
import Lokasi from './components/Lokasi'
import Subkontraktor from './components/Subkontraktor'
import BerkasTagihan from './components/BerkasTagihan'
import Bastp from './components/Bastp'
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
                    <TabNav value="tab2">Lokasi</TabNav>
                    <TabNav value="tab3">Subkon</TabNav>
                    <TabNav value="tab4">PO (Barang)</TabNav>
                    <TabNav value="tab5">RAB/Progress</TabNav>
                    <TabNav value="tab6">Termin</TabNav>
                    <TabNav value="tab7">Adendum</TabNav>
                    <TabNav value="tab8">BASTP</TabNav>
                    <TabNav value="tab9">Berkas Tagihan</TabNav>
                </TabList>
                <div className="px-4">
                    <TabContent value="tab1">
                        <Detail />
                    </TabContent>
                    <TabContent value="tab2">
                        <Lokasi />
                    </TabContent>
                    <TabContent value="tab3">
                        <Subkontraktor />
                    </TabContent>
                    <TabContent value="tab4">
                        <PurchaseOrder />
                    </TabContent>
                    <TabContent value="tab5">
                        <Items />
                    </TabContent>
                    <TabContent value="tab6">
                        <Termin />
                    </TabContent>
                    <TabContent value="tab7">
                        <Adendum />
                    </TabContent>
                    <TabContent value="tab8">
                        <Bastp />
                    </TabContent>
                    <TabContent value="tab9">
                        <BerkasTagihan />
                    </TabContent>
                </div>
            </Tabs>
        </div>
    )
}
