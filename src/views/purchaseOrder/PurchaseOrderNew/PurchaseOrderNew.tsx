import FakturPajakForm, {
    FormModel,
    SetSubmitting,
} from '@/views/fakturPajak/FakturPajakForm'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useNavigate } from 'react-router-dom'
import { apiCreateFakturPajak } from '@/services/FakturPajakService'

const PurchaseOrderNew = () => {
    const navigate = useNavigate()

    const addFakturPajak = async (data: FormModel) => {
        console.log('Data yang akan dikirim:', data)
        const response = await apiCreateFakturPajak<boolean, FormModel>(data)
        return response.data
    }

    const handleFormSubmit = async (
        values: FormModel,
        setSubmitting: SetSubmitting
    ) => {
        setSubmitting(true)
        const success = await addFakturPajak(values)
        setSubmitting(false)
        if (success) {
            toast.push(
                <Notification
                    title={'Successfuly added'}
                    type="success"
                    duration={2500}
                >
                    Faktur pajak berhasil ditambahkan
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
            navigate('/faktur-pajak')
        }
    }

    const handleDiscard = () => {
        navigate('/faktur-pajak')
    }

    return (
        <>
            <FakturPajakForm
                type="new"
                onFormSubmit={handleFormSubmit}
                onDiscard={handleDiscard}
            />
        </>
    )
}

export default PurchaseOrderNew
