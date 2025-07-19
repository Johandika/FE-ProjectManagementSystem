import Chart from 'react-apexcharts'
import { COLORS } from '@/constants/chart.constant'

const BasicBarVertical = ({ dataAwal }: any) => {
    const dataGrafikSatu = dataAwal?.grafik_satu

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
        <div className="flex flex-col w-full sm:w-8/12 border p-4 rounded-md">
            <div className="mb-4 lg:mb-0">
                <h4>Statistik Proyek & Tender</h4>
            </div>
            <Chart
                series={series}
                type="bar"
                height={300}
                options={{
                    plotOptions: {
                        bar: {
                            horizontal: true,
                        },
                    },
                    colors: COLORS,

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
