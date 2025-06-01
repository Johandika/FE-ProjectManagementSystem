import { useEffect } from 'react'
import Loading from '@/components/shared/Loading'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import reducer, {
    getPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder,
    useAppSelector,
    useAppDispatch,
} from './store'
import { injectReducer } from '@/store'
import { useLocation, useNavigate } from 'react-router-dom'

import PurchaseOrderForm, {
    FormModel,
    SetSubmitting,
    OnDeleteCallback,
} from '@/views/purchaseOrder/PurchaseOrderForm'
import isEmpty from 'lodash/isEmpty'

injectReducer('purchaseOrderEdit', reducer)

const PurchaseOrderEdit = () => {
    const dispatch = useAppDispatch()

    const location = useLocation()
    const navigate = useNavigate()

    const purchaseOrderData = useAppSelector(
        (state) => state.purchaseOrderEdit.data.purchaseOrderData
    )
    const loading = useAppSelector(
        (state) => state.purchaseOrderEdit.data.loading
    )

    const fetchData = (data: { id: string }) => {
        dispatch(getPurchaseOrder(data))
    }

    const popNotification = (keyword: string) => {
        toast.push(
            <Notification
                title={`Successfuly ${keyword}`}
                type="success"
                duration={2500}
            >
                Purchase successfuly {keyword}
            </Notification>,
            {
                placement: 'top-center',
            }
        )
        navigate('/purchase-order')
    }

    const handleFormSubmit = async (
        values: FormModel,
        setSubmitting: SetSubmitting
    ) => {
        try {
            setSubmitting(true)
            const result: any = await updatePurchaseOrder(values)
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
            setSubmitting(false)
        }
    }

    const handleDiscard = () => {
        navigate('/purchase-order')
    }

    const handleDelete = async (setDialogOpen: OnDeleteCallback) => {
        setDialogOpen(false)
        const result: any = await deletePurchaseOrder({
            id: purchaseOrderData.id,
        })

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
                {!isEmpty(purchaseOrderData) && (
                    <>
                        <PurchaseOrderForm
                            type="edit"
                            initialData={purchaseOrderData}
                            onFormSubmit={handleFormSubmit}
                            onDiscard={handleDiscard}
                            onDelete={handleDelete}
                        />
                    </>
                )}
            </Loading>
            {!loading && isEmpty(purchaseOrderData) && (
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

export default PurchaseOrderEdit
