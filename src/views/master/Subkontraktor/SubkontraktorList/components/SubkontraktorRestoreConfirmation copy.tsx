import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
    toggleRestoreConfirmation,
    getSubkontraktors,
    useAppDispatch,
    useAppSelector,
    restoreSubkontraktor,
} from '../store'

const SubkontraktorRestoreConfirmation = () => {
    const dispatch = useAppDispatch()
    const dialogOpen = useAppSelector(
        (state) => state.subkontraktorList.data.restoreConfirmation
    )

    const selectedSubkontraktor = useAppSelector(
        (state) => state.subkontraktorList.data.selectedSubkontraktor
    )
    const tableData = useAppSelector(
        (state) => state.subkontraktorList.data.tableData
    )

    const onDialogClose = () => {
        dispatch(toggleRestoreConfirmation(false))
    }

    const onDelete = async () => {
        dispatch(toggleRestoreConfirmation(false))
        const success = await restoreSubkontraktor({
            id: selectedSubkontraktor,
        })

        if (success) {
            dispatch(
                getSubkontraktors({
                    ...tableData,
                    filterData: {
                        subkontraktorStatus: 'inactive',
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
            title="Restore Subkontraktor"
            confirmButtonColor="red-600"
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            onCancel={onDialogClose}
            onConfirm={onDelete}
        >
            <p>Apakah kamu yakin ingin merestore data subkontraktor ini?</p>
        </ConfirmDialog>
    )
}

export default SubkontraktorRestoreConfirmation
