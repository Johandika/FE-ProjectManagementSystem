import SimplePieMini from './SimplePieMini'
import { theme } from 'twin.macro'
import TableDataProyekDashboard from './TableDataProyekDashboard'
import SimplePieMiniTwo from './SimplePieMiniTwo'
import BasicBarVertical from './BasicBarVertical'

const twColor: Record<string, string> = theme`colors`

export default function Holding({ dataAwal }: any) {
    const formatCurrency = (value: number) => {
        if (typeof value !== 'number') return 'Rp 0'
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value)
    }

    console.log('data awl', dataAwal)

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg mt-4">
                {/* Card 1: Total Nilai Kontrak */}
                <div className=" rounded-lg p-4 bg-[#1AA784] text-white">
                    <div>
                        <p className="text-sm">Jumlah Proyek</p>
                        <p className="text-xl font-bold mt-2">
                            {dataAwal?.proyek.total_proyek || 0}
                        </p>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm">Nilai Kontrak</p>
                        <p className="text-xl font-bold  mt-2">
                            {formatCurrency(
                                dataAwal?.proyek.total_nilai_kontrak
                            )}
                        </p>
                    </div>
                </div>

                {/* Card 2: Total Nilai Tender */}
                <div className=" rounded-lg p-4 bg-[#748EFF] text-white">
                    <div>
                        <p className="text-sm">Jumlah Tender</p>
                        <p className="text-xl font-bold mt-2">
                            {dataAwal?.tender.total_tender || 0}
                        </p>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm">Nilai Tender</p>
                        <p className="text-xl font-bold  mt-2">
                            {formatCurrency(
                                dataAwal?.tender.total_nilai_tender
                            )}
                        </p>
                    </div>
                </div>

                {/* Card 3: Faktur Pajak */}
                <div className=" rounded-lg p-4 bg-[#202D5F] text-white">
                    <div>
                        <p className="text-sm">Jumlah Faktur Pajak</p>
                        <p className="text-xl font-bold  mt-2">
                            {dataAwal?.fakturPajak.total_faktur_pajak || 0}
                        </p>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm">Nilai Faktur Pajak</p>
                        <p className="text-xl font-bold  mt-2">
                            {formatCurrency(
                                dataAwal?.fakturPajak.total_nilai_faktur_pajak
                            )}
                        </p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {/* Card 4: Statistik Nilai Kontrak */}
                <div className=" rounded-lg p-4 bg-[#F1F1F1]">
                    <SimplePieMini
                        dataAwal={
                            dataAwal?.grafik_proyek.grafik_pie_pembayaran_proyek
                        }
                        title={'Statistik Nilai Kontrak'}
                        colors={['#1AA784', '#2F75E6', '#C71114']}
                    />
                </div>

                {/* Card 5:Statistik Progress*/}
                <div className=" rounded-lg p-4 bg-[#F1F1F1]">
                    <SimplePieMiniTwo
                        dataAwal={
                            dataAwal?.grafik_tender.grafik_pie_nilai_tender
                        }
                        title={'Statistik Nilai Tender'}
                        colors={[
                            '#E19E19',
                            '#3175E4',
                            '#1CA684',
                            '#C71314',
                            '#515151',
                        ]}
                    />
                </div>

                {/* Card 6:Statistik Progress Proyek dan Tender*/}
                <div className=" rounded-lg p-4 bg-[#F1F1F1]">
                    <SimplePieMini
                        dataAwal={
                            dataAwal?.grafik_proyek.grafik_pie_progress_proyek
                        }
                        title={'Progress Proyek'}
                        colors={['#2F75E6', '#C71114']}
                    />
                    <SimplePieMini
                        dataAwal={
                            dataAwal?.grafik_tender.grafik_pie_progress_tender
                        }
                        title={'Progress Tender'}
                        colors={['#2F75E6', '#C71114']}
                    />
                </div>

                {/* Card 7 */}
                <div className=" rounded-lg p-4 bg-[#F1F1F1]">
                    <BasicBarVertical dataAwal={dataAwal} />
                </div>
            </div>
        </div>
    )
}
