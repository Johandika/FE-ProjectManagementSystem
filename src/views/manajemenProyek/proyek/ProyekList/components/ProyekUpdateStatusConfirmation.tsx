import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
    apiUpdateStatusDiprosesProyek,
    apiUpdateStatusSelesaiProyek,
} from '@/services/ProyekService'
import {
    getProyeks,
    useAppDispatch,
    useAppSelector,
    toggleUpdateConfirmation,
} from '../store'
import { injectReducer } from '@/store'
import reducer, {
    getAllNotification,
    setUnreadNotification,
} from '@/views/notifikasi/store'

injectReducer('notification', reducer)

const ProyekUpdateStatusConfirmation = () => {
    const dispatch = useAppDispatch()
    const dialogOpen = useAppSelector(
        (state) => state.proyekList.data.updateConfirmation
    )

    const selectedProyek = useAppSelector(
        (state) => state.proyekList.data.selectedProyek
    )
    const projectStatus = useAppSelector(
        (state) => state.proyekList.data.projectStatus
    )
    const tableData = useAppSelector((state) => state.proyekList.data.tableData)

    const cancelStatusChange = () => {
        dispatch(toggleUpdateConfirmation(false))
    }

    const confirmStatusChange = async () => {
        dispatch(toggleUpdateConfirmation(false))

        try {
            let success

            if (projectStatus === 'Selesai Sudah tertagih 100%') {
                success = await apiUpdateStatusSelesaiProyek({
                    id: selectedProyek,
                    status: true,
                })
            } else if (projectStatus === 'Belum Dimulai') {
                success = await apiUpdateStatusDiprosesProyek({
                    id: selectedProyek,
                    status: true,
                })
            }

            if (success) {
                dispatch(setUnreadNotification(true))
                dispatch(getAllNotification())
                dispatch(getProyeks(tableData))
                toast.push(
                    <Notification
                        title={'Successfuly Updated'}
                        type="success"
                        duration={2500}
                    >
                        Status berhasil di perbarui
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
            }
        } catch (error) {
            console.error('Error deleting notification:', error)
            toast.push(
                <Notification
                    title="Gagal Update Status Proyek"
                    type="danger"
                    duration={2500}
                >
                    {error.response.data.message}
                </Notification>,
                { placement: 'top-center' }
            )
        }
    }

    return (
        <ConfirmDialog
            isOpen={dialogOpen}
            onClose={cancelStatusChange}
            onRequestClose={cancelStatusChange}
            onCancel={cancelStatusChange}
            type="warning"
            title="Ubah Status"
            onConfirm={confirmStatusChange}
        >
            <p>Apakah kamu yakin ingin mengupdate status proyek ?</p>
        </ConfirmDialog>
    )
}

export default ProyekUpdateStatusConfirmation
