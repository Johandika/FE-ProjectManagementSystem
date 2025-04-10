import ProyekForm, {
    FormModel,
    SetSubmitting,
} from '@/views/manajemenProyek/ProyekForm'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useNavigate } from 'react-router-dom'
import { apiCreateProyek } from '@/services/ProyekService'
import reducer, { getBerkases, getKliens, getSubkontraktors } from './store'
import { useEffect } from 'react'
import { injectReducer, useAppDispatch, useAppSelector } from '@/store'
import isEmpty from 'lodash/isEmpty'
import Loading from '@/components/shared/Loading'
import { extractNumberFromString } from '@/utils/extractNumberFromString'

injectReducer('proyekNew', reducer)

const ProyekNew = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    // kliens data
    const kliensData = useAppSelector(
        (state: any) => state.proyekNew.data.kliensData?.data || []
    )

    const loadingKliens = useAppSelector(
        (state: any) => state.proyekNew.data.loadingKliens
    )

    // berkases data
    const berkasesData = useAppSelector(
        (state: any) => state.proyekNew.data.berkasesData?.data || []
    )

    // subkontraktors data
    const subkontraktorsData = useAppSelector(
        (state: any) => state.proyekNew.data.subkontraktorsData?.data || []
    )

    const loadingBerkases = useAppSelector(
        (state: any) => state.proyekNew.data.loadingBerkases
    )

    const loadingSubkontraktors = useAppSelector(
        (state: any) => state.proyekNew.data.loadingSubkontraktors
    )

    const addProyek = async (data: FormModel) => {
        const processedData = {
            ...data,
            nilai_kontrak: extractNumberFromString(
                data.nilai_kontrak as string | number
            ),
            progress: extractNumberFromString(data.progress as string | number),
            realisasi: extractNumberFromString(
                data.realisasi as string | number
            ),
            sisa_waktu: extractNumberFromString(
                data.sisa_waktu as string | number
            ),
        }

        const response = await apiCreateProyek<boolean, FormModel>(
            processedData
        )

        return response.data
    }

    const handleFormSubmit = async (
        values: FormModel,
        setSubmitting: SetSubmitting
    ) => {
        setSubmitting(true)
        const success = await addProyek(values)
        setSubmitting(false)
        if (success) {
            toast.push(
                <Notification
                    title={'Successfuly added'}
                    type="success"
                    duration={2500}
                >
                    Proyek berhasil ditambahkan
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
            navigate('/manajemen-proyek')
        }
    }

    const handleDiscard = () => {
        navigate('/manajemen-proyek')
    }

    useEffect(() => {
        dispatch(getKliens()) // kliens
        dispatch(getBerkases()) // kliens
        dispatch(getSubkontraktors()) // kliens
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname])

    return (
        <>
            <Loading
                loading={
                    loadingKliens || loadingBerkases || loadingSubkontraktors
                }
            >
                {!isEmpty(kliensData && berkasesData) && (
                    <>
                        <ProyekForm
                            type="new"
                            kliensList={kliensData}
                            berkasesList={berkasesData}
                            subkontraktorsList={subkontraktorsData}
                            onFormSubmit={handleFormSubmit}
                            onDiscard={handleDiscard}
                        />
                    </>
                )}
            </Loading>
        </>
    )
}

export default ProyekNew
