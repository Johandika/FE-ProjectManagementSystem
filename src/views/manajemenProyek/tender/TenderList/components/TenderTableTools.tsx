import Button from '@/components/ui/Button'
import { HiDownload, HiPlusCircle } from 'react-icons/hi'
import TenderTableSearch from './TenderTableSearch'
import TenderFilter from './TenderFilter'
import { Link } from 'react-router-dom'

const TenderTableTools = () => {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center">
            <TenderTableSearch />
            <TenderFilter />

            <Link
                className="block lg:inline-block md:mb-0 mb-4 ml-2"
                to="/manajemen-proyek/tender-new"
            >
                <Button block variant="solid" size="sm" icon={<HiPlusCircle />}>
                    Tambah Tender
                </Button>
            </Link>
        </div>
    )
}

export default TenderTableTools
