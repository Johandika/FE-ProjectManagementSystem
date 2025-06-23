import reducer from './store'
import { injectReducer } from '@/store'
import AdaptableCard from '@/components/shared/AdaptableCard'
import TagihanKlienTable from './components/TagihanKlienTable'
import TagihanKlienTableTools from './components/TagihanKlienTableTools'

injectReducer('tagihanKlienList', reducer)

const TagihanKlienList = () => {
    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Daftar Tagihan Klien</h3>
                <TagihanKlienTableTools />
            </div>
            <TagihanKlienTable />
        </AdaptableCard>
    )
}

export default TagihanKlienList
