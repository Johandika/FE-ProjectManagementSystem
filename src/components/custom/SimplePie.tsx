import Chart from 'react-apexcharts'
import { COLORS } from '@/constants/chart.constant'

const SimplePie = ({ dataAwal }) => {
    const dataGrafikPie = dataAwal?.grafik_pie_tender
    const data = dataGrafikPie?.data
    const category = dataGrafikPie?.key
    console.log('data', data)
    console.log('category', category)
    return (
        <Chart
            options={{
                colors: COLORS,
                labels: category,
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
            type="pie"
        />
    )
}

export default SimplePie
