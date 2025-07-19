import Table from '@/components/ui/Table'
const { Tr, Th, Td, THead, TBody } = Table

export default function TableDataProyekDashboard(data: any) {
    console.log('data TableDataProyekDashboard', data.dataAwal)
    const formatIntegerRupiah = (nilai: any) => {
        // Mengubah input menjadi angka dan menghilangkan desimalnya
        const angkaInteger = Math.trunc(parseFloat(nilai) || 0)

        // Format angka integer dengan pemisah ribuan standar Indonesia
        return angkaInteger.toLocaleString('id-ID')
    }
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
                        <Th>Nilai Proyek</Th>
                        <Th>Sudah Tertagih</Th>
                        <Th>Belum Dibayar</Th>
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
                                        {proyek.total_sudah_tertagih.toLocaleString(
                                            'id-ID'
                                        )}
                                    </Td>
                                    <Td>
                                        Rp{' '}
                                        {proyek.total_belum_bayar.toLocaleString(
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
            </Table>
        </div>
    )
}
