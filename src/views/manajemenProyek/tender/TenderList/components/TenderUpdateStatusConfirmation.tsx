import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

import {
    useAppDispatch,
    useAppSelector,
    setUpdateConfirmation,
    getTenders,
} from '../store'
import { apiUpdateStatusTender } from '@/services/TenderService'

const TenderUpdateStatusConfirmation = () => {
    const dispatch = useAppDispatch()
    const dialogOpen = useAppSelector(
        (state) => state.tenderList.data.updateConfirmation
    )

    const selectedProyek = useAppSelector(
        (state) => state.tenderList.data.selectedTender
    )

    const tenderStatus = useAppSelector(
        (state) => state.tenderList.data.tenderStatus
    )

    const tableData = useAppSelector((state) => state.tenderList.data.tableData)

    const cancelStatusChange = () => {
        dispatch(setUpdateConfirmation(false))
    }

    const confirmStatusChange = async () => {
        dispatch(setUpdateConfirmation(false))

        try {
            let success

            if (tenderStatus === 'Diterima') {
                success = await apiUpdateStatusTender({
                    id: selectedProyek,
                    status: tenderStatus,
                })
            } else if (tenderStatus === 'Ditolak') {
                success = await apiUpdateStatusTender({
                    id: selectedProyek,
                    status: tenderStatus,
                })
            } else if (tenderStatus === 'Batal') {
                success = await apiUpdateStatusTender({
                    id: selectedProyek,
                    status: tenderStatus,
                })
            }

            if (success) {
                dispatch(getTenders(tableData))
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
            type="warning"
            title="Ubah Status"
            onConfirm={confirmStatusChange}
            onCancel={cancelStatusChange}
            onRequestClose={cancelStatusChange}
            onClose={cancelStatusChange}
        >
            <p>Apakah kamu yakin ingin mengupdate status tender ?</p>
        </ConfirmDialog>
    )
}

export default TenderUpdateStatusConfirmation
