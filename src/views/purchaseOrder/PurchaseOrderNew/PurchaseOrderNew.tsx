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
        try {
            const response = await apiCreatePurchaseOrder<boolean, FormModel>(
                data
            )
            return { success: true, data: response.data }
        } catch (error: any) {
            // Ekstrak pesan error dari respons
            let errorMessage = 'Terjadi kesalahan saat menambahkan berkas'

            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                // Jika error memiliki format yang diharapkan
                errorMessage = Array.isArray(error.response.data.message)
                    ? error.response.data.message[0]
                    : error.response.data.message
            }

            return { success: false, message: errorMessage }
        }
    }

    const handleFormSubmit = async (
        values: FormModel,
        setSubmitting: SetSubmitting
    ) => {
        try {
            setSubmitting(true)
            const result = await addPurchaseOrder(values)
            setSubmitting(false)
            if (result.success) {
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
            } else {
                // Menampilkan notifikasi error
                toast.push(
                    <Notification
                        title={'Gagal menambahkan'}
                        type="danger"
                        duration={3500}
                    >
                        {result.message}
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
            }
        } catch (error) {
            // Menangkap error yang tidak tertangkap di addBerkas
            console.error('Error tidak tertangkap:', error)
            toast.push(
                <Notification
                    title={'Kesalahan Sistem'}
                    type="danger"
                    duration={2500}
                >
                    Terjadi kesalahan saat memproses permintaan
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
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
