import Button from '@/components/ui/Button'
import { HiDownload, HiPlusCircle } from 'react-icons/hi'
import SatuanTableSearch from './SatuanTableSearch'
import SatuanFilter from './SatuanFilter'
import { Link } from 'react-router-dom'

const SatuanTableTools = () => {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center">
            <SatuanTableSearch />
            {/* <SatuanFilter />
            <Link
                download
                className="block lg:inline-block md:mx-2 md:mb-0 mb-4"
                to="/data/product-list.csv"
                target="_blank"
            >
                <Button block size="sm" icon={<HiDownload />}>
                    Export
                </Button>
            </Link> */}
            <Link
                className="block lg:inline-block md:mb-0 mb-4 md:ml-2 "
                to="/master/satuan-new"
            >
                <Button block variant="solid" size="sm" icon={<HiPlusCircle />}>
                    Tambah Satuan
                </Button>
            </Link>
        </div>
    )
}

export default SatuanTableTools
