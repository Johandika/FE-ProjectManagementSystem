import Button from '@/components/ui/Button'
import { HiDownload, HiPlusCircle } from 'react-icons/hi'
import PurchaseOrderTableSearch from './PurchaseOrderTableSearch'
import PurchaseOrderFilter from './PurchaseOrderFilter'
import { Link } from 'react-router-dom'

const PurchaseOrderTableTools = () => {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center">
            <PurchaseOrderTableSearch />
            <PurchaseOrderFilter />
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
                to="/purchase-order-new"
            >
                <Button block variant="solid" size="sm" icon={<HiPlusCircle />}>
                    Tambah Purchase Order
                </Button>
            </Link>
        </div>
    )
}

export default PurchaseOrderTableTools
