import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
    toggleRestoreConfirmation,
    getDivisies,
    useAppDispatch,
    useAppSelector,
    restoreDivisi,
} from '../store'

const DivisiRestoreConfirmation = () => {
    const dispatch = useAppDispatch()
    const dialogOpen = useAppSelector(
        (state) => state.divisiList.data.restoreConfirmation
    )

    const selectedDivisi = useAppSelector(
        (state) => state.divisiList.data.selectedDivisi
    )
    const tableData = useAppSelector((state) => state.divisiList.data.tableData)

    const onDialogClose = () => {
        dispatch(toggleRestoreConfirmation(false))
    }

    const onDelete = async () => {
        dispatch(toggleRestoreConfirmation(false))
        const success = await restoreDivisi({
            id: selectedDivisi,
        })

        if (success) {
            dispatch(
                getDivisies({
                    ...tableData,
                    filterData: {
                        divisiStatus: 'inactive',
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
            title="Restore Divisi"
            confirmButtonColor="red-600"
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            onCancel={onDialogClose}
            onConfirm={onDelete}
        >
            <p>Apakah kamu yakin ingin merestore data divisi ini?</p>
        </ConfirmDialog>
    )
}

export default DivisiRestoreConfirmation
