import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { injectReducer } from '@/store'
import reducer, {
    getKeteranganByProject,
    getProyek,
    toggleDeleteConfirmationKeterangan,
    useAppDispatch,
    useAppSelector,
} from '../../ProyekEdit/store'
import { apiDeleteKeterangan } from '@/services/KeteranganService'

injectReducer('proyekEdit', reducer)

const KeteranganDeleteConfirmation = ({ idProyek }: { idProyek: string }) => {
    const dispatch = useAppDispatch()
    const dialogOpen = useAppSelector(
        (state) => state.proyekEdit.data.deleteConfirmationKeterangan
    )
    const selectedKeterangan = useAppSelector(
        (state) => state.proyekEdit.data.selectedKeterangan
    )

    // const data = { id: idProyek }

    const onDialogClose = () => {
        dispatch(toggleDeleteConfirmationKeterangan(false))
    }

    const onDelete = async () => {
        dispatch(toggleDeleteConfirmationKeterangan(false))
        const success = await apiDeleteKeterangan({ id: selectedKeterangan })

        if (success) {
            const path = location.pathname.substring(
                location.pathname.lastIndexOf('/') + 1
            )

            dispatch(getProyek({ id: path }))

            toast.push(
                <Notification
                    title={'Successfuly Deleted'}
                    type="success"
                    duration={2500}
                >
                    Item berhasil dihapus
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
            type="danger"
            title="Hapus Keterangan"
            confirmButtonColor="red-600"
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            onCancel={onDialogClose}
            onConfirm={onDelete}
        >
            <p>Apakah kamu yakin ingin menghapus keterangan ini?</p>
        </ConfirmDialog>
    )
}

export default KeteranganDeleteConfirmation
