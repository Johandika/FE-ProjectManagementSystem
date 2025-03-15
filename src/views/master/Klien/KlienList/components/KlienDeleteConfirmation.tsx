import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
    toggleDeleteConfirmation,
    deleteKlien,
    getKliens,
    useAppDispatch,
    useAppSelector,
} from '../store'

const KlienDeleteConfirmation = () => {
    const dispatch = useAppDispatch()
    const dialogOpen = useAppSelector(
        (state) => state.klienList.data.deleteConfirmation
    )
    const selectedProduct = useAppSelector(
        (state) => state.klienList.data.selectedProduct
    )
    const tableData = useAppSelector((state) => state.klienList.data.tableData)

    const onDialogClose = () => {
        dispatch(toggleDeleteConfirmation(false))
    }

    const onDelete = async () => {
        dispatch(toggleDeleteConfirmation(false))
        const success = await deleteKlien({ id: selectedProduct })

        if (success) {
            dispatch(getKliens(tableData))
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
            title="Hapus Klien"
            confirmButtonColor="red-600"
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            onCancel={onDialogClose}
            onConfirm={onDelete}
        >
            <p>Apakah kamu yakin ingin menghapus klien ini?</p>
        </ConfirmDialog>
    )
}

export default KlienDeleteConfirmation
