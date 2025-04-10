import { useEffect } from 'react'
import Loading from '@/components/shared/Loading'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import reducer, {
    getSubkontraktor,
    updateSubkontraktor,
    deleteSubkontraktor,
    useAppSelector,
    useAppDispatch,
} from './store'
import { injectReducer } from '@/store'
import { useLocation, useNavigate } from 'react-router-dom'

import SubkontraktorForm, {
    FormModel,
    SetSubmitting,
    OnDeleteCallback,
} from '@/views/master/Subkontraktor/SubkontraktorForm'
import isEmpty from 'lodash/isEmpty'

injectReducer('subkontraktorEdit', reducer)

const SubkontraktorEdit = () => {
    const dispatch = useAppDispatch()

    const location = useLocation()
    const navigate = useNavigate()

    const subkontraktorData = useAppSelector(
        (state) => state.subkontraktorEdit.data.subkontraktorData
    )
    const loading = useAppSelector(
        (state) => state.subkontraktorEdit.data.loading
    )

    const fetchData = (data: { id: string }) => {
        dispatch(getSubkontraktor(data))
    }

    const handleFormSubmit = async (
        values: FormModel,
        setSubmitting: SetSubmitting
    ) => {
        setSubmitting(true)
        const success = await updateSubkontraktor(values)
        setSubmitting(false)
        if (success) {
            popNotification('updated')
        }
    }

    const handleDiscard = () => {
        navigate('/master/subkontraktor')
    }

    const handleDelete = async (setDialogOpen: OnDeleteCallback) => {
        setDialogOpen(false)
        const success = await deleteSubkontraktor({ id: subkontraktorData.id })
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
        navigate('/master/subkontraktor')
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
                {!isEmpty(subkontraktorData) && (
                    <>
                        <SubkontraktorForm
                            type="edit"
                            initialData={subkontraktorData}
                            onFormSubmit={handleFormSubmit}
                            onDiscard={handleDiscard}
                            onDelete={handleDelete}
                        />
                    </>
                )}
            </Loading>
            {!loading && isEmpty(subkontraktorData) && (
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

export default SubkontraktorEdit
