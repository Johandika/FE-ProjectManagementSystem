import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
    toggleRestoreConfirmation,
    getKliens,
    useAppDispatch,
    useAppSelector,
    restoreKlien,
} from '../store'

const KlienRestoreConfirmation = () => {
    const dispatch = useAppDispatch()
    const dialogOpen = useAppSelector(
        (state) => state.klienList.data.restoreConfirmation
    )

    const selectedKlien = useAppSelector(
        (state) => state.klienList.data.selectedKlien
    )
    const tableData = useAppSelector((state) => state.klienList.data.tableData)

    const onDialogClose = () => {
        dispatch(toggleRestoreConfirmation(false))
    }

    const onDelete = async () => {
        dispatch(toggleRestoreConfirmation(false))
        const success = await restoreKlien({
            id: selectedKlien,
        })

        if (success) {
            dispatch(
                getKliens({
                    ...tableData,
                    filterData: {
                        klienStatus: 'inactive',
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
            title="Restore Klien"
            confirmButtonColor="red-600"
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            onCancel={onDialogClose}
            onConfirm={onDelete}
        >
            <p>Apakah kamu yakin ingin merestore data klien ini?</p>
        </ConfirmDialog>
    )
}

export default KlienRestoreConfirmation
