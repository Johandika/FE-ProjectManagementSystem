import Table from '@/components/ui/Table'
import TFoot from '../ui/Table/TFoot'
const { Tr, Th, Td, THead, TBody } = Table

export default function TableDataProyekDashboard(data: any) {
    const formatIntegerRupiah = (nilai: any) => {
        const angkaInteger = Math.trunc(parseFloat(nilai) || 0)
        return angkaInteger.toLocaleString('id-ID')
    }

    // Ambil array data untuk mempermudah
    const monitoringData = data?.dataAwal?.monitoringData || []

    // 1. HITUNG TOTAL DARI SETIAP KOLOM
    const totals = monitoringData.reduce(
        (acc: any, proyek: any) => {
            acc.total_nilai_proyek += parseFloat(proyek.total_nilai_proyek) || 0

            acc.total_sudah_tertagih +=
                parseFloat(proyek.total_sudah_tertagih) || 0
            acc.total_sedang_berjalan +=
                parseFloat(proyek.total_sedang_berjalan) || 0
            acc.total_sudah_bayar += parseFloat(proyek.total_sudah_bayar) || 0
            acc.total_retensi += parseFloat(proyek.total_retensi) || 0
            return acc
        },
        {
            total_nilai_proyek: 0,
            total_sudah_tertagih: 0,
            total_sedang_berjalan: 0,
            total_sudah_bayar: 0,
            total_retensi: 0,
        }
    )
    console.log('data', data.dataAwal?.monitoringData)
    return (
        <div>
            <div className="mb-4 md:mb-8 ">
                <h4>Tabel Monitoring Proyek</h4>
            </div>
            <Table>
                <THead>
                    <Tr>
                        <Th>No</Th>
                        <Th>Divisi</Th>
                        <Th>Nilai Kontrak</Th>
                        <Th>Sudah Dibayar</Th>
                        <Th>Sedang Berjalan</Th>
                        <Th>Sudah Ditagih</Th>
                        <Th>Retensi</Th>
                    </Tr>
                </THead>
                <TBody>
                    {/* Looping data dimulai di sini */}
                    {data?.dataAwal?.monitoringData &&
                        data.dataAwal?.monitoringData?.map(
                            (proyek: any, index: number) => (
                                <Tr key={index}>
                                    <Td>{index + 1}</Td>
                                    <Td>{proyek.nama_divisi}</Td>
                                    <Td>
                                        Rp{' '}
                                        {proyek.total_nilai_proyek.toLocaleString(
                                            'id-ID'
                                        )}
                                    </Td>
                                    <Td>
                                        Rp{' '}
                                        {proyek.total_sudah_bayar.toLocaleString(
                                            'id-ID'
                                        )}
                                    </Td>
                                    <Td>
                                        Rp{' '}
                                        {proyek.total_sedang_berjalan.toLocaleString(
                                            'id-ID'
                                        )}
                                    </Td>
                                    <Td>
                                        Rp{' '}
                                        {proyek.total_sudah_tertagih.toLocaleString(
                                            'id-ID'
                                        )}
                                    </Td>

                                    <Td>
                                        Rp{' '}
                                        {formatIntegerRupiah(
                                            proyek.total_retensi
                                        )}
                                    </Td>
                                </Tr>
                            )
                        )}
                </TBody>
                {/* 2. TAMBAHKAN BARIS TOTAL DI FOOTER TABEL */}
                <TFoot>
                    <Tr>
                        <Th></Th>
                        <Th className="text-left pl-6  py-3">Total</Th>
                        <Th className="text-left pl-6  ">
                            Rp {formatIntegerRupiah(totals.total_nilai_proyek)}
                        </Th>
                        <Th className="text-left pl-6  ">
                            Rp {formatIntegerRupiah(totals.total_sudah_bayar)}
                        </Th>
                        <Th className="text-left pl-6  ">
                            Rp{' '}
                            {formatIntegerRupiah(totals.total_sedang_berjalan)}
                        </Th>
                        <Th className="text-left pl-6  ">
                            Rp{' '}
                            {formatIntegerRupiah(totals.total_sudah_tertagih)}
                        </Th>

                        <Th className="text-left pl-6  ">
                            Rp {formatIntegerRupiah(totals.total_retensi)}
                        </Th>
                    </Tr>
                </TFoot>
            </Table>
        </div>
    )
}
