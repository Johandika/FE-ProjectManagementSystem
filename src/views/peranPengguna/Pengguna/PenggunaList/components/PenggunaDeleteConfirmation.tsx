import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
    toggleDeleteConfirmation,
    getPenggunas,
    useAppDispatch,
    useAppSelector,
} from '../store'
import { apiDeleteUser } from '@/services/UserService'

const PenggunaDeleteConfirmation = () => {
    const dispatch = useAppDispatch()
    const dialogOpen = useAppSelector(
        (state) => state.penggunaList.data.deleteConfirmation
    )
    const selectedPengguna = useAppSelector(
        (state) => state.penggunaList.data.selectedPengguna
    )
    const tableData = useAppSelector(
        (state) => state.penggunaList.data.tableData
    )

    const onDialogClose = () => {
        dispatch(toggleDeleteConfirmation(false))
    }

    const onDelete = async () => {
        dispatch(toggleDeleteConfirmation(false))

        const success = await apiDeleteUser({ id: selectedPengguna })

        if (success) {
            dispatch(getPenggunas(tableData))
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
            title="Hapus Pengguna"
            confirmButtonColor="red-600"
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            onCancel={onDialogClose}
            onConfirm={onDelete}
        >
            <p>Apakah kamu yakin ingin menghapus pengguna ini?</p>
        </ConfirmDialog>
    )
}

export default PenggunaDeleteConfirmation
