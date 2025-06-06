import { useState, useEffect } from 'react'
import { LuFilePlus2 } from 'react-icons/lu'
import DescriptionSection from './DesriptionSection'
import { injectReducer, useAppDispatch } from '@/store'
import AdaptableCard from '@/components/shared/AdaptableCard'
import { ConfirmDialog, Loading } from '@/components/shared'
import { Button, Notification, toast } from '@/components/ui'
import reducer, {
    useAppSelector,
    getAdendumsByProyek,
    toggleDeleteConfirmation,
} from '@/views/manajemenProyek/adendum/AdendumList/store'
import { formatDate } from '@/utils/formatDate'
import { formatRupiah } from '@/utils/formatStringRupiah'
import { HiOutlineTrash } from 'react-icons/hi'
import { apiDeleteAdendum } from '@/services/AdendumService'

injectReducer('adendumList', reducer)

export default function Adendum() {
    const [idAdendum, setIdAdendum] = useState('')

    const projectId = location.pathname.substring(
        location.pathname.lastIndexOf('/') + 1
    )

    const dispatch = useAppDispatch()

    const adendumByProyekData = useAppSelector(
        (state) => state.adendumList.data.adendumsByProyekList
    )

    const loadingAdendumsByProyek = useAppSelector(
        (state) => state.adendumList.data.loadingAdendumsByProyek
    )
    const dialogDelete = useAppSelector(
        (state) => state.adendumList.data.deleteConfirmation
    )

    // Fetch adendums when component mounts
    useEffect(() => {
        const requestParam = { id: projectId }

        dispatch(getAdendumsByProyek(requestParam))

        // Create an async function inside useEffect
        const fetchProyek = async () => {
            try {
                await getAdendumsByProyek(requestParam)
            } catch (error) {
                // Show error notification
                toast.push(
                    <Notification title="Error" type="danger" duration={2500}>
                        {'Gagal mendapatkan data proyekId'}
                    </Notification>,
                    { placement: 'top-center' }
                )
            }
        }

        fetchProyek()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, projectId])

    // Success notification helper
    const popNotification = (keyword: string) => {
        toast.push(
            <Notification
                title={`Berhasil ${keyword}`}
                type="success"
                duration={2500}
            >
                Data adendum berhasil {keyword}
            </Notification>,
            {
                placement: 'top-center',
            }
        )
    }

    const handleConfirmDelete = (idAdendum: number) => {
        setIdAdendum(idAdendum)
        dispatch(toggleDeleteConfirmation(true))
    }

    const handleDeleteAdendum = async () => {
        // setDeleteIndex(index)
        // setDialogOpen(true)
        try {
            const success = await apiDeleteAdendum({ id: idAdendum })

            if (success.data.statusCode === 200) {
                popNotification('dihapus')
                dispatch(getAdendumsByProyek({ id: projectId }))
            }
        } catch (error) {
            console.error(`Error hapus termin:`, error)
            toast.push(
                <Notification title={`Failed`} type="danger" duration={2500}>
                    {error.response.data.message}
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        } finally {
            dispatch(toggleDeleteConfirmation(false))
        }
    }

    const handleCancelDeleteAdendum = () => {
        dispatch(toggleDeleteConfirmation(false))
    }

    return (
        <Loading loading={loadingAdendumsByProyek}>
            <AdaptableCard divider>
                <div className="flex justify-between items-center mb-4">
                    <DescriptionSection
                        title="Informasi Adendum"
                        desc="Informasi adendum proyek"
                    />
                </div>
                <div className="overflow-x-auto">
                    {/* Timeline */}
                    {adendumByProyekData && adendumByProyekData.length > 0 ? (
                        adendumByProyekData.map((item, index) => (
                            <div
                                className={`flex flex-row items-center p-6 relative min-w-[540px]
                    ${
                        index === 0
                            ? 'rounded-t-md border'
                            : index === adendumByProyekData.length - 1
                            ? 'rounded-b-md border-b border-x'
                            : 'border-b border-x'
                    }`}
                                key={item.id}
                            >
                                <div className="text-3xl mr-4" key={item.id}>
                                    <LuFilePlus2 className="text-indigo-500" />
                                </div>
                                <div className="w-full space-y-2 ">
                                    <div className="flex flex-row justify-between">
                                        <div className="text-gray-900 dark:text-gray-100 font-semibold">
                                            {item.dasar_adendum === 'Timeline'
                                                ? 'Adendum Timeline'
                                                : item.dasar_adendum ===
                                                  'Lokasi'
                                                ? 'Adendum Lokasi'
                                                : 'Adendum Nilai Kontrak'}
                                            {item.status ===
                                            'Tidak Disetujui' ? (
                                                <span className="text-red-500">
                                                    {' '}
                                                    (Ditolak)
                                                </span>
                                            ) : item.status ===
                                              'Sudah Disetujui' ? (
                                                <span className="text-green-500">
                                                    {' '}
                                                    (Disetujui)
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">
                                                    {' '}
                                                    ( Belum Disetujui)
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="absolute right-0 -top-2 bg-slate-100 text-gray-500 px-4 rounded-bl-md py-2 text-xs">
                                        Tanggal: {formatDate(item.tanggal)}
                                    </div>

                                    <div className="flex flex-row">
                                        <div className="flex-1">
                                            {/* Timeline */}
                                            {item.dasar_adendum ===
                                                'Timeline' &&
                                                item.DetailAdendums.map(
                                                    (
                                                        detail: any,
                                                        index: number
                                                    ) => (
                                                        <div
                                                            key={index}
                                                            className="grid grid-cols-2 gap-2"
                                                        >
                                                            <div>
                                                                {detail.nama_column ===
                                                                'timeline_awal'
                                                                    ? 'T.awal'
                                                                    : 'T.akhir'}{' '}
                                                                sebelum :{' '}
                                                                {formatDate(
                                                                    detail.value_sebelum
                                                                )}
                                                            </div>
                                                            <div>
                                                                {detail.nama_column ===
                                                                'timeline_awal'
                                                                    ? 'T.awal'
                                                                    : 'T.akhir'}{' '}
                                                                sesudah :{' '}
                                                                {formatDate(
                                                                    detail.value_adendum
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                )}

                                            {/* Nilai Kontrak */}
                                            {item.dasar_adendum ===
                                                'Nilai Kontrak' &&
                                                item.DetailAdendums.map(
                                                    (
                                                        detail: any,
                                                        index: number
                                                    ) => (
                                                        <div
                                                            key={index}
                                                            className="grid grid-cols-2 gap-2"
                                                        >
                                                            <div>
                                                                Nilai kontrak
                                                                sebelum :{' '}
                                                                {formatRupiah(
                                                                    detail.value_sebelum
                                                                )}
                                                            </div>
                                                            <div>
                                                                Nilai kontrak
                                                                sesudah :{' '}
                                                                {formatRupiah(
                                                                    detail.value_adendum
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                )}

                                            {/* Lokasi */}
                                            {item.dasar_adendum === 'Lokasi' &&
                                                item.DetailAdendums.map(
                                                    (
                                                        detail: any,
                                                        index: number
                                                    ) => (
                                                        <div
                                                            key={index}
                                                            className="grid grid-cols-2 gap-2"
                                                        >
                                                            <div>
                                                                {detail.nama_column ===
                                                                'lokasi'
                                                                    ? 'Lokasi'
                                                                    : detail.nama_column ===
                                                                      'longitude'
                                                                    ? 'Longitude'
                                                                    : 'Latitude'}{' '}
                                                                sebelum :{' '}
                                                                {
                                                                    detail.value_sebelum
                                                                }
                                                            </div>
                                                            <div>
                                                                {detail.nama_column ===
                                                                'lokasi'
                                                                    ? 'Lokasi'
                                                                    : detail.nama_column ===
                                                                      'longitude'
                                                                    ? 'Longitude'
                                                                    : 'Latitude'}{' '}
                                                                sesudah :{' '}
                                                                {
                                                                    detail.value_adendum
                                                                }
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                        </div>

                                        {/* Delete Button */}
                                        <div>
                                            {item.status ===
                                                'Belum Disetujui' && (
                                                <Button
                                                    type="button"
                                                    shape="circle"
                                                    variant="plain"
                                                    size="sm"
                                                    className="text-red-500"
                                                    icon={<HiOutlineTrash />}
                                                    onClick={() =>
                                                        handleConfirmDelete(
                                                            item.id
                                                        )
                                                    }
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-5">
                            <p className="text-gray-500 dark:text-gray-400">
                                Belum ada adendum untuk proyek ini
                            </p>
                        </div>
                    )}
                </div>
            </AdaptableCard>
            <ConfirmDialog
                isOpen={dialogDelete}
                type="danger"
                title="Hapus Adendum"
                confirmButtonColor="red-600"
                onClose={handleCancelDeleteAdendum}
                onRequestClose={handleCancelDeleteAdendum}
                onCancel={handleCancelDeleteAdendum}
                onConfirm={handleDeleteAdendum}
            >
                <p>Apakah kamu yakin ingin menghapus adendum ini?</p>
            </ConfirmDialog>
        </Loading>
    )
}
