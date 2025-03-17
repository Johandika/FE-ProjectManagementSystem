import PurchaseOrderForm, {
    FormModel,
    SetSubmitting,
} from '@/views/purchaseOrder/PurchaseOrderForm'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useNavigate } from 'react-router-dom'
import { apiCreatePurchaseOrder } from '@/services/PurchaseOrderService'

const PurchaseOrderNew = () => {
    const navigate = useNavigate()

    const addPurchaseOrder = async (data: FormModel) => {
        console.log('Data yang akan dikirim:', data)
        const response = await apiCreatePurchaseOrder<boolean, FormModel>(data)
        return response.data
    }

    const handleFormSubmit = async (
        values: FormModel,
        setSubmitting: SetSubmitting
    ) => {
        setSubmitting(true)
        const success = await addPurchaseOrder(values)
        setSubmitting(false)
        if (success) {
            toast.push(
                <Notification
                    title={'Successfuly added'}
                    type="success"
                    duration={2500}
                >
                    Purchase order berhasil ditambahkan
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
            navigate('/purchase-order')
        }
    }

    const handleDiscard = () => {
        navigate('/purchase-order')
    }

    return (
        <>
            <PurchaseOrderForm
                type="new"
                onFormSubmit={handleFormSubmit}
                onDiscard={handleDiscard}
            />
        </>
    )
}

export default PurchaseOrderNew
