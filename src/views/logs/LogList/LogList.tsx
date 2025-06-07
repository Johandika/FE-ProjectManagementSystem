import reducer from './store'
import { injectReducer } from '@/store'
import AdaptableCard from '@/components/shared/AdaptableCard'
import LogTable from './components/LogTable'
import LogTableTools from './components/LogTableTools'

injectReducer('logList', reducer)

const LogList = () => {
    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Daftar Log</h3>
                <LogTableTools />
            </div>
            <LogTable />
        </AdaptableCard>
    )
}

export default LogList
