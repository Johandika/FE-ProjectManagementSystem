import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import DataTable from '@/components/shared/DataTable'
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import {
    getProyeks,
    setTableData,
    setSelectedProyek,
    toggleDeleteConfirmation,
    toggleUpdateConfirmation,
    useAppDispatch,
    useAppSelector,
    getKliens,
    setProjectStatus,
} from '../store'
import useThemeClass from '@/utils/hooks/useThemeClass'
import ProyekDeleteConfirmation from './ProyekDeleteConfirmation'
import ProyekUpdateStatusConfirmation from './ProyekUpdateStatusConfirmation'
import { useNavigate } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep'
import type {
    DataTableResetHandle,
    OnSortParam,
    ColumnDef,
} from '@/components/shared/DataTable'
import { IoLocationSharp } from 'react-icons/io5'
import { AiFillCreditCard } from 'react-icons/ai'
import { formatDate } from '@/utils/formatDate'
import { Button, Dialog } from '@/components/ui'
import reducer, { getAllNotification } from '@/views/notifikasi/store'
import { injectReducer } from '@/store'

type Proyek = {
    id: string
    pekerjaan: string
    pic: string
    client: string
    idTender: string
    nomor_kontrak: number
    tanggal_service_po: string
    tanggal_delivery: string
    tanggal_kontrak: string
    nilai_kontrak: number
    uang_muka: number
    realisasi: number
    progress: number
    status: string
    idKlien: string
    Lokasis?: Array<{
        lokasi: string
        latitude: number
        longitude: number
    }>
}

const ActionColumn = ({ row }: { row: Proyek }) => {
    const dispatch = useAppDispatch()
    const { textTheme } = useThemeClass()
    const navigate = useNavigate()
    const user = useAppSelector((state) => state.auth.user)

    const onEdit = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        e.stopPropagation()
        navigate(`/manajemen-proyek-edit/${row.id}`)
    }

    const onDelete = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        e.stopPropagation()
        dispatch(toggleDeleteConfirmation(true))
        dispatch(setSelectedProyek(row.id))
    }

    return (
        <div className="flex justify-end text-lg">
            {(user.authority === 'Super Admin' ||
                user.authority === 'Owner' ||
                user.authority === 'Developer') && (
                <span
                    className={`cursor-pointer p-2 hover:${textTheme}`}
                    onClick={(e) => onEdit(e)}
                >
                    <HiOutlinePencil />
                </span>
            )}
            <span
                className="cursor-pointer p-2 hover:text-red-500"
                onClick={(e) => onDelete(e)}
            >
                <HiOutlineTrash />
            </span>
        </div>
    )
}

