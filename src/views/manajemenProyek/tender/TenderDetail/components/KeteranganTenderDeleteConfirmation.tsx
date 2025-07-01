import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { injectReducer } from '@/store'
import reducer, {
    getKeterangansTender,
    toggleDeleteConfirmationKeterangan,
    useAppDispatch,
    useAppSelector,
} from '../store'
import { apiDeleteKeteranganTender } from '@/services/TenderService'

injectReducer('tenderDetail', reducer)

const KeteranganTenderDeleteConfirmation = ({
    idTender,
}: {
    idTender: string
}) => {
    const dispatch = useAppDispatch()
    const dialogOpen = useAppSelector(
        (state) => state.tenderDetail.data.deleteConfirmationOpen
    )
    const selectedKeterangan = useAppSelector(
        (state) => state.tenderDetail.data.selectedKeterangan
    )

    const onDialogClose = () => {
        dispatch(toggleDeleteConfirmationKeterangan(false))
    }

    const onDelete = async () => {
        dispatch(toggleDeleteConfirmationKeterangan(false))
        const success = await apiDeleteKeteranganTender({
            id: selectedKeterangan,
        })

        if (success) {
            dispatch(getKeterangansTender(idTender))

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
            title="Hapus Keterangan"
            confirmButtonColor="red-600"
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            onCancel={onDialogClose}
            onConfirm={onDelete}
        >
            <p>Apakah kamu yakin ingin menghapus keterangan ini?</p>
        </ConfirmDialog>
    )
}

export default KeteranganTenderDeleteConfirmation
