import BasicBarHorizontal from '@/components/custom/BasicBarHorizontal'
import BasicBarVertical from '@/components/custom/BasicBarVertical'
import Holding from '@/components/custom/Holding'
import SimplePie from '@/components/custom/SimplePie'
import { Loading } from '@/components/shared'
import { getDashboard, useAppDispatch, useAppSelector } from '@/store'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

const Dashboard = () => {
    const dispatch = useAppDispatch()
    const { dataDashboard, loadingDashboard } = useAppSelector(
        (state: any) => state.base.common
    )
    const [tanggalAwal, setTanggalAwal] = useState(
        dayjs().startOf('month').format('YYYY-MM-DD')
    )
    const [tanggalAkhir, setTanggalAkhir] = useState(
        dayjs().endOf('month').format('YYYY-MM-DD')
    )

    const dataAwal = dataDashboard?.data

    // Fungsi untuk memanggil data dashboard berdasarkan filter
    const handleFilter = (values: {
        tanggal_awal: string
        tanggal_akhir: string
    }) => {
        // Hanya dispatch jika tombol filter ditekan
        dispatch(
            getDashboard({
                tanggal_awal: values.tanggal_awal,
                tanggal_akhir: values.tanggal_akhir,
            })
        )
    }

    useEffect(() => {
        dispatch(
            getDashboard({
                tanggal_awal: tanggalAwal,
                tanggal_akhir: tanggalAkhir,
            })
        )
    }, [])

    return (
        <div>
            <div className="grid grid-cols-1 gap-4">
                <Loading loading={loadingDashboard}>
                    <Holding
                        dataAwal={dataAwal}
                        tanggalAwal={tanggalAwal}
                        tanggalAkhir={tanggalAkhir}
                        setTanggalAwal={setTanggalAwal}
                        setTanggalAkhir={setTanggalAkhir}
                        handleFilter={handleFilter}
                    />

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
