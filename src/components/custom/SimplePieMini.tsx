import Chart from 'react-apexcharts'

const SimplePieMini = ({ dataAwal, title, colors }: any) => {
    const dataGrafikPie = dataAwal
    const data = dataGrafikPie?.data
    const category = dataGrafikPie?.key

    const formatNumber = (number: number) => {
        return number.toLocaleString('id-ID')
    }

    return (
        <div className="flex flex-col w-full ">
            <div className="mb-4 lg:mb-0">
                <p className="text-sm">{title}</p>
            </div>
            <Chart
                options={{
                    colors: colors,
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
