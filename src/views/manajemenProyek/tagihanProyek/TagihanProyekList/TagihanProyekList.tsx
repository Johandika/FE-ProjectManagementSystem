import reducer from './store'
import { injectReducer } from '@/store'
import AdaptableCard from '@/components/shared/AdaptableCard'
import TagihanProyekTable from './components/TagihanProyekTable'
import TagihanProyekTableTools from './components/TagihanProyekTableTools'

injectReducer('tagihanProyekList', reducer)

const TagihanProyekList = () => {
    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Daftar Tagihan Proyek</h3>
                <TagihanProyekTableTools />
            </div>
            <TagihanProyekTable />
        </AdaptableCard>
    )
}

export default TagihanProyekList
