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
            <div className="mb-4 lg:mb-0">
                <h3>Dashboard</h3>
                <p>Ringkasan data proyek</p>
            </div>
            <div className="grid grid-cols-1 space-y-4">
                <Loading loading={loadingDashboard}>
                    <Holding dataAwal={dataAwal} />
                    {/* Horizontal */}
                    <BasicBarVertical dataAwal={dataAwal} />
                    {/* Vertikal */}
                    <BasicBarHorizontal dataAwal={dataAwal} />
                    <SimplePie dataAwal={dataAwal} />
                </Loading>
            </div>
        </div>
    )
}

export default Dashboard
