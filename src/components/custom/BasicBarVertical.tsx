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
    )
}

export default BasicBarVertical
