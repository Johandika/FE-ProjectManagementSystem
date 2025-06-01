import toast from '@/components/ui/toast'
import TenderForm, {
    FormModel,
    SetSubmitting,
} from '@/views/manajemenProyek/tender/TenderForm'
import Notification from '@/components/ui/Notification'
import { useNavigate, useLocation } from 'react-router-dom'
import { apiCreateTender } from '@/services/TenderService'
import { injectReducer, useAppDispatch, useAppSelector } from '@/store'
import reducer, { getKliens } from './store'
import { useEffect } from 'react'

injectReducer('proyekNew', reducer)

const TenderNew = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const kliensData = useAppSelector(
        (state: any) => state.proyekNew.data.kliensData?.data || []
    )

    const addTender = async (data: FormModel) => {
        try {
            const response = await apiCreateTender<boolean, FormModel>(data)

            return { success: true, data: response.data }
        } catch (error: any) {
            // Ekstrak pesan error dari respons
            let errorMessage = 'Terjadi kesalahan saat menambahkan tender'

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
            console.log('values', values)
            const result = await addTender(values)

            setSubmitting(false)

            if (result.success) {
                toast.push(
                    <Notification
                        title={'Successfuly added'}
                        type="success"
                        duration={2500}
                    >
                        Tender berhasil ditambahkan
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
                navigate('/manajemen-proyek/tender')
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
        navigate('/manajemen-proyek/tender')
    }

    useEffect(() => {
        dispatch(getKliens()) // kliens

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname])

    return (
        <>
            <TenderForm
                type="new"
                onFormSubmit={handleFormSubmit}
                onDiscard={handleDiscard}
                kliensData={kliensData}
            />
        </>
    )
}

export default TenderNew
