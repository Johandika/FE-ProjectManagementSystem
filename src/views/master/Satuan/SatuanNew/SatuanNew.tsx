import SatuanForm, {
    FormModel,
    SetSubmitting,
} from '@/views/master/Satuan/SatuanForm'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useNavigate } from 'react-router-dom'
import { apiCreateSatuan } from '@/services/SatuanService'

const SatuanNew = () => {
    const navigate = useNavigate()

    const addSatuan = async (data: FormModel) => {
        try {
            console.log('dataa', data)
            const response = await apiCreateSatuan<boolean, FormModel>(data)
            return { success: true, data: response.data }
        } catch (error: any) {
            // Ekstrak pesan error dari respons
            let errorMessage = 'Terjadi kesalahan saat menambahkan satuan'

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
            const result = await addSatuan(values)
            setSubmitting(false)

            if (result.success) {
                toast.push(
                    <Notification
                        title={'Berhasil ditambahkan'}
                        type="success"
                        duration={2500}
                    >
                        Satuan berhasil ditambahkan
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
                navigate('/master/satuan')
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
            // Menangkap error yang tidak tertangkap di addSatuan
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
        navigate('/master/satuan')
    }

    return (
        <>
            <SatuanForm
                type="new"
                onFormSubmit={handleFormSubmit}
                onDiscard={handleDiscard}
            />
        </>
    )
}

export default SatuanNew
