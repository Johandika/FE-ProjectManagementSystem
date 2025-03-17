import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
    toggleDeleteConfirmation,
    deletePurchaseOrder,
    getPurchaseOrders,
    useAppDispatch,
    useAppSelector,
} from '../store'

const PurchaseOrderDeleteConfirmation = () => {
    const dispatch = useAppDispatch()
    const dialogOpen = useAppSelector(
        (state) => state.purchaseOrderList.data.deleteConfirmation
    )
    const selectedPurchaseOrder = useAppSelector(
        (state) => state.purchaseOrderList.data.selectedPurchaseOrder
    )
    const tableData = useAppSelector(
        (state) => state.purchaseOrderList.data.tableData
    )

    const onDialogClose = () => {
        dispatch(toggleDeleteConfirmation(false))
    }

    const onDelete = async () => {
        dispatch(toggleDeleteConfirmation(false))
        const success = await deletePurchaseOrder({ id: selectedPurchaseOrder })

        if (success) {
            dispatch(getPurchaseOrders(tableData))
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
            title="Hapus Purchase Order"
            confirmButtonColor="red-600"
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            onCancel={onDialogClose}
            onConfirm={onDelete}
        >
            <p>Apakah kamu yakin ingin menghapus purchase order ini?</p>
        </ConfirmDialog>
    )
}

export default PurchaseOrderDeleteConfirmation
