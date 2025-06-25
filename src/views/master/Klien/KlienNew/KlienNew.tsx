import KlienForm, {
    FormModel,
    SetSubmitting,
} from '@/views/master/Klien/KlienForm'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useNavigate } from 'react-router-dom'
import { apiCreateKlien } from '@/services/KlienService'
import {
    getSelectDivisi,
    RootState,
    useAppDispatch,
    useAppSelector,
} from '@/store'
import { useEffect } from 'react'
import { Loading } from '@/components/shared'

const KlienNew = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const { selectDivisi, loadingSelectDivisi } = useAppSelector(
        (state: RootState) => state.base.common
    )

    const addKlien = async (data: FormModel) => {
        try {
            const response = await apiCreateKlien<boolean, FormModel>(data)

            return { success: true, data: response.data }
        } catch (error: any) {
            // Ekstrak pesan error dari respons
            let errorMessage = 'Terjadi kesalahan saat menambahkan klien'

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
            const result = await addKlien(values)

            setSubmitting(false)

            if (result.success) {
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
        navigate('/master/klien')
    }

    useEffect(() => {
        dispatch(getSelectDivisi())
    }, [])

    return (
        <Loading loading={loadingSelectDivisi}>
            <KlienForm
                type="new"
                dataDivisi={selectDivisi.data}
                onFormSubmit={handleFormSubmit}
                onDiscard={handleDiscard}
            />
        </Loading>
    )
}

export default KlienNew
