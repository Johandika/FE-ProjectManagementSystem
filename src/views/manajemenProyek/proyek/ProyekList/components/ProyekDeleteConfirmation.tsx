import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
    toggleDeleteConfirmation,
    deleteProyek,
    getProyeks,
    useAppDispatch,
    useAppSelector,
} from '../store'

const ProyekDeleteConfirmation = () => {
    const dispatch = useAppDispatch()
    const dialogOpen = useAppSelector(
        (state) => state.proyekList.data.deleteConfirmation
    )
    const selectedProyek = useAppSelector(
        (state) => state.proyekList.data.selectedProyek
    )
    const tableData = useAppSelector((state) => state.proyekList.data.tableData)

    const onDialogClose = () => {
        dispatch(toggleDeleteConfirmation(false))
    }

    const onDelete = async () => {
        dispatch(toggleDeleteConfirmation(false))
        const success = await deleteProyek({ id: selectedProyek })

        if (success) {
            dispatch(getProyeks(tableData))
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
            title="Hapus Proyek"
            confirmButtonColor="red-600"
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            onCancel={onDialogClose}
            onConfirm={onDelete}
        >
            <p>Apakah kamu yakin ingin menghapus faktur pajak ini?</p>
        </ConfirmDialog>
    )
}

export default ProyekDeleteConfirmation
