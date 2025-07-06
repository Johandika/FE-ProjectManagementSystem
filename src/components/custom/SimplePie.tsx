import Chart from 'react-apexcharts'
import { theme } from 'twin.macro'

const twColor: Record<string, string> = theme`colors`

const SimplePie = ({ dataAwal }: any) => {
    const dataGrafikPie = dataAwal?.grafik_pie_tender
    const data = dataGrafikPie?.data
    const category = dataGrafikPie?.key

    const formatNumber = (number: number) => {
        return number.toLocaleString('id-ID')
    }

    const chartColors = [
        twColor.amber['500'],
        twColor.blue['500'],
        twColor.emerald['500'],
        twColor.rose['500'],
        twColor.gray['500'],
    ]

    return (
        <div className="flex flex-col w-full sm:w-4/12 border p-4 rounded-md">
            <div className="mb-4 lg:mb-0">
                <h4>Statistik Nilai Tender</h4>
            </div>
            <Chart
                height={200}
                options={{
                    colors: chartColors,
                    // labels: category?.map((label: string, index: number) => {
                    //     // Ambil nilai yang sesuai dari array 'data' menggunakan index
                    //     const value = data?.[index] || 0

                    //     // Gabungkan label dengan nilai yang sudah diformat
                    //     return `${label}: Rp ${formatNumber(value)}`
                    // }),
                    labels: category,
                    plotOptions: {
                        pie: {
                            donut: {
                                size: '70%', // Mengubah ukuran donat
                            },
                        },
                    },
                    tooltip: {
                        y: {
                            formatter: (value) => formatNumber(value), // Format angka pada tooltip
                        },
                    },
                    // legend: {
                    //     position: 'bottom',
                    //     horizontalAlign: 'center',
                    // },
                    legend: {
                        show: false, // Legenda bawaan sudah disembunyikan
                    },
                    dataLabels: {
                        enabled: false,
                    },
                    // responsive: [
                    //     {
                    //         breakpoint: 480,
                    //         options: {
                    //             chart: {
                    //                 width: 200,
                    //             },
                    //             legend: {
                    //                 position: 'bottom',
                    //             },
                    //         },
                    //     },
                    // ],
                }}
                series={data}
                type="donut"
            />
            {/* 👇 LEGENDA CUSTOM DENGAN TAILWIND DIMULAI DI SINI 👇 */}
            <div className="mt-4 flex flex-col space-y-2">
                {category?.map((label: string, index: number) => {
                    const value = data?.[index] || 0
                    const color = chartColors[index]

                    return (
                        <div key={label} className="flex items-center">
                            <span
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: color }}
                            ></span>
                            <span className="text-sm font-medium text-gray-700">
                                {label}: Rp {formatNumber(value)}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default SimplePie
