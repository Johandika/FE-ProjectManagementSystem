import SimplePieMini from './SimplePieMini'

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

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg mt-4">
                {/* Card 2: Total Nilai Kontrak */}
                <div className=" rounded-lg p-4 border">
                    <div>
                        <p className="text-sm">Total Proyek</p>
                        <p className="text-xl font-bold text-slate-900 mt-2">
                            {dataAwal?.total_proyek || 0}
                        </p>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm">Total Nilai Kontrak</p>
                        <p className="text-xl font-bold text-slate-900 mt-2">
                            {formatCurrency(dataAwal?.total_nilai_kontrak)}
                        </p>
                        <div className="mt-2 flex flex-col ">
                            <div>
                                <span className="text-green-600">
                                    Sudah Dibayar:{' '}
                                </span>
                                <span>
                                    {formatCurrency(
                                        dataAwal?.nilai_sudah_dibayar
                                    )}
                                </span>
                            </div>
                            <div>
                                <span className="text-indigo-600">
                                    Sudah Ditagih:{' '}
                                </span>
                                <span>
                                    {formatCurrency(
                                        dataAwal?.nilai_sudah_ditagih
                                    )}
                                </span>
                            </div>
                            <div>
                                <span className="text-rose-600">
                                    Belum Dibayar:{' '}
                                </span>
                                <span>
                                    {formatCurrency(
                                        (dataAwal?.total_nilai_kontrak || 0) -
                                            (dataAwal?.nilai_sudah_dibayar || 0)
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 3: Total Faktur Pajak */}
                <div className=" rounded-lg p-4 border">
                    <SimplePieMini dataAwal={dataAwal} />
                </div>

                {/* Card 6: Total Tender */}
                <div className=" rounded-lg p-4 border">
                    <div>
                        <p className="text-sm">Total Faktur Pajak</p>
                        <p className="text-xl font-bold text-slate-900 mt-2">
                            {dataAwal?.total_faktur_pajak || 0}
                        </p>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm">Total Tender</p>
                        <p className="text-xl font-bold text-slate-900 mt-2">
                            {dataAwal?.total_tender || 0}
                        </p>
                        <div className="mt-2 ">
                            <div>
                                <span className="text-green-600">
                                    Diterima:{' '}
                                </span>
                                <span>
                                    {dataAwal?.total_tender_diterima || 0}
                                </span>
                            </div>
                            <div>
                                <span className="text-red-600">Ditolak: </span>
                                <span>
                                    {dataAwal?.total_tender_ditolak || 0}
                                </span>
                            </div>
                            <div>
                                <span className="text-indigo-600">
                                    Dalam Proses:{' '}
                                </span>
                                <span>
                                    {dataAwal?.total_tender_pengajuan || 0}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
