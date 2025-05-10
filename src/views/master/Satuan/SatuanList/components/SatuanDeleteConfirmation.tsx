import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
    toggleDeleteConfirmation,
    deleteSatuan,
    getSatuans,
    useAppDispatch,
    useAppSelector,
} from '../store'

const SatuanDeleteConfirmation = () => {
    const dispatch = useAppDispatch()
    const dialogOpen = useAppSelector(
        (state) => state.satuanList.data.deleteConfirmation
    )
    const selectedSatuan = useAppSelector(
        (state) => state.satuanList.data.selectedSatuan
    )
    const tableData = useAppSelector((state) => state.satuanList.data.tableData)

    const onDialogClose = () => {
        dispatch(toggleDeleteConfirmation(false))
    }

    const onDelete = async () => {
        dispatch(toggleDeleteConfirmation(false))
        const success = await deleteSatuan({ id: selectedSatuan })

        if (success) {
            dispatch(getSatuans(tableData))
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
            title="Hapus Satuan"
            confirmButtonColor="red-600"
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            onCancel={onDialogClose}
            onConfirm={onDelete}
        >
            <p>Apakah kamu yakin ingin menghapus satuan ini?</p>
        </ConfirmDialog>
    )
}

export default SatuanDeleteConfirmation
