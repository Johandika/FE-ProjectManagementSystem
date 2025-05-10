import ProyekForm, {
    FormModel,
    SetSubmitting,
} from '@/views/manajemenProyek/ProyekForm'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useNavigate } from 'react-router-dom'
import { apiCreateProyek } from '@/services/ProyekService'
import reducer, {
    getBerkases,
    getKliens,
    getSatuans,
    getSubkontraktors,
} from './store'
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

    // berkases data
    const berkasesData = useAppSelector(
        (state: any) => state.proyekNew.data.berkasesData?.data || []
    )

    // subkontraktors data
    const subkontraktorsData = useAppSelector(
        (state: any) => state.proyekNew.data.subkontraktorsData?.data || []
    )

    // satuans data
    const satuansData = useAppSelector(
        (state: any) => state.proyekNew.data.satuansData?.data || []
    )

    const {
        loadingBerkases,
        loadingSubkontraktors,
        loadingSatuans,
        loadingKliens,
    } = useAppSelector((state: any) => state.proyekNew.data)

    const addProyek = async (data: FormModel, setSubmitting: any) => {
        const processedData = {
            ...data,
            nilai_kontrak: extractNumberFromString(
                data.nilai_kontrak as string | number
            ),
            uang_muka: extractNumberFromString(
                data.uang_muka as string | number
            ),
            item: data.item?.map((itemData) => ({
                ...itemData,
                detail: itemData.detail.map((detailItem) => ({
                    ...detailItem,
                    volume: extractNumberFromString(
                        detailItem.volume as string | number
                    ),
                    harga_satuan_material: extractNumberFromString(
                        detailItem.harga_satuan_material as string | number
                    ),
                    harga_satuan_jasa: extractNumberFromString(
                        detailItem.harga_satuan_jasa as string | number
                    ),
                })),
            })),
            timeline: extractNumberFromString(data.timeline as string | number),
            termin: data.termin?.map((terminItem) => ({
                ...terminItem,
                persen: extractNumberFromString(
                    terminItem.persen as string | number
                ),
            })),
            subkontraktor: data.subkontraktor?.map((subkonItem) => ({
                ...subkonItem,
                nilai_subkontrak: extractNumberFromString(
                    subkonItem.nilai_subkontrak as string | number
                ),
            })),
        }

        try {
            const response = await apiCreateProyek<boolean, FormModel>(
                processedData
            )
            return response.data
        } catch (error) {
            if (error) {
                setSubmitting(false)
                toast.push(
                    <Notification
                        title={'Error Added'}
                        type="danger"
                        duration={2500}
                    >
                        {error.response.data.message}
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
            }
        }
    }

    const handleFormSubmit = async (
        values: FormModel,
        setSubmitting: SetSubmitting
    ) => {
        setSubmitting(true)
        const success = await addProyek(values, setSubmitting)
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
        dispatch(getSatuans())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname])
    // Di ProyekNew.tsx

    return (
        <>
            <Loading
                loading={
                    loadingKliens ||
                    loadingBerkases ||
                    loadingSubkontraktors ||
                    loadingSatuans
                }
            >
                {!isEmpty(kliensData && berkasesData) && (
                    <>
                        <ProyekForm
                            type="new"
                            kliensList={kliensData}
                            berkasesList={berkasesData}
                            subkontraktorsList={subkontraktorsData}
                            satuansList={satuansData}
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
