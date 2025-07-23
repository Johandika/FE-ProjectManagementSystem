import Chart from 'react-apexcharts'

const SimplePieMiniTwo = ({ dataAwal, title, colors }: any) => {
    const dataGrafikPie = dataAwal
    const data = dataGrafikPie?.data
    const category = dataGrafikPie?.key

    const formatNumber = (number: number) => {
        return number.toLocaleString('id-ID')
    }

    return (
        <div className="flex flex-col w-full h-full">
            {/* Title */}
            <div>
                <p className="text-lg font-bold text-black">{title}</p>
            </div>
            {/* Chart dan Legend */}
            <div className="flex flex-col sm:flex-row items-center my-auto  ">
                {/* Sisi Kiri: Chart */}
                <div className="w:12/12 sm:w-5/12  mx-auto">
                    <Chart
                        options={{
                            colors: colors,
                            labels: category?.map((label) => `${label}`), // Format angka untuk label
                            plotOptions: {
                                pie: {
                                    donut: {
                                        size: '65%', // Mengubah ukuran donat
                                    },
                                },
                            },
                            tooltip: {
                                y: {
                                    formatter: (value) => {
                                        return `${formatNumber(value)}${
                                            title === 'Statistik Progress'
                                                ? '%'
                                                : ''
                                        }`
                                    },
                                },
                            },
                            legend: {
                                show: false,
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
                        height={180}
                        type="donut"
                    />
                </div>
                {/* Sisi Kanan */}
                <div className="flex flex-col gap-3 pl-4 w-7/12">
                    {category?.map((label, index) => (
                        <div
                            key={label}
                            className="flex flex-row items-center gap-2"
                        >
                            {/* Titik Warna */}
                            <span
                                className="h-3 w-3 flex-shrink-0 rounded-full"
                                style={{ backgroundColor: colors[index] }}
                            ></span>

                            {/* Label & Value */}
                            <div
                                className="flex flex-col sm:flex-row items-start sm:items-center"
                                style={{ color: colors[index] }}
                            >
                                <span className="text-xs">{label}: </span>
                                <div className="text-sm font-bold ml-0 sm:ml-2">
                                    {title === 'Statistik Nilai Kontrak' ||
                                    title === 'Statistik Nilai Tender'
                                        ? 'Rp '
                                        : ''}
                                    {formatNumber(data[index])}
                                    {title === 'Progress Proyek' ? ' %' : ''}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SimplePieMiniTwo
