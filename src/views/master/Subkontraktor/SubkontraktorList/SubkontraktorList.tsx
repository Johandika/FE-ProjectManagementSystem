import reducer from './store'
import { injectReducer } from '@/store'
import AdaptableCard from '@/components/shared/AdaptableCard'
import SubkontraktorTable from './components/SubkontraktorTable'
import SubkontraktorTableTools from './components/SubkontraktorTableTools'

injectReducer('subkontraktorList', reducer)

const SubkontraktorList = () => {
    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Daftar Subkontraktor</h3>
                <SubkontraktorTableTools />
            </div>
            <SubkontraktorTable />
        </AdaptableCard>
    )
}

export default SubkontraktorList
