import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
    toggleRestoreConfirmation,
    getSatuans,
    useAppDispatch,
    useAppSelector,
    restoreSatuan,
} from '../store'

const SatuanRestoreConfirmation = () => {
    const dispatch = useAppDispatch()
    const dialogOpen = useAppSelector(
        (state) => state.satuanList.data.restoreConfirmation
    )

    const selectedSatuan = useAppSelector(
        (state) => state.satuanList.data.selectedSatuan
    )
    const tableData = useAppSelector((state) => state.satuanList.data.tableData)

    const onDialogClose = () => {
        dispatch(toggleRestoreConfirmation(false))
    }

    const onDelete = async () => {
        dispatch(toggleRestoreConfirmation(false))
        const success = await restoreSatuan({
            id: selectedSatuan,
        })

        if (success) {
            dispatch(
                getSatuans({
                    ...tableData,
                    filterData: {
                        satuanStatus: 'inactive',
                    },
                })
            )
            toast.push(
                <Notification
                    title={'Successfuly Restored'}
                    type="success"
                    duration={2500}
                >
                    Item berhasil direstore
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
            title="Restore Satuan"
            confirmButtonColor="red-600"
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            onCancel={onDialogClose}
            onConfirm={onDelete}
        >
            <p>Apakah kamu yakin ingin merestore data satuan ini?</p>
        </ConfirmDialog>
    )
}

export default SatuanRestoreConfirmation
