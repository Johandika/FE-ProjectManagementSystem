import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
    toggleDeleteConfirmation,
    getTenders,
    useAppDispatch,
    useAppSelector,
} from '../store'
import { apiDeleteTender } from '@/services/TenderService'

const TenderDeleteConfirmation = () => {
    const dispatch = useAppDispatch()
    const dialogOpen = useAppSelector(
        (state) => state.tenderList.data.deleteConfirmation
    )
    const selectedTender = useAppSelector(
        (state) => state.tenderList.data.selectedTender
    )
    const tableData = useAppSelector((state) => state.tenderList.data.tableData)

    const onDialogClose = () => {
        dispatch(toggleDeleteConfirmation(false))
    }

    const onDelete = async () => {
        dispatch(toggleDeleteConfirmation(false))
        const success = await apiDeleteTender({ id: selectedTender })

        if (success) {
            dispatch(getTenders(tableData))
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
            title="Hapus Tender"
            confirmButtonColor="red-600"
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            onCancel={onDialogClose}
            onConfirm={onDelete}
        >
            <p>Apakah kamu yakin ingin menghapus tender ini?</p>
        </ConfirmDialog>
    )
}

export default TenderDeleteConfirmation
