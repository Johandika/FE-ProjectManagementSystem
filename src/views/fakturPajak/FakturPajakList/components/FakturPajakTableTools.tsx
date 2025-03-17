import Button from '@/components/ui/Button'
import { HiDownload, HiPlusCircle } from 'react-icons/hi'
import FakturPajakTableSearch from './FakturPajakTableSearch'
import FakturPajakFilter from './FakturPajakFilter'
import { Link } from 'react-router-dom'

const FakturPajakTableTools = () => {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center">
            <FakturPajakTableSearch />
            <FakturPajakFilter />
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
                to="/faktur-pajak-new"
            >
                <Button block variant="solid" size="sm" icon={<HiPlusCircle />}>
                    Tambah Faktur Pajak
                </Button>
            </Link>
        </div>
    )
}

export default FakturPajakTableTools
