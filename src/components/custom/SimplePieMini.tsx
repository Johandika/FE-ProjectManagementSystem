import Chart from 'react-apexcharts'

const SimplePieMini = ({ dataAwal, title, colors }: any) => {
    const dataGrafikPie = dataAwal
    const data = dataGrafikPie?.data
    const category = dataGrafikPie?.key

    const formatNumber = (number: number) => {
        // 1. Ubah input menjadi angka
        const num = parseFloat(number)

        // 2. Jika hasilnya bukan angka (misalnya dari null atau string kosong), kembalikan '0'
        if (isNaN(num)) {
            return '0'
        }

        // 3. Jika valid, format seperti biasa
        return num.toLocaleString('id-ID')
    }

    return (
        <div className="flex flex-col ">
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
                                        size: '0%', // Mengubah ukuran donat
                                    },
                                },
                            },
                            tooltip: {
                                y: {
                                    formatter: (value) => {
                                        return `${formatNumber(value)}${
                                            title === 'Progress Proyek' ||
                                            title === 'Progress Tender'
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
                                className="flex flex-col items-start"
                                style={{ color: colors[index] }}
                            >
                                <span className="text-xs">
                                    {label === 'Sudah Ditagih'
                                        ? `${label} (FP)`
                                        : `${label}`}
                                </span>
                                <div className="text-sm font-bold">
                                    {title === 'Statistik Nilai Kontrak'
                                        ? 'Rp '
                                        : ''}
                                    {formatNumber(data[index])}
                                    {title === 'Progress Proyek' ||
                                    title === 'Progress Tender'
                                        ? ' %'
                                        : ''}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SimplePieMini
