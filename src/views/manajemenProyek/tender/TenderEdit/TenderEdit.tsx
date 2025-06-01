import { useEffect } from 'react'
import Loading from '@/components/shared/Loading'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import reducer, {
    getTender,
    useAppSelector,
    useAppDispatch,
    getKliens,
} from './store'
import { injectReducer } from '@/store'
import { useLocation, useNavigate } from 'react-router-dom'

import TenderForm, {
    FormModel,
    SetSubmitting,
    OnDeleteCallback,
} from '@/views/manajemenProyek/tender/TenderForm'
import isEmpty from 'lodash/isEmpty'
import { apiDeleteTender, apiPutTender } from '@/services/TenderService'

injectReducer('tenderEdit', reducer)

const TenderEdit = () => {
    const dispatch = useAppDispatch()

    const location = useLocation()
    const navigate = useNavigate()

    const tenderData = useAppSelector(
        (state) => state.tenderEdit.data.tenderData
    )

    const kliensData = useAppSelector(
        (state) => state.tenderEdit.data.kliensData?.data || []
    )

    const loading = useAppSelector((state) => state.tenderEdit.data.loading)

    const fetchData = (data: { id: string }) => {
        dispatch(getTender(data))
        dispatch(getKliens())
    }

    const popNotification = (keyword: string) => {
        toast.push(
            <Notification
                title={`Successfuly ${keyword}`}
                type="success"
                duration={2500}
            >
                Tender successfuly {keyword}
            </Notification>,
            {
                placement: 'top-center',
            }
        )
        navigate('/manajemen-proyek/tender')
    }

    const handleFormSubmit = async (
        values: FormModel,
        setSubmitting: SetSubmitting
    ) => {
        try {
            setSubmitting(true)

            const result = await apiPutTender(values)

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
        navigate('/manajemen-proyek/tender')
    }

    const handleDelete = async (setDialogOpen: OnDeleteCallback) => {
        setDialogOpen(false)

        const result = await apiDeleteTender({ id: tenderData.id })
        if (result.statusCode === 200) {
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
            <Loading loading={loading}>
                {!isEmpty(tenderData) && (
                    <>
                        <TenderForm
                            type="edit"
                            initialData={tenderData}
                            onFormSubmit={handleFormSubmit}
                            onDiscard={handleDiscard}
                            onDelete={handleDelete}
                            kliensData={kliensData}
                        />
                    </>
                )}
            </Loading>
            {!loading && isEmpty(tenderData) && (
                <div className="h-full flex flex-col items-center justify-center">
                    <DoubleSidedImage
                        src="/img/others/img-2.png"
                        darkModeSrc="/img/others/img-2-dark.png"
                        alt="No tender found!"
                    />
                    <h3 className="mt-8">No tender found!</h3>
                </div>
            )}
        </>
    )
}

export default TenderEdit
