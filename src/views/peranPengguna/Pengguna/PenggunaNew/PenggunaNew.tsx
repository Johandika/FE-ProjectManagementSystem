import PenggunaForm, {
    FormModel,
    SetSubmitting,
} from '@/views/peranPengguna/Pengguna/PenggunaForm'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useNavigate } from 'react-router-dom'
import { apiRegister } from '@/services/AuthService'
import { Loading } from '@/components/shared'
import { injectReducer } from '@/store'
import reducer, {
    getRoles,
    selectRoles,
    useAppDispatch,
    useAppSelector,
} from '../../Peran/PeranList/store'
import { useEffect } from 'react'

injectReducer('peranList', reducer)

const PenggunaNew = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    // const loading = useAppSelector((state) => state.data.loading)

    const peranList = useAppSelector(
        (state) => state.peranList.data.selectRoles
    )
    const laoding = useAppSelector(
        (state) => state.peranList.data.loadingSelectRoles
    )

    const addPengguna = async (data: FormModel) => {
        try {
            const response = await apiRegister<boolean, FormModel>(data)
            return { success: true, data: response.data }
        } catch (error: any) {
            // Ekstrak pesan error dari respons
            let errorMessage = 'Terjadi kesalahan saat menambahkan pengguna'

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
            const result = await addPengguna(values)
            setSubmitting(false)

            if (result.success) {
                toast.push(
                    <Notification
                        title={'Berhasil ditambahkan'}
                        type="success"
                        duration={2500}
                    >
                        Pengguna berhasil ditambahkan
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
                navigate('/peran-dan-pengguna/pengguna')
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
            // Menangkap error yang tidak tertangkap di addPengguna
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
        navigate('/peran-dan-pengguna/pengguna')
    }

    useEffect(() => {
        dispatch(selectRoles())
    }, [])

    return (
        <Loading loading={laoding}>
            <PenggunaForm
                type="new"
                onFormSubmit={handleFormSubmit}
                onDiscard={handleDiscard}
                roleData={peranList}
            />
        </Loading>
    )
}

export default PenggunaNew
