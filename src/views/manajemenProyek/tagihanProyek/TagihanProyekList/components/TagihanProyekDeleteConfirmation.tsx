import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
    toggleDeleteConfirmation,
    deleteTagihanProyek,
    getTagihanProyeks,
    useAppDispatch,
    useAppSelector,
} from '../store'

const TagihanProyekDeleteConfirmation = () => {
    const dispatch = useAppDispatch()
    const dialogOpen = useAppSelector(
        (state) => state.tagihanProyekList.data.deleteConfirmation
    )
    const selectedProduct = useAppSelector(
        (state) => state.tagihanProyekList.data.selectedProduct
    )
    const tableData = useAppSelector(
        (state) => state.tagihanProyekList.data.tableData
    )

    const onDialogClose = () => {
        dispatch(toggleDeleteConfirmation(false))
    }

    const onDelete = async () => {
        dispatch(toggleDeleteConfirmation(false))
        const success = await deleteTagihanProyek({ id: selectedProduct })

        if (success) {
            dispatch(getTagihanProyeks(tableData))
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
            title="Hapus TagihanProyek"
            confirmButtonColor="red-600"
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            onCancel={onDialogClose}
            onConfirm={onDelete}
        >
            <p>Apakah kamu yakin ingin menghapus tagihanProyek ini?</p>
        </ConfirmDialog>
    )
}

export default TagihanProyekDeleteConfirmation
