import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
    toggleRestoreConfirmation,
    getBerkases,
    useAppDispatch,
    useAppSelector,
    restoreBerkas,
} from '../store'

const BerkasRestoreConfirmation = () => {
    const dispatch = useAppDispatch()
    const dialogOpen = useAppSelector(
        (state) => state.berkasList.data.restoreConfirmation
    )

    const selectedBerkas = useAppSelector(
        (state) => state.berkasList.data.selectedBerkas
    )
    const tableData = useAppSelector((state) => state.berkasList.data.tableData)

    const onDialogClose = () => {
        dispatch(toggleRestoreConfirmation(false))
    }

    const onDelete = async () => {
        dispatch(toggleRestoreConfirmation(false))
        const success = await restoreBerkas({
            id: selectedBerkas,
        })

        if (success) {
            dispatch(
                getBerkases({
                    ...tableData,
                    filterData: {
                        berkasStatus: 'inactive',
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
            title="Restore Berkas"
            confirmButtonColor="red-600"
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            onCancel={onDialogClose}
            onConfirm={onDelete}
        >
            <p>Apakah kamu yakin ingin merestore data berkas ini?</p>
        </ConfirmDialog>
    )
}

export default BerkasRestoreConfirmation
