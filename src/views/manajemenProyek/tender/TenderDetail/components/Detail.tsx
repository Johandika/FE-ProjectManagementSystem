import reducer, {
    useAppDispatch,
    useAppSelector,
    getKeterangansTender,
} from '../store'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
// import DescriptionSection from './DesriptionSection'
import { injectReducer } from '@/store'
import * as Yup from 'yup'
import { Notification, toast } from '@/components/ui'
// import KeteranganSection from './Keterangan'
import KeteranganTenderSection from './KeteranganTenderSection'

injectReducer('tenderDetail', reducer)

export interface SetSubmitting {
    (isSubmitting: boolean): void
}

export default function Detail() {
    const dispatch = useAppDispatch()
    const location = useLocation()

    const { keterangansTenderData } = useAppSelector(
        (state) => state.tenderDetail.data
    )

    const fetchData = (data: { id: string }) => {
        dispatch(getKeterangansTender(data))
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
        <section>
            <div>
                <KeteranganTenderSection
                    keterangansData={keterangansTenderData.data}
                />
            </div>
        </section>
    )
}
