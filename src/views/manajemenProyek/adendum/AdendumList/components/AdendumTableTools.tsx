import Button from '@/components/ui/Button'
import { HiDownload, HiPlusCircle } from 'react-icons/hi'
import AdendumTableSearch from './AdendumTableSearch'
import AdendumFilter from './AdendumFilter'
import { Link } from 'react-router-dom'

const AdendumTableTools = () => {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center">
            <AdendumTableSearch />
            {/* <AdendumFilter /> */}
        </div>
    )
}

export default AdendumTableTools
