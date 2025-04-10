import SubkontraktorForm, {
    FormModel,
    SetSubmitting,
} from '@/views/master/Subkontraktor/SubkontraktorForm'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useNavigate } from 'react-router-dom'
import { apiCreateSubkontraktor } from '@/services/SubkontraktorService'

const SubkontraktorNew = () => {
    const navigate = useNavigate()

    const addSubkontraktor = async (data: FormModel) => {
        console.log('Data yang akan dikirim:', data)
        const response = await apiCreateSubkontraktor<boolean, FormModel>(data)
        return response.data
    }

    const handleFormSubmit = async (
        values: FormModel,
        setSubmitting: SetSubmitting
    ) => {
        setSubmitting(true)
        const success = await addSubkontraktor(values)
        setSubmitting(false)
        if (success) {
            toast.push(
                <Notification
                    title={'Successfuly added'}
                    type="success"
                    duration={2500}
                >
                    Subkontraktor berhasil ditambahkan
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
            navigate('/master/subkontraktor')
        }
    }

    const handleDiscard = () => {
        navigate('/master/subkontraktor')
    }

    return (
        <>
            <SubkontraktorForm
                type="new"
                onFormSubmit={handleFormSubmit}
                onDiscard={handleDiscard}
            />
        </>
    )
}

export default SubkontraktorNew
