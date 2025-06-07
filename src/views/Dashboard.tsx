import BasicBarHorizontal from '@/components/custom/BasicBarHorizontal'
import BasicBarVertical from '@/components/custom/BasicBarVertical'
import Holding from '@/components/custom/Holding'
import SimplePie from '@/components/custom/SimplePie'
import { Loading } from '@/components/shared'
import { getDashboard, useAppDispatch, useAppSelector } from '@/store'
import dayjs from 'dayjs'
import { useEffect } from 'react'

const Dashboard = () => {
    const dispatch = useAppDispatch()
    const { dataDashboard, loadingDashboard } = useAppSelector(
        (state: any) => state.base.common
    )

    const dataAwal = dataDashboard?.data

    useEffect(() => {
        const today = dayjs()
        const tanggal_awal = today.startOf('month').format('YYYY-MM-DD')
        const tanggal_akhir = today.format('YYYY-MM-DD')

        dispatch(getDashboard({ tanggal_awal, tanggal_akhir }))
    }, [dispatch])
    return (
        <div>
            <div className="grid grid-cols-1 gap-4">
                <Loading loading={loadingDashboard}>
                    <Holding dataAwal={dataAwal} />

                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Horizontal */}
                        <BasicBarVertical dataAwal={dataAwal} />
                        <SimplePie dataAwal={dataAwal} />
                    </div>

                    {/* Vertikal */}
                    {/* <BasicBarHorizontal dataAwal={dataAwal} /> */}
                </Loading>
            </div>
        </div>
    )
}

export default Dashboard
