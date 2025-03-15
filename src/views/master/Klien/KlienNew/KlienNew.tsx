import KlienForm, {
    FormModel,
    SetSubmitting,
} from '@/views/master/Klien/KlienForm'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useNavigate } from 'react-router-dom'
import { apiCreateKlien } from '@/services/KlienService'

const KlienNew = () => {
    const navigate = useNavigate()

    const addKlien = async (data: FormModel) => {
        console.log('Data yang akan dikirim:', data)
        const response = await apiCreateKlien<boolean, FormModel>(data)
        return response.data
    }

    const handleFormSubmit = async (
        values: FormModel,
        setSubmitting: SetSubmitting
    ) => {
        setSubmitting(true)
        const success = await addKlien(values)
        setSubmitting(false)
        if (success) {
            toast.push(
                <Notification
                    title={'Successfuly added'}
                    type="success"
                    duration={2500}
                >
                    Klien berhasil ditambahkan
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
            navigate('/master/klien')
        }
    }

    const handleDiscard = () => {
        navigate('/master/klien')
    }

    return (
        <>
            <KlienForm
                type="new"
                onFormSubmit={handleFormSubmit}
                onDiscard={handleDiscard}
            />
        </>
    )
}

export default KlienNew
