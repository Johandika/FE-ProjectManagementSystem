import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
    toggleDeleteConfirmation,
    deleteFakturPajak,
    getFakturPajaks,
    useAppDispatch,
    useAppSelector,
} from '../store'

const FakturPajakDeleteConfirmation = () => {
    const dispatch = useAppDispatch()
    const dialogOpen = useAppSelector(
        (state) => state.fakturPajakList.data.deleteConfirmation
    )
    const selectedFakturPajak = useAppSelector(
        (state) => state.fakturPajakList.data.selectedFakturPajak
    )
    const tableData = useAppSelector(
        (state) => state.fakturPajakList.data.tableData
    )

    const onDialogClose = () => {
        dispatch(toggleDeleteConfirmation(false))
    }

    const onDelete = async () => {
        dispatch(toggleDeleteConfirmation(false))
        const success = await deleteFakturPajak({ id: selectedFakturPajak })

        if (success) {
            dispatch(getFakturPajaks(tableData))
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
            title="Hapus Faktur Pajak"
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

export default FakturPajakDeleteConfirmation
