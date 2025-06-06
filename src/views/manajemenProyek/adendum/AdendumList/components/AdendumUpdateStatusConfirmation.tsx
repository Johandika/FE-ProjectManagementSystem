import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

import {
    useAppDispatch,
    useAppSelector,
    toggleUpdateConfirmation,
    getAdendums,
} from '../store'
import { apiUpdateStatusAdendum } from '@/services/AdendumService'

const AdendumUpdateStatusConfirmation = () => {
    const dispatch = useAppDispatch()
    const dialogOpen = useAppSelector(
        (state) => state.adendumList.data.updateConfirmation
    )

    const selectedProyek = useAppSelector(
        (state) => state.adendumList.data.selectedAdendum
    )

    const adendumStatus = useAppSelector(
        (state) => state.adendumList.data.adendumStatus
    )

    console.log('adendumStatus', adendumStatus)

    const tableData = useAppSelector(
        (state) => state.adendumList.data.tableData
    )

    const cancelStatusChange = () => {
        dispatch(toggleUpdateConfirmation(false))
    }

    const confirmStatusChange = async () => {
        dispatch(toggleUpdateConfirmation(false))

        try {
            let success

            if (adendumStatus === 'Terima') {
                console.log('adendumStatus', adendumStatus)
                success = await apiUpdateStatusAdendum({
                    id: selectedProyek,
                    status: 'Sudah Disetujui',
                })
            } else if (adendumStatus === 'Tolak') {
                success = await apiUpdateStatusAdendum({
                    id: selectedProyek,
                    status: 'Tidak Disetujui',
                })
            }

            if (success) {
                dispatch(getAdendums(tableData))
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

export default AdendumUpdateStatusConfirmation
