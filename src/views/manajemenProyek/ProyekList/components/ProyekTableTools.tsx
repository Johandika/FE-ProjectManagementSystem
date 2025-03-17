import Button from '@/components/ui/Button'
import { HiDownload, HiPlusCircle } from 'react-icons/hi'
import ProyekTableSearch from './ProyekTableSearch'
import ProyekFilter from './ProyekFilter'
import { Link } from 'react-router-dom'

const ProyekTableTools = () => {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center">
            <ProyekTableSearch />
            <ProyekFilter />
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
                to="/manajemen-proyek-new"
            >
                <Button block variant="solid" size="sm" icon={<HiPlusCircle />}>
                    Tambah Proyek
                </Button>
            </Link>
        </div>
    )
}

export default ProyekTableTools
