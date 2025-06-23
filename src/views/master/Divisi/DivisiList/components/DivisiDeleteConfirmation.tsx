import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
    toggleDeleteConfirmation,
    deleteDivisi,
    getDivisies,
    useAppDispatch,
    useAppSelector,
} from '../store'

const DivisiDeleteConfirmation = () => {
    const dispatch = useAppDispatch()
    const dialogOpen = useAppSelector(
        (state) => state.divisiList.data.deleteConfirmation
    )
    const selectedDivisi = useAppSelector(
        (state) => state.divisiList.data.selectedDivisi
    )
    const tableData = useAppSelector((state) => state.divisiList.data.tableData)

    const onDialogClose = () => {
        dispatch(toggleDeleteConfirmation(false))
    }

    const onDelete = async () => {
        dispatch(toggleDeleteConfirmation(false))
        const success = await deleteDivisi({ id: selectedDivisi })

        if (success) {
            dispatch(getDivisies(tableData))
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
            title="Hapus Divisi"
            confirmButtonColor="red-600"
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            onCancel={onDialogClose}
            onConfirm={onDelete}
        >
            <p>Apakah kamu yakin ingin menghapus divisi ini?</p>
        </ConfirmDialog>
    )
}

export default DivisiDeleteConfirmation
