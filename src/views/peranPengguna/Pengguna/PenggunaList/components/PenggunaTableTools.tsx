import Button from '@/components/ui/Button'
import { HiPlusCircle } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import PenggunaTableSearch from './PenggunaTableSearch'
import PenggunaFilter from './PenggunaFilter'

const PenggunaTableTools = () => {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center">
            <PenggunaTableSearch />
            <PenggunaFilter />
            <Link
                className="block lg:inline-block md:mb-0 mb-4 ml-2"
                to="/peran-dan-pengguna/pengguna-new"
            >
                <Button block variant="solid" size="sm" icon={<HiPlusCircle />}>
                    Tambah Pengguna
                </Button>
            </Link>
        </div>
    )
}

export default PenggunaTableTools
