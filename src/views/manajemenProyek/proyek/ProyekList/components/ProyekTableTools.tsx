import Button from '@/components/ui/Button'
import { HiPlusCircle } from 'react-icons/hi'
import ProyekTableSearch from './ProyekTableSearch'
import ProyekFilter from './ProyekFilter'
import { Link } from 'react-router-dom'
import { useAppSelector } from '@/store'

const ProyekTableTools = () => {
    const user = useAppSelector((state) => state.auth.user)

    return (
        <div className="flex flex-col lg:flex-row lg:items-center">
            <ProyekTableSearch />
            <ProyekFilter />

            {user.authority !== 'Owner' && (
                <Link
                    className="block lg:inline-block md:mb-0 mb-4 md:ml-2"
                    to="/manajemen-proyek-new"
                >
                    <Button
                        block
                        variant="solid"
                        size="sm"
                        icon={<HiPlusCircle />}
                    >
                        Tambah Proyek
                    </Button>
                </Link>
            )}
        </div>
    )
}

export default ProyekTableTools
