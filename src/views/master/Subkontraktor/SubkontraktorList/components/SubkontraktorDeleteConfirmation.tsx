import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
    toggleDeleteConfirmation,
    deleteSubkontraktor,
    getSubkontraktors,
    useAppDispatch,
    useAppSelector,
} from '../store'

const SubkontraktorDeleteConfirmation = () => {
    const dispatch = useAppDispatch()
    const dialogOpen = useAppSelector(
        (state) => state.subkontraktorList.data.deleteConfirmation
    )
    const selectedSubkontraktor = useAppSelector(
        (state) => state.subkontraktorList.data.selectedSubkontraktor
    )
    const tableData = useAppSelector(
        (state) => state.subkontraktorList.data.tableData
    )

    const onDialogClose = () => {
        dispatch(toggleDeleteConfirmation(false))
    }

    const onDelete = async () => {
        dispatch(toggleDeleteConfirmation(false))
        const success = await deleteSubkontraktor({ id: selectedSubkontraktor })

        if (success) {
            dispatch(getSubkontraktors(tableData))
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
            title="Hapus Subkontraktor"
            confirmButtonColor="red-600"
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            onCancel={onDialogClose}
            onConfirm={onDelete}
        >
            <p>Apakah kamu yakin ingin menghapus subkontraktor ini?</p>
        </ConfirmDialog>
    )
}

export default SubkontraktorDeleteConfirmation
