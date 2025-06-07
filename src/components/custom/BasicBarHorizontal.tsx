import Chart from 'react-apexcharts'
import { COLORS } from '@/constants/chart.constant'

const BasicBarHorizontal = ({ dataAwal }: any) => {
    const dataGrafikDua = dataAwal?.grafik_dua
    const category = dataGrafikDua?.key

    const data = [
        {
            data: dataGrafikDua?.data,
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
                        horizontal: false,
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

export default BasicBarHorizontal
