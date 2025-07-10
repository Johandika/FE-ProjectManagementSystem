import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
    toggleRestoreConfirmation,
    getPenggunas,
    useAppDispatch,
    useAppSelector,
    restorePengguna,
} from '../store'

const PenggunaRestoreConfirmation = () => {
    const dispatch = useAppDispatch()
    const dialogOpen = useAppSelector(
        (state) => state.penggunaList.data.restoreConfirmation
    )

    const selectedPengguna = useAppSelector(
        (state) => state.penggunaList.data.selectedPengguna
    )

    const tableData = useAppSelector(
        (state) => state.penggunaList.data.tableData
    )
    console.log(dialogOpen)
    console.log(selectedPengguna)
    const onDialogClose = () => {
        dispatch(toggleRestoreConfirmation(false))
    }

    const onDelete = async () => {
        dispatch(toggleRestoreConfirmation(false))
        const success = await restorePengguna({
            id: selectedPengguna,
        })

        if (success) {
            dispatch(
                getPenggunas({
                    ...tableData,
                    filterData: {
                        penggunaStatus: 'inactive',
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
            title="Restore Pengguna"
            confirmButtonColor="red-600"
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            onCancel={onDialogClose}
            onConfirm={onDelete}
        >
            <p>Apakah kamu yakin ingin merestore data pengguna ini?</p>
        </ConfirmDialog>
    )
}

export default PenggunaRestoreConfirmation
