import Chart from 'react-apexcharts'
import { COLORS } from '@/constants/chart.constant'
import { getDashboard, useAppDispatch, useAppSelector } from '@/store'
import { useEffect } from 'react'
import { Loading } from '../shared'

const BasicColumn = () => {
    const dispatch = useAppDispatch()

    const { dataDashboard, loadingDashboard, errorDashboard } = useAppSelector(
        (state: any) => state.base.common
    )

    const query = {
        tahun: 2025,
    }

    useEffect(() => {
        dispatch(getDashboard(query)) // contoh param request
    }, [dispatch])

    const data2 = [
        {
            name: 'jumlah_proyek',
            data: [0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            name: 'jumlah_nilai_kontrak',
            data: [0, 0, 0, 0, 2.4, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            name: 'realisasi',
            data: [0, 0, 0, 3.2, 5.4, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            name: 'tagihan',
            data: [0, 0, 0, 0, 3.8, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            name: 'progress',
            data: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            name: 'total_tender',
            data: [0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
        },
    ]

    return (
        <Loading loading={loadingDashboard}>
            {dataDashboard && dataDashboard.data?.length > 0 && (
                <Chart
                    options={{
                        plotOptions: {
                            bar: {
                                horizontal: false,
                                columnWidth: '55%',
                                borderRadius: 2,
                            },
                        },
                        colors: COLORS,
                        dataLabels: {
                            enabled: false,
                        },
                        stroke: {
                            show: true,
                            width: 2,
                            colors: ['transparent'],
                        },
                        xaxis: {
                            categories: [
                                'Jan',
                                'Feb',
                                'Mar',
                                'Apr',
                                'May',
                                'Jun',
                                'Jul',
                                'Aug',
                                'Sep',
                                'Oct',
                                'Nov',
                                'Des',
                            ],
                        },
                        fill: {
                            opacity: 1,
                        },
                        tooltip: {
                            custom: function ({
                                series,
                                seriesIndex,
                                dataPointIndex,
                                w,
                            }) {
                                const value =
                                    series[seriesIndex][dataPointIndex]
                                const name = w.globals.seriesNames[seriesIndex]

                                // Format nilai sesuai jenis data
                                let formattedValue

                                switch (name) {
                                    case 'jumlah_nilai_kontrak':
                                    case 'realisasi':
                                    case 'tagihan':
                                        formattedValue = `Rp ${value.toLocaleString(
                                            'id-ID'
                                        )} Jt.`
                                        break
                                    case 'progress':
                                        formattedValue = `${value}%`
                                        break
                                    case 'jumlah_proyek':
                                    case 'total_tender':
                                        formattedValue =
                                            value.toLocaleString('id-ID')
                                        break
                                    default:
                                        formattedValue = value
                                }

                                // Mapping nama agar lebih readable
                                const labelMap = {
                                    jumlah_proyek: 'Jumlah Proyek',
                                    jumlah_nilai_kontrak: 'Nilai Kontrak',
                                    realisasi: 'Realisasi',
                                    tagihan: 'Tagihan',
                                    progress: 'Progress',
                                    tatal_tender: 'Total Tender',
                                }

                                const readableName = labelMap[name] || name

                                return `
                                    <div style="padding: 6px; font-size: 13px;">
                                        <strong>${readableName}</strong><br/>
                                        ${formattedValue}
                                    </div>
                                `
                            },
                        },
                    }}
                    series={data2}
                    height={450}
                    type="bar"
                />
            )}
        </Loading>
    )
}

export default BasicColumn
