import BerkasForm, {
    FormModel,
    SetSubmitting,
} from '@/views/master/Berkas/BerkasForm'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useNavigate } from 'react-router-dom'
import { apiCreateBerkas } from '@/services/BerkasService'

const BerkasNew = () => {
    const navigate = useNavigate()

    const addBerkas = async (data: FormModel) => {
        console.log('Data yang akan dikirim:', data)
        const response = await apiCreateBerkas<boolean, FormModel>(data)
        return response.data
    }

    const handleFormSubmit = async (
        values: FormModel,
        setSubmitting: SetSubmitting
    ) => {
        setSubmitting(true)
        const success = await addBerkas(values)
        setSubmitting(false)
        if (success) {
            toast.push(
                <Notification
                    title={'Successfuly added'}
                    type="success"
                    duration={2500}
                >
                    Berkas berhasil ditambahkan
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
            navigate('/master/berkas')
        }
    }

    const handleDiscard = () => {
        navigate('/master/berkas')
    }

    return (
        <>
            <BerkasForm
                type="new"
                onFormSubmit={handleFormSubmit}
                onDiscard={handleDiscard}
            />
        </>
    )
}

export default BerkasNew
