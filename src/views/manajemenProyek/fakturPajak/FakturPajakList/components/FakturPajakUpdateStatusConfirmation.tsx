import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

import {
    useAppDispatch,
    useAppSelector,
    toggleUpdateConfirmation,
    getNotificationFakturPajaks,
} from '../store'
// import { apiUpdateStatusFakturPajak } from '@/services/FakturPajakService'
import {
    getAllNotificationFakturPajak,
    setUnreadNotification,
} from '@/views/notifikasi/store'
import { apiUpdateStatusFaktur } from '@/services/FakturPajakService'

const FakturPajakUpdateStatusConfirmation = () => {
    const dispatch = useAppDispatch()
    const dialogOpen = useAppSelector(
        (state) => state.fakturPajakList.data.updateConfirmation
    )

    const selectedProyek = useAppSelector(
        (state) => state.fakturPajakList.data.selectedFakturPajak
    )

    const fakturPajakStatus = useAppSelector(
        (state) => state.fakturPajakList.data.fakturPajakStatus
    )

    const tableData = useAppSelector(
        (state) => state.fakturPajakList.data.tableData
    )

    const cancelStatusChange = () => {
        dispatch(toggleUpdateConfirmation(false))
    }

    console.log('fakturPajakStatus', fakturPajakStatus)

    const confirmStatusChange = async () => {
        // Tambahkan pengecekan untuk memastikan ID tidak kosong
        if (!selectedProyek) {
            console.error('ID Faktur Pajak tidak ditemukan!')
            return
        }

        try {
            const fakturDataUpdated = {
                id: selectedProyek,
                status: 'Sudah Bayar',
            }
            const result = await apiUpdateStatusFaktur(fakturDataUpdated)

            if (result.data.statusCode === 200) {
                toast.push(
                    <Notification
                        title="Update Status Failed"
                        type="success"
                        duration={2500}
                    >
                        Berhasil memperbarui status faktur
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
                dispatch(toggleUpdateConfirmation(false))
                dispatch(getNotificationFakturPajaks())
            } else {
                toast.push(
                    <Notification
                        title="Update Status Failed"
                        type="danger"
                        duration={2500}
                    >
                        Gagal memperbarui status faktur
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
            }
        } catch (error) {
            console.error('Error updating status faktur:', error)
            toast.push(
                <Notification
                    title="Update Status Failed"
                    type="danger"
                    duration={2500}
                >
                    Gagal memperbarui status faktur
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        }
    }

    return (
        <ConfirmDialog
            isOpen={dialogOpen}
            type="warning"
            title="Ubah Status"
            onConfirm={confirmStatusChange}
            onClose={cancelStatusChange}
            onRequestClose={cancelStatusChange}
            onCancel={cancelStatusChange}
        >
            <p>
                Apakah kamu yakin ingin mengupdate status faktur pajak menjadi
                disetujui ?
            </p>
        </ConfirmDialog>
    )
}

export default FakturPajakUpdateStatusConfirmation
