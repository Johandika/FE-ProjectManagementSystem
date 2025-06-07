import Chart from 'react-apexcharts'
import { theme } from 'twin.macro'
import { Loading } from '../shared'

const twColor: Record<string, string> = theme`colors`

const SimplePie = ({ dataAwal, loading }: any) => {
    const dataGrafikPie = dataAwal?.grafik_pie_tender
    const data = dataGrafikPie?.data
    const category = dataGrafikPie?.key

    const formatNumber = (number: number) => {
        return number.toLocaleString('id-ID')
    }

    return (
        <Loading
            loading={loading}
            className="flex flex-col w-full sm:w-1/4 border p-4 rounded-md"
        >
            <div className="mb-4 lg:mb-0">
                <h4>Statistik Nilai Tender</h4>
            </div>
            <Chart
                options={{
                    colors: [
                        twColor.amber['500'],
                        twColor.emerald['500'],
                        twColor.rose['500'],
                    ],
                    labels: category?.map((label) => `${label}`), // Format angka untuk label
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
                height={300}
                type="donut"
            />
        </Loading>
    )
}

export default SimplePie
