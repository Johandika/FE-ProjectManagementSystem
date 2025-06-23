import { useEffect } from 'react'
import Loading from '@/components/shared/Loading'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import reducer, {
    getTagihanKlien,
    updateTagihanKlien,
    deleteTagihanKlien,
    useAppSelector,
    useAppDispatch,
} from './store'
import { injectReducer } from '@/store'
import { useLocation, useNavigate } from 'react-router-dom'

import TagihanKlienForm, {
    FormModel,
    SetSubmitting,
    OnDeleteCallback,
} from '@/views/master/TagihanKlien/TagihanKlienForm'
import isEmpty from 'lodash/isEmpty'

injectReducer('tagihanKlienEdit', reducer)

const TagihanKlienEdit = () => {
    const dispatch = useAppDispatch()

    const location = useLocation()
    const navigate = useNavigate()

    const tagihanKlienData = useAppSelector(
        (state) => state.tagihanKlienEdit.data.tagihanKlienData
    )
    const loading = useAppSelector(
        (state) => state.tagihanKlienEdit.data.loading
    )

    const fetchData = (data: { id: string }) => {
        dispatch(getTagihanKlien(data))
    }

    const popNotification = (keyword: string) => {
        toast.push(
            <Notification
                title={`Successfuly ${keyword}`}
                type="success"
                duration={2500}
            >
                TagihanKlien successfuly {keyword}
            </Notification>,
            {
                placement: 'top-center',
            }
        )
        navigate('/master/tagihan-klien')
    }

    const handleFormSubmit = async (
        values: FormModel,
        setSubmitting: SetSubmitting
    ) => {
        try {
            setSubmitting(true)
            const result = await updateTagihanKlien(values)

            if (result.statusCode === 200) {
                popNotification('updated')
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
        } finally {
            // Pastikan setSubmitting selalu dipanggil di akhir proses
            setSubmitting(false)
        }
    }

    const handleDiscard = () => {
        navigate('/master/tagihanKlien')
    }

    const handleDelete = async (setDialogOpen: OnDeleteCallback) => {
        setDialogOpen(false)
        const result = await deleteTagihanKlien({ id: tagihanKlienData.id })
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
                {!isEmpty(tagihanKlienData) && (
                    <>
                        <TagihanKlienForm
                            type="edit"
                            initialData={tagihanKlienData}
                            onFormSubmit={handleFormSubmit}
                            onDiscard={handleDiscard}
                            onDelete={handleDelete}
                        />
                    </>
                )}
            </Loading>
            {!loading && isEmpty(tagihanKlienData) && (
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

export default TagihanKlienEdit
