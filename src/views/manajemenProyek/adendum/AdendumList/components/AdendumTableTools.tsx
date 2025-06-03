import Button from '@/components/ui/Button'
import { HiPlusCircle } from 'react-icons/hi'
import AdendumFilter from './AdendumFilter'
import { Link } from 'react-router-dom'

const AdendumTableTools = () => {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center">
            {/* <AdendumTableSearch /> */}
            <AdendumFilter />

            <Link
                className="block lg:inline-block md:mb-0 mb-4 ml-2"
                to="/manajemen-proyek/adendum-new"
            >
                <Button block variant="solid" size="sm" icon={<HiPlusCircle />}>
                    Tambah Adendum
                </Button>
            </Link>
        </div>
    )
}

export default AdendumTableTools
