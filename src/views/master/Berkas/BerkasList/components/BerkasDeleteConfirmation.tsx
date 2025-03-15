import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
    toggleDeleteConfirmation,
    deleteBerkas,
    getBerkases,
    useAppDispatch,
    useAppSelector,
} from '../store'

const BerkasDeleteConfirmation = () => {
    const dispatch = useAppDispatch()
    const dialogOpen = useAppSelector(
        (state) => state.berkasList.data.deleteConfirmation
    )
    const selectedBerkas = useAppSelector(
        (state) => state.berkasList.data.selectedBerkas
    )
    const tableData = useAppSelector((state) => state.berkasList.data.tableData)

    const onDialogClose = () => {
        dispatch(toggleDeleteConfirmation(false))
    }

    const onDelete = async () => {
        dispatch(toggleDeleteConfirmation(false))
        const success = await deleteBerkas({ id: selectedBerkas })

        if (success) {
            dispatch(getBerkases(tableData))
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
            title="Hapus Berkas"
            confirmButtonColor="red-600"
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            onCancel={onDialogClose}
            onConfirm={onDelete}
        >
            <p>Apakah kamu yakin ingin menghapus berkas ini?</p>
        </ConfirmDialog>
    )
}

export default BerkasDeleteConfirmation
