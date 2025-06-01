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
                download
                className="block lg:inline-block md:mx-2 md:mb-0 mb-4"
                to="/data/product-list.csv"
                target="_blank"
            >
                <Button block size="sm" icon={<HiDownload />}>
                    Export
                </Button>
            </Link>
            <Link
                className="block lg:inline-block md:mb-0 mb-4"
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
