import { useEffect } from 'react'
import Loading from '@/components/shared/Loading'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import reducer, {
    getPengguna,
    useAppSelector,
    useAppDispatch,
    getOnePengguna,
} from './store'
import { injectReducer } from '@/store'
import { useLocation, useNavigate } from 'react-router-dom'

import PenggunaForm, {
    FormModel,
    SetSubmitting,
    OnDeleteCallback,
} from '@/views/peranPengguna/Pengguna/PenggunaForm'
import isEmpty from 'lodash/isEmpty'
import { apiDeleteUser, apiUpdateUser } from '@/services/UserService'

injectReducer('penggunaEdit', reducer)

const PenggunaEdit = () => {
    const dispatch = useAppDispatch()

    const location = useLocation()
    const navigate = useNavigate()

    const { onePenggunaData } = useAppSelector(
        (state) => state.penggunaEdit.data
    )
    const { loadingOnePengguna } = useAppSelector(
        (state) => state.penggunaEdit.data
    )

    const fetchData = (data: { id: string }) => {
        dispatch(getOnePengguna(data))
    }

    const popNotification = (keyword: string) => {
        toast.push(
            <Notification
                title={`Successfuly ${keyword}`}
                type="success"
                duration={2500}
            >
                Pengguna successfuly {keyword}
            </Notification>,
            {
                placement: 'top-center',
            }
        )
        navigate('/peran-dan-pengguna/pengguna')
    }

    const handleFormSubmit = async (
        values: FormModel,
        setSubmitting: SetSubmitting
    ) => {
        try {
            setSubmitting(true)
            const result: any = await apiUpdateUser(values)

            if (result.data.statusCode === 200) {
                popNotification('updated')
            } else {
                // Menampilkan notifikasi error
                toast.push(
                    <Notification
                        title={'Gagal menambahkan'}
                        type="danger"
                        duration={3500}
                    >
                        {result.data.message}
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
            }
        } finally {
            // Pastikan setSubmitting selalu dipanggil di akhir proses
            setSubmitting(false)
        }
    }

    const handleDiscard = () => {
        navigate('/peran-dan-pengguna/pengguna')
    }

    const handleDelete = async (setDialogOpen: OnDeleteCallback) => {
        setDialogOpen(false)
        const result: any = await apiDeleteUser({ id: onePenggunaData.id })

        if (result.data.statusCode === 200) {
            popNotification('deleted')
        } else {
            // Menampilkan notifikasi error
            toast.push(
                <Notification
                    title={'Gagal menghapus'}
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
    }

    useEffect(() => {
        const path = location.pathname.substring(
            location.pathname.lastIndexOf('/') + 1
        )
        const rquestParam = { id: path }
        fetchData(rquestParam)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname])

    return (
        <>
            <Loading loading={loadingOnePengguna}>
                {!isEmpty(onePenggunaData) && (
                    <>
                        <PenggunaForm
                            type="edit"
                            initialData={onePenggunaData}
                            onFormSubmit={handleFormSubmit}
                            onDiscard={handleDiscard}
                            onDelete={handleDelete}
                        />
                    </>
                )}
            </Loading>
            {!loadingOnePengguna && isEmpty(onePenggunaData) && (
                <div className="h-full flex flex-col items-center justify-center">
                    <DoubleSidedImage
                        src="/img/others/img-2.png"
                        darkModeSrc="/img/others/img-2-dark.png"
                        alt="No product found!"
                    />
                    <h3 className="mt-8">No product found!</h3>
                </div>
            )}
        </>
    )
}

export default PenggunaEdit