const ProyekTable = () => {
    const navigate = useNavigate()
    const tableRef = useRef<DataTableResetHandle>(null)

    const dispatch = useAppDispatch()

    const [isLokasiDialogOpen, setLokasiDialogOpen] = useState(false)
    const [selectedLokasis, setSelectedLokasis] = useState<Proyek['Lokasis']>(
        []
    )

    const user = useAppSelector((state) => state.auth.user)

    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.proyekList.data.tableData
    )

    const filterData = useAppSelector(
        (state) => state.proyekList.data.filterData
    )

    const loading = useAppSelector((state) => state.proyekList.data.loading)

    const proyekData = useAppSelector(
        (state) => state.proyekList.data.proyekList
    )

    const kliensList = useAppSelector(
        (state) => state.proyekList.data.kliensList
    )

    // Handler for row click to navigate to detail page
    const handleRowClick = (row: Proyek) => {
        // e.stopPropagation()
        navigate(`/manajemen-proyek-detail/${row.id}`)
    }

    // Process the data to include client names
    const data = useMemo(() => {
        // Periksa apakah proyekData.data adalah array
        if (!proyekData.data || !Array.isArray(proyekData.data)) {
            return []
        }

        return proyekData.data?.map((proyek) => {
            // Find the matching client
            const client = kliensList.find(
                (client) => client.id === proyek.idKlien
            )

            // Return proyek object with client name from kliensList
            return {
                ...proyek,
                klien: client ? client.nama : 'Klien Tidak Ditemukan',
            }
        })
    }, [proyekData, kliensList])

    useEffect(() => {
        fetchData()
        dispatch(getKliens()) // kliens
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex, pageSize, sort, filterData])

    useEffect(() => {
        if (tableRef) {
            tableRef.current?.resetSorting()
        }
    }, [filterData])

    const tableData = useMemo(
        () => ({ pageIndex, pageSize, sort, query, total }),
        [pageIndex, pageSize, sort, query, total]
    )

    const fetchData = () => {
        dispatch(
            getProyeks({
                page: pageIndex,
                limit: pageSize,
                query,
                filterData: filterData,
            })
        )
    }

    const onUpdate = useCallback(
        (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, row: any) => {
            e.stopPropagation()
            dispatch(toggleUpdateConfirmation(true))
            dispatch(setSelectedProyek(row.id))
            dispatch(setProjectStatus(row.status))
        },
        [dispatch]
    )

    // 4. Buat fungsi handler untuk dialog
    const handleLihatLokasi = (lokasis: Proyek['Lokasis']) => {
        setSelectedLokasis(lokasis || [])
        setLokasiDialogOpen(true)
    }

    const onLokasiDialogClose = () => {
        setLokasiDialogOpen(false)
    }

    // Komponen kecil untuk merender satu item lokasi (agar tidak duplikasi kode)
    const LokasiLink = ({ loc, index }: { loc: any; index: number }) => (
        <a
            key={index}
            href={`http://maps.google.com/maps?q=${loc.latitude},${loc.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="text-sm font-medium flex gap-1 items-center group-hover:text-blue-600 transition">
                <div className="text-lg group-hover:scale-110 transition">
                    <IoLocationSharp />
                </div>
                <div className="group-hover:underline">{loc.lokasi}</div>
            </div>
        </a>
    )

    const columns: ColumnDef<Proyek>[] = useMemo(() => {
        const baseColumns: ColumnDef<Proyek>[] = [
            {
                header: 'Pekerjaan',
                accessorKey: 'pekerjaan',
                row: 100,
                minWidth: 350,
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex flex-col gap-1">
                            <div className="text-blue-600 text-xs font-semibold capitalize">
                                {row.client}
                            </div>
                            <div className="text-base font-medium text-neutral-800">
                                {row.idTender && (
                                    <span className="bg-emerald-100 text-emerald-600 w-[20px] h-[20px] px-[6px] py-[2px]  mr-2 text-xs font-semibold rounded-md">
                                        Tender
                                    </span>
                                )}
                                {row.pekerjaan}
                            </div>
                            <div className="text-blue-600 text-xs font-semibold">
                                {row.pic}
                            </div>
                        </div>
                    )
                },
            },
            {
                header: 'Nomor Kontrak',
                accessorKey: 'nomor_kontrak',
                minWidth: 200,
                cell: (props) => {
                    const row = props.row.original
                    console.log(row)
                    return (
                        <div>
                            {row.nomor_kontrak || row.tanggal_kontrak ? (
                                <>
                                    {row.nomor_kontrak && (
                                        <div className="capitalize mb-1">
                                            {row.nomor_kontrak}
                                        </div>
                                    )}
                                    {row.tanggal_kontrak && (
                                        <div className="bg-blue-600 text-xs rounded-md px-3 py-[3px] text-center text-white w-fit">
                                            {formatDate(row.tanggal_kontrak)}
                                        </div>
                                    )}
                                    {row.timeline_awal && (
                                        <div className="text-xs mt-1 rounded-md text-center text-slate-500 w-fit">
                                            T.Awal:{' '}
                                            {formatDate(row.timeline_awal)}
                                        </div>
                                    )}
                                    {row.timeline_akhir && (
                                        <div className="text-xs mt-1 rounded-md text-center text-slate-500 w-fit">
                                            T.Akhir:{' '}
                                            {formatDate(row.timeline_akhir)}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div>-</div>
                            )}
                        </div>
                    )
                },
            },

            {
                header: 'Lokasi',
                accessorKey: 'lokasi',
                minWidth: 200,
                cell: (props) => {
                    const row = props.row.original
                    const lokasis = row.Lokasis || []
                    const limit = 3

                    return (
                        <div className="flex flex-col gap-1">
                            {lokasis.length > 0 ? (
                                <>
                                    {lokasis
                                        .slice(0, limit)
                                        .map((loc, index) => (
                                            <LokasiLink
                                                loc={loc}
                                                index={index}
                                                key={index}
                                            />
                                        ))}
                                    {lokasis.length > limit && (
                                        <Button
                                            size="xs"
                                            variant="solid"
                                            className="mt-2"
                                            onClick={(e) => {
                                                e.stopPropagation() // Mencegah row click
                                                handleLihatLokasi(lokasis)
                                            }}
                                        >
                                            Lihat {lokasis.length - limit}{' '}
                                            Lainnya...
                                        </Button>
                                    )}
                                </>
                            ) : (
                                <span>-</span>
                            )}
                        </div>
                    )
                },
            },
            {
                header: 'Nilai Kontrak',
                accessorKey: 'nilai_kontrak',
                minWidth: 200,
                cell: (props) => {
                    const row = props.row.original

                    // Determine the color based on conditions
                    let textColorClass = 'text-yellow-600' // Default color

                    if (row.realisasi === 0) {
                        textColorClass = 'text-red-500' // Red when realization is 0
                    } else if (row.realisasi === row.nilai_kontrak) {
                        textColorClass = 'text-green-500' // Green when realization equals contract value
                    }

                    return (
                        <div className="flex flex-col">
                            <div className="text-sm font-semibold text-neutral-700">
                                Rp {row.nilai_kontrak.toLocaleString('id-ID')}
                            </div>
                            <div
                                className={`text-xs font-semibold ${textColorClass} gap-1 flex items-center`}
                            >
                                <div className="text-lg">
                                    <AiFillCreditCard className="group-hover:text-blue-600 transition" />
                                </div>
                                <span>
                                    Rp {row.realisasi.toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>
                    )
                },
            },
            {
                header: 'Progress',
                accessorKey: 'progress',
                minWidth: 150,
                cell: (props) => {
                    const row = props.row.original
                    const progress = row.progress || 0

                    return (
                        <div className="flex items-center justify-start">
                            <div className="relative w-16 h-16">
                                {/* Background circle */}
                                <svg
                                    className="w-full h-full"
                                    viewBox="0 0 100 100"
                                >
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="none"
                                        stroke="#a8e6d5"
                                        strokeWidth="15"
                                    />
                                    {/* Progress circle */}
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="none"
                                        stroke="#3cbfa6"
                                        strokeWidth="15"
                                        strokeDasharray={`${
                                            progress * 2.51
                                        } 251`}
                                        strokeDashoffset="0"
                                        transform="rotate(-90 50 50)"
                                    />
                                </svg>
                                {/* Percentage text in the middle */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xs font-medium text-teal-500">
                                        {progress}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                },
            },
            {
                header: 'Status',
                accessorKey: 'status',
                minWidth: 160,
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex flex-col gap-1">
                            {row.status === 'Selesai Sudah tertagih 100%' ? (
                                <span className="capitalize text-green-600">
                                    {row.status}
                                </span>
                            ) : row.status === 'Selesai belum tertagih 100%' ? (
                                <span className="capitalize text-yellow-600">
                                    {row.status}
                                </span>
                            ) : row.status === 'Selesai' ? (
                                <span className="capitalize text-emerald-600">
                                    {row.status}
                                </span>
                            ) : row.status === 'Dalam Proses' ? (
                                <span className="capitalize text-blue-600">
                                    {row.status}
                                </span>
                            ) : (
                                <span className="capitalize">{row.status}</span>
                            )}
                            {(row.status === 'Belum Dimulai' ||
                                row.status ===
                                    'Selesai Sudah tertagih 100%') && (
                                <Button
                                    size="xs"
                                    variant="solid"
                                    color={
                                        row.status === 'Belum Dimulai'
                                            ? 'indigo-600'
                                            : 'emerald-500'
                                    }
                                    onClick={(e) => onUpdate(e, row)}
                                >
                                    {row.status === 'Belum Dimulai'
                                        ? 'Mulai Proyek'
                                        : 'Proyek Selesai'}
                                </Button>
                            )}
                        </div>
                    )
                },
            },
            {
                header: 'Divisi',
                accessorKey: 'idDivisi',
                minWidth: 180,
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex flex-col gap-1">
                            {row.Divisi?.name}
                        </div>
                    )
                },
            },
            {
                header: 'Dibuat Oleh',
                accessorKey: 'dibuatOleh',
                minWidth: 180,
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex flex-col gap-1">
                            {row.User?.nama}
                        </div>
                    )
                },
            },
            {
                header: 'Keterangan',
                accessorKey: 'keterangan',
                minWidth: 260,
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex flex-col gap-1">
                            {row.KeteranganProjects[0]?.keterangan
                                ? row.KeteranganProjects[0]?.keterangan
                                : row.keterangan}
                        </div>
                    )
                },
            },
        ]

        if (user?.authority !== 'Owner') {
            baseColumns.push({
                header: '',
                id: 'action',
                cell: (props) => <ActionColumn row={props.row.original} />,
            })
        }

        return baseColumns
    }, [user, onUpdate])

    const onPaginationChange = (page: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageIndex = page
        dispatch(setTableData(newTableData))
    }

    const onSelectChange = (value: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageSize = Number(value)
        newTableData.pageIndex = 1
        dispatch(setTableData(newTableData))
    }

    const onSort = (sort: OnSortParam) => {
        const newTableData = cloneDeep(tableData)
        newTableData.sort = sort
        dispatch(setTableData(newTableData))
    }

    return (
        <>
            <DataTable
                ref={tableRef}
                columns={columns}
                data={data}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ className: 'rounded-md' }}
                loading={loading}
                pagingData={{
                    total: tableData.total as number,
                    pageIndex: tableData.pageIndex as number,
                    pageSize: tableData.pageSize as number,
                }}
                onPaginationChange={onPaginationChange}
                onSelectChange={onSelectChange}
                onSort={onSort}
                onRowClick={handleRowClick}
            />
            <ProyekDeleteConfirmation />
            <ProyekUpdateStatusConfirmation />
            {/* 6. TAMBAHKAN DIALOG DI SINI */}
            <Dialog
                isOpen={isLokasiDialogOpen}
                onClose={onLokasiDialogClose}
                onRequestClose={onLokasiDialogClose}
                width={600}
            >
                <h5 className="mb-4">Daftar Semua Lokasi</h5>
                <div className="max-h-[60vh] overflow-y-auto">
                    {selectedLokasis?.map((loc, index) => (
                        <div
                            className="py-2 border-b last:border-b-0"
                            key={index}
                        >
                            <LokasiLink loc={loc} index={index} />
                        </div>
                    ))}
                </div>
                <div className="text-right mt-6">
                    <Button variant="solid" onClick={onLokasiDialogClose}>
                        Tutup
                    </Button>
                </div>
            </Dialog>
        </>
    )
}

export default ProyekTable
