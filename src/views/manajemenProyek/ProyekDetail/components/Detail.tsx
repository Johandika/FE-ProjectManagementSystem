import reducer, {
    useAppDispatch,
    getProyek,
    useAppSelector,
    getTermins,
    setPekerjaanActive,
} from '../../ProyekEdit/store'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DescriptionSection from './DesriptionSection'
import { injectReducer } from '@/store'
import { formatDate } from '@/utils/formatDate'
import { Button, Notification, toast } from '@/components/ui'
import { apiUpdateStatusRetensi } from '@/services/ProyekService'
import { ConfirmDialog } from '@/components/shared'

injectReducer('proyekEdit', reducer)

export default function Detail() {
    const dispatch = useAppDispatch()
    const location = useLocation()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [statusChangeDialogOpen, setStatusChangeDialogOpen] = useState(false)
    const [statusChangeItem, setStatusChangeItem] = useState(null)

    const { proyekData } = useAppSelector((state) => state.proyekEdit.data)

    const fetchData = (data: { id: string }) => {
        dispatch(getProyek(data))
            .unwrap()
            .then((result) => {
                // Only set pekerjaanActive after proyekData is loaded
                if (result && result.pekerjaan) {
                    dispatch(setPekerjaanActive(result.pekerjaan))
                }
            })
        dispatch(getTermins(data))
    }

    const handleOpenStatusChangeDialog = () => {
        setStatusChangeItem({
            id: proyekData.id,
            newStatus: !proyekData.status_retensi,
            nama: proyekData.pekerjaan,
        })
        setStatusChangeDialogOpen(true)
    }

    const confirmStatusChange = async () => {
        setStatusChangeDialogOpen(false)
        setIsSubmitting(true)

        try {
            const result = await apiUpdateStatusRetensi({
                id: statusChangeItem.id,
                status_retensi: statusChangeItem.newStatus,
            })
            if (
                result &&
                result.data?.statusCode >= 200 &&
                result.data?.statusCode < 300
            ) {
                await dispatch(getProyek({ id: statusChangeItem.id })).unwrap()
                toast.push(
                    <Notification
                        title="Status berhasil diperbarui"
                        type="success"
                        duration={2500}
                    >
                        Status Retensi berhasil di update
                    </Notification>,
                    { placement: 'top-center' }
                )
            } else {
                toast.push(
                    <Notification title="Error" type="danger" duration={2500}>
                        {result ? result?.message : 'Gagal memperbarui status'}
                    </Notification>,
                    { placement: 'top-center' }
                )
            }
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger" duration={2500}>
                    {error?.response?.data?.message ||
                        'Gagal memperbarui status'}
                </Notification>,
                { placement: 'top-center' }
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const cancelStatusChange = () => {
        setStatusChangeDialogOpen(false)
    }

    useEffect(() => {
        const path = location.pathname.substring(
            location.pathname.lastIndexOf('/') + 1
        )
        const rquestParam = { id: path }
        fetchData(rquestParam)

        // dispatch(getKliens()) // kliens
        // dispatch(getBerkases()) // kliens
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname])

    return (
        <section className=" ">
            <div>
                {/* Informasi Dasar */}
                <div className="flex flex-col gap-4 border-b border-gray-200 py-6">
                    <DescriptionSection
                        title="Informasi Dasar"
                        desc="Informasi dasar proyek"
                    />
                    <div>
                        <div className="flex flex-col gap-0 border-b py-4 ">
                            <div className="text-sm">Nama Pekerjaan :</div>
                            <div className="text-base font-semibold text-neutral-500">
                                {proyekData.pekerjaan}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2">
                            <div className="flex flex-col gap-0 border-b py-4">
                                <div className="text-sm">Klien :</div>
                                <div className="text-base font-semibold text-neutral-500">
                                    {proyekData.Client?.nama}
                                </div>
                            </div>
                            <div className="flex flex-col gap-0 border-b py-4">
                                <div className="text-sm">PIC :</div>
                                <div className="text-base font-semibold text-neutral-500">
                                    {proyekData.pic}
                                </div>
                            </div>
                            <div className="flex flex-col gap-0 border-b py-4">
                                <div className="text-sm">Nomor Kontrak :</div>
                                <div className="text-base font-semibold text-neutral-500">
                                    {proyekData.nomor_kontrak || '-'}
                                </div>
                            </div>
                            <div className="flex flex-col gap-0 border-b py-4">
                                <div className="text-sm">Tgl. Kontrak :</div>
                                <div className="text-base font-semibold text-neutral-500">
                                    {formatDate(
                                        proyekData.tanggal_kontrak || '-'
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-0 border-b py-4">
                                <div className="text-sm">Status :</div>
                                <div className="text-base font-semibold text-neutral-500">
                                    {proyekData.status || '-'}
                                </div>
                            </div>
                            <div className="flex flex-col gap-0 border-b py-4">
                                <div className="text-sm">Nilai Kontrak :</div>
                                <div className="text-base font-semibold text-neutral-500">
                                    {proyekData.nilai_kontrak?.toLocaleString(
                                        'id-ID'
                                    ) || '-'}
                                </div>
                            </div>
                            <div className="flex flex-col gap-0 border-b py-4">
                                <div className="text-sm">Uang Muka :</div>
                                <div className="text-base font-semibold text-neutral-500">
                                    {proyekData.uang_muka?.toLocaleString(
                                        'id-ID'
                                    ) || '-'}
                                </div>
                            </div>
                            <div className="flex flex-col gap-0 border-b py-4">
                                <div className="text-sm">Progress (%) :</div>
                                <div className="text-base font-semibold text-neutral-500">
                                    {proyekData.progress}
                                </div>
                            </div>
                            <div className="flex flex-col gap-0 border-b py-4">
                                <div className="text-sm">
                                    Waktu Pengerjaan (hari) :
                                </div>
                                <div className="text-base font-semibold text-neutral-500">
                                    {proyekData.timeline}
                                </div>
                            </div>
                            {/* Retensi */}
                            <div className="flex flex-col gap-0 border-b py-4">
                                <div className="text-sm">Retensi :</div>
                                <div className="text-base font-semibold text-neutral-500">
                                    {proyekData.is_retensi ? 'Ya' : 'Tidak'}
                                </div>
                            </div>
                            {proyekData.is_retensi === true && (
                                <>
                                    <div className="flex flex-col gap-0 border-b py-4">
                                        <div className="text-sm">
                                            Persen Retensi :
                                        </div>
                                        <div className="text-base font-semibold text-neutral-500">
                                            {`${proyekData.persen_retensi}%` ||
                                                '-'}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-0 border-b py-4">
                                        <div className="text-sm">
                                            Tgl. Jatuh Tempo Retensi :
                                        </div>
                                        <div className="text-base font-semibold text-neutral-500">
                                            {formatDate(
                                                proyekData.jatuh_tempo_retensi
                                            ) || '-'}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-0  border-b md:border-0  py-4">
                                        <div className="text-sm">
                                            Status Retensi :
                                        </div>
                                        <div className="text-base font-semibold text-neutral-500">
                                            {!isSubmitting &&
                                                (proyekData.status_retensi ===
                                                true ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="text-green-500">
                                                            Sudah Dibayar
                                                        </div>
                                                        <Button
                                                            size="xs"
                                                            variant="solid"
                                                            onClick={
                                                                handleOpenStatusChangeDialog
                                                            }
                                                        >
                                                            Ubah Status
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <div className="text-rose-500">
                                                            Belum Bayar
                                                        </div>
                                                        <Button
                                                            size="xs"
                                                            variant="solid"
                                                            onClick={
                                                                handleOpenStatusChangeDialog
                                                            }
                                                        >
                                                            Ubah Status
                                                        </Button>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* batas */}
                            <div className="flex flex-col gap-0  py-4">
                                <div className="text-sm">Keterangan :</div>
                                <div className="text-base font-semibold text-neutral-500">
                                    {proyekData.keterangan || '-'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subkontraktor */}
                {/* <div className="flex flex-col gap-4 border-b border-gray-200 py-6">
                    <DescriptionSection
                        title="Informasi Subkontraktor"
                        desc="Informasi subkontraktor proyek"
                    />
                    {proyekData.SubkonProjects && (
                        <div className="rounded-lg border border-gray-200 dark:border-gray-600">
                            {proyekData.SubkonProjects?.map((data, index) => (
                                <section
                                    key={data.id}
                                    className={classNames(
                                        'flex items-center px-4 py-6 group',
                                        !isLastChild(
                                            proyekData.SubkonProjects as [],
                                            index
                                        ) &&
                                            'border-b border-gray-200 dark:border-gray-600'
                                    )}
                                >
                                    <div className="flex items-center">
                                        <div className="text-3xl">
                                            <BiHardHat />
                                        </div>
                                        <div className="ml-3 rtl:mr-3">
                                            <div className="flex items-center gap-1">
                                                <div className="text-gray-900 dark:text-gray-100 font-semibold">
                                                    {data.nama}
                                                </div>
                                                <span>
                                                    ({data.nomor_surat})
                                                </span>
                                            </div>
                                            <div>
                                                {data.nilai_subkontrak?.toLocaleString(
                                                    'id-ID'
                                                )}
                                            </div>
                                            <span>
                                                {formatDate(
                                                    data.waktu_mulai_pelaksanaan ||
                                                        ''
                                                )}{' '}
                                                s.d.{' '}
                                                {formatDate(
                                                    data.waktu_selesai_pelaksanaan ||
                                                        ''
                                                )}
                                            </span>
                                            <div>{data.keterangan}</div>
                                        </div>
                                    </div>
                                </section>
                            ))}
                        </div>
                    )}
                    {!proyekData.SubkonProjects && (
                        <div>Subkontraktor tidak terdaftar</div>
                    )}
                </div> */}
            </div>
            <ConfirmDialog
                isOpen={statusChangeDialogOpen}
                onClose={cancelStatusChange}
                onRequestClose={cancelStatusChange}
                onCancel={cancelStatusChange}
                type="warning"
                title="Ubah Status"
                onConfirm={confirmStatusChange}
            >
                <p>
                    Apakah kamu yakin ingin mengubah status retensi berkas
                    menjadi{' '}
                    <strong>
                        {statusChangeItem?.newStatus
                            ? 'sudah dibayar'
                            : 'belum dibayar'}
                    </strong>
                    ?
                </p>
            </ConfirmDialog>
        </section>
    )
}
