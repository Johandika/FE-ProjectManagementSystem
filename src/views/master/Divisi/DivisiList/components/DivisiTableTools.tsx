import Button from '@/components/ui/Button'
import { HiPlusCircle } from 'react-icons/hi'
import DivisiTableSearch from './DivisiTableSearch'
import { Link } from 'react-router-dom'
import { useAppSelector } from '@/store'
import DivisiFilter from './DivisiFilter'

const DivisiTableTools = () => {
    const user = useAppSelector((state) => state.auth.user)

    return (
        <div className="flex flex-col lg:flex-row lg:items-center">
            <DivisiTableSearch />
            <DivisiFilter />
            {/* <Link
                download
                className="block lg:inline-block md:mx-2 md:mb-0 mb-4"
                to="/data/product-list.csv"
                target="_blank"
            >
                <Button block size="sm" icon={<HiDownload />}>
                    Export
                </Button>
            </Link> */}
            {user.authority !== 'Admin' && user.authority !== 'Owner' && (
                <Link
                    className="block lg:inline-block md:mb-0 mb-4 md:ml-2 "
                    to="/master/divisi-new"
                >
                    <Button
                        block
                        variant="solid"
                        size="sm"
                        icon={<HiPlusCircle />}
                    >
                        Tambah Divisi
                    </Button>
                </Link>
            )}
        </div>
    )
}

export default DivisiTableTools
