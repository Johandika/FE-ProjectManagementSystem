import { useEffect } from 'react'
import Loading from '@/components/shared/Loading'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import reducer, {
    getProyek,
    updateProyek,
    deleteProyek,
    useAppSelector,
    useAppDispatch,
    getKliens,
    getBerkases,
    getSubkontraktors,
    getTermins,
} from './store'
import { injectReducer } from '@/store'
import { useLocation, useNavigate } from 'react-router-dom'

import ProyekForm, {
    FormModel,
    SetSubmitting,
    OnDeleteCallback,
} from '@/views/manajemenProyek/proyek/ProyekForm'
import isEmpty from 'lodash/isEmpty'

injectReducer('proyekEdit', reducer)

const ProyekEdit = () => {
    const dispatch = useAppDispatch()

    const location = useLocation()
    const navigate = useNavigate()

    const proyekData = useAppSelector(
        (state) => state.proyekEdit.data.proyekData
    )

    // kliens data
    const kliensData = useAppSelector(
        (state) => state.proyekEdit.data.kliensData?.data || []
    )

    // berkases data
    const berkasesData = useAppSelector(
        (state) => state.proyekEdit.data.berkasesData?.data || []
    )

    const loading = useAppSelector((state) => state.proyekEdit.data.loading)

    const loadingKliens = useAppSelector(
        (state) => state.proyekEdit.data.loadingKliens
    )

    const fetchData = (data: { id: string }) => {
        dispatch(getProyek(data))
        dispatch(getTermins(data))
    }

    const handleFormSubmit = async (
        values: FormModel,
        setSubmitting: SetSubmitting
    ) => {
        setSubmitting(true)

        const success = await updateProyek(values)
        setSubmitting(false)
        if (success) {
            popNotification('updated')
        }
    }

    const handleDiscard = () => {
        navigate('/manajemen-proyek/proyek')
    }

    const handleDelete = async (setDialogOpen: OnDeleteCallback) => {
        setDialogOpen(false)
        const success = await deleteProyek({ id: proyekData.id })
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
                Proyek successfuly {keyword}
            </Notification>,
            {
                placement: 'top-center',
            }
        )
        navigate('/manajemen-proyek/proyek')
    }

    useEffect(() => {
        const path = location.pathname.substring(
            location.pathname.lastIndexOf('/') + 1
        )
        const rquestParam = { id: path }
        fetchData(rquestParam)

        dispatch(getKliens()) // kliens
        dispatch(getBerkases()) // berkases
        dispatch(getSubkontraktors()) // kliens
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname])

    // Mempersiapkan objek proyekDataEdit yang hanya berisi properti yang diinginkan
    const proyekDataEdit = !isEmpty(proyekData)
        ? {
              id: proyekData.id, // tetap perlu id untuk update
              pekerjaan: proyekData.pekerjaan,
              pic: proyekData.pic,
              nomor_kontrak: proyekData.nomor_kontrak,
              tanggal_kontrak: proyekData.tanggal_kontrak,
              nilai_kontrak: proyekData.nilai_kontrak,
              timeline: proyekData.timeline,
              keterangan: proyekData.keterangan,
              idClient: proyekData.Client.id,
          }
        : {}

    return (
        <>
            <Loading loading={loading || loadingKliens}>
                {!isEmpty(proyekData) && (
                    <>
                        <ProyekForm
                            type="edit"
                            initialDataEdit={proyekDataEdit}
                            kliensList={kliensData}
                            berkasesList={berkasesData}
                            onFormSubmit={handleFormSubmit}
                            onDiscard={handleDiscard}
                            onDelete={handleDelete}
                        />
                    </>
                )}
            </Loading>
            {!loading && isEmpty(proyekData) && (
                <div className="h-full flex flex-col items-center justify-center">
                    <DoubleSidedImage
                        src="/img/others/img-2.png"
                        darkModeSrc="/img/others/img-2-dark.png"
                        alt="No product found!"
                    />
                    <h3 className="mt-8">No proyek found!</h3>
                </div>
            )}
        </>
    )
}

export default ProyekEdit
