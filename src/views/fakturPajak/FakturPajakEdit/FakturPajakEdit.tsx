import { useEffect } from 'react'
import Loading from '@/components/shared/Loading'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import reducer, {
    getFakturPajak,
    updateFakturPajak,
    deleteFakturPajak,
    useAppSelector,
    useAppDispatch,
} from './store'
import { injectReducer } from '@/store'
import { useLocation, useNavigate } from 'react-router-dom'

import FakturPajakForm, {
    FormModel,
    SetSubmitting,
    OnDeleteCallback,
} from '@/views/fakturPajak/FakturPajakForm'
import isEmpty from 'lodash/isEmpty'

injectReducer('fakturPajakEdit', reducer)

const FakturPajakEdit = () => {
    const dispatch = useAppDispatch()

    const location = useLocation()
    const navigate = useNavigate()

    const fakturPajakData = useAppSelector(
        (state) => state.fakturPajakEdit.data.fakturPajakData
    )
    const loading = useAppSelector(
        (state) => state.fakturPajakEdit.data.loading
    )

    const fetchData = (data: { id: string }) => {
        dispatch(getFakturPajak(data))
    }

    const handleFormSubmit = async (
        values: FormModel,
        setSubmitting: SetSubmitting
    ) => {
        setSubmitting(true)
        const success = await updateFakturPajak(values)
        setSubmitting(false)
        if (success) {
            popNotification('updated')
        }
    }

    const handleDiscard = () => {
        navigate('/faktur-pajak')
    }

    const handleDelete = async (setDialogOpen: OnDeleteCallback) => {
        setDialogOpen(false)
        const success = await deleteFakturPajak({ id: fakturPajakData.id })
        if (success) {
            popNotification('deleted')
        }
    }

    const popNotification = (keyword: string) => {
        toast.push(
            <Notification
                title={`Successfuly ${keyword}`}
                type="success"
                duration={2500}
            >
                Product successfuly {keyword}
            </Notification>,
            {
                placement: 'top-center',
            }
        )
        navigate('/faktur-pajak')
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
                {!isEmpty(fakturPajakData) && (
                    <>
                        <FakturPajakForm
                            type="edit"
                            initialData={fakturPajakData}
                            onFormSubmit={handleFormSubmit}
                            onDiscard={handleDiscard}
                            onDelete={handleDelete}
                        />
                    </>
                )}
            </Loading>
            {!loading && isEmpty(fakturPajakData) && (
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

export default FakturPajakEdit
