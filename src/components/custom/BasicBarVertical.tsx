import Chart from 'react-apexcharts'
import { COLORS } from '@/constants/chart.constant'

const BasicBarVertical = ({ dataAwal }: any) => {
    const dataGrafikSatu = dataAwal?.grafik_satu
    const category = dataGrafikSatu?.key

    const data = [
        {
            data: dataGrafikSatu?.data,
        },
    ]

    const formatNumber = (num: number) => {
        return num.toLocaleString('id-ID')
    }

    return (
        <div className="flex flex-col w-full sm:w-3/4 border p-4 rounded-md">
            <div className="mb-4 lg:mb-0">
                <h4>Statistik Proyek & Tender</h4>
            </div>
            <Chart
                options={{
                    plotOptions: {
                        bar: {
                            horizontal: true,
                        },
                    },
                    colors: COLORS,
                    dataLabels: {
                        enabled: true,
                        formatter: function (val: any) {
                            return formatNumber(val)
                        },
                    },
                    xaxis: {
                        categories: category,
                        labels: {
                            formatter: function (val: any) {
                                return formatNumber(val)
                            },
                        },
                    },
                }}
                series={data}
                type="bar"
                height={300}
            />
        </div>
    )
}

export default BasicBarVertical
