import Tabs from '@/components/ui/Tabs'
import Detail from './components/Detail'

const { TabNav, TabList, TabContent } = Tabs

export default function TenderDetail() {
    return (
        <div>
            <Tabs defaultValue="tab1" variant="pill">
                <TabList className="pb-4 border-b border-gray-200">
                    <TabNav value="tab1">Keterangan</TabNav>
                </TabList>
                <div className="px-4">
                    <TabContent value="tab1">
                        <Detail />
                    </TabContent>
                </div>
            </Tabs>
        </div>
    )
}
