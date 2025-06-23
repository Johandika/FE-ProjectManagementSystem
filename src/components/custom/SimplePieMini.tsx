import Chart from 'react-apexcharts'
import { theme } from 'twin.macro'

const twColor: Record<string, string> = theme`colors`

const SimplePieMini = ({ dataAwal }: any) => {
    const dataGrafikPie = dataAwal?.grafik_pie_pembayaran
    const data = dataGrafikPie?.data
    const category = dataGrafikPie?.key

    const formatNumber = (number: number) => {
        return number.toLocaleString('id-ID')
    }

    return (
        <div className="flex flex-col w-full ">
            <div className="mb-4 lg:mb-0">
                <p className="text-sm">Statistik Total Nilai Kontrak</p>
            </div>
            <Chart
                options={{
                    colors: [
                        twColor.emerald['500'],
                        twColor.amber['500'],
                        twColor.rose['500'],
                    ],
                    labels: category?.map((label) => `${label}`), // Format angka untuk label
                    plotOptions: {
                        pie: {
                            donut: {
                                size: '0%', // Mengubah ukuran donat
                            },
                        },
                    },
                    tooltip: {
                        y: {
                            formatter: (value) => formatNumber(value), // Format angka pada tooltip
                        },
                    },
                    legend: {
                        position: 'bottom',
                        horizontalAlign: 'center',
                    },
                    dataLabels: {
                        enabled: false,
                    },
                    responsive: [
                        {
                            breakpoint: 480,
                            options: {
                                chart: {
                                    width: 200,
                                },
                                legend: {
                                    position: 'bottom',
                                },
                            },
                        },
                    ],
                }}
                series={data}
                height={250}
                type="donut"
            />
        </div>
    )
}

export default SimplePieMini
