import Button from '@/components/ui/Button'
import { HiDownload, HiPlusCircle } from 'react-icons/hi'
import FakturPajakTableSearch from './FakturPajakTableSearch'
import FakturPajakFilter from './FakturPajakFilter'
import { Link } from 'react-router-dom'

const FakturPajakTableTools = () => {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center">
            <FakturPajakTableSearch />
            {/* <FakturPajakFilter /> */}
        </div>
    )
}

export default FakturPajakTableTools
