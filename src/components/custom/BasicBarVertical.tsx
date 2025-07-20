import Chart from 'react-apexcharts'
import { COLORS } from '@/constants/chart.constant'

const BasicBarVertical = ({ dataAwal }: any) => {
    const customColors = [
        '#13B5C8',
        '#E19E19',
        '#3175E4',
        '#1CA684',
        '#C81313',
        '#565656',
    ]

    const dataGrafikSatu = dataAwal?.grafik_tender.grafik_tender

    const series = [
        {
            name: 'Jumlah', // Beri satu nama relevan untuk series
            data: dataGrafikSatu?.data?.map((d) => parseFloat(d) || 0) || [],
        },
    ]

    const category = dataGrafikSatu?.key || []

    const data = [
        {
            data: dataGrafikSatu?.data,
        },
    ]

    const formatNumber = (num: number) => {
        return num.toLocaleString('id-ID')
    }

    const formatLabel = (val: any) => {
        if (val % 1 !== 0 && typeof val === 'number') {
            return val.toFixed(1).replace('.', ',')
        }
        return formatNumber(val)
    }

    return (
        <div className="flex flex-col w-full  rounded-md h-full">
            <div className="mb-4 lg:mb-0">
                <h4>Statistik Jumlah Tender</h4>
            </div>
            <Chart
                series={series}
                type="bar"
                height="100%"
                options={{
                    legend: {
                        show: false,
                    },
                    plotOptions: {
                        bar: {
                            horizontal: true,
                            distributed: true,
                        },
                    },
                    colors: customColors,
                    xaxis: {
                        categories: category,
                    },
                    dataLabels: {
                        enabled: true,
                        formatter: function (val) {
                            // Cek dulu apakah nilainya adalah angka
                            if (typeof val !== 'number') {
                                return val
                            }

                            // Cek apakah angka tersebut desimal (bukan bilangan bulat)
                            if (val % 1 !== 0) {
                                // Ubah ke format 1 angka di belakang koma, lalu ganti titik dgn koma
                                return val.toFixed(1).replace('.', ',')
                            }

                            // Jika bilangan bulat, format seperti biasa
                            return val.toLocaleString('id-ID')
                        },
                    },
                    tooltip: {
                        y: {
                            formatter: (val) => formatLabel(val),
                            title: {
                                // Abaikan 'seriesName', ganti dengan nama kategori
                                formatter: (seriesName, opts) => {
                                    return opts.w.globals.labels[
                                        opts.dataPointIndex
                                    ]
                                },
                            },
                        },
                    },
                }}
            />
        </div>
    )
}

export default BasicBarVertical
