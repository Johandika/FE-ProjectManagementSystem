import { useEffect, useMemo, useRef } from 'react'
import DataTable from '@/components/shared/DataTable'
import {
    HiOutlineDocumentAdd,
    HiOutlinePencil,
    HiOutlineTrash,
} from 'react-icons/hi'
import { GiProgression } from 'react-icons/gi'
import {
    getTenders,
    setTableData,
    toggleDeleteConfirmation,
    useAppDispatch,
    useAppSelector,
    setUpdateConfirmation,
    setSelectedTender,
    setTenderStatus,
    setProgressConfirmation,
    setProgress,
} from '../store'
import useThemeClass from '@/utils/hooks/useThemeClass'
import TenderDeleteConfirmation from './TenderDeleteConfirmation'
import { useNavigate } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep'
import type {
    DataTableResetHandle,
    OnSortParam,
    ColumnDef,
} from '@/components/shared/DataTable'
import { formatDate } from '@/utils/formatDate'
import { Button, Tooltip } from '@/components/ui'
import TenderUpdateStatusConfirmation from './TenderUpdateStatusConfirmation'
import TenderUpdateProgress from './TenderUpdateProgress'

type Product = {
    id: string
    pekerjaan: string
    nilai_kontrak: string
    tanggal_pengajuan: string
    client: string
    idClient?: string
    idDivisi?: string
    status: string
    progress: number
}

const ActionColumn = ({ row }: { row: Product }) => {
    const dispatch = useAppDispatch()
    const { textTheme } = useThemeClass()
    const navigate = useNavigate()

    const onProgressUpdate = () => {
        dispatch(setProgressConfirmation(true))
        dispatch(setSelectedTender(row.id))
        dispatch(setProgress(row.progress))
    }

    const onCreateProject = () => {
        navigate(`/manajemen-proyek-new`, {
            state: {
                idTender: row.id,
                pekerjaan: row.pekerjaan,
                nilai_kontrak: row.nilai_kontrak,
                idClient: row.idClient,
                idDivisi: row.idDivisi,
            },
        })
    }

    const onEdit = () => {
        navigate(`/manajemen-proyek/tender-edit/${row.id}`)
    }

    const onDelete = () => {
        dispatch(toggleDeleteConfirmation(true))
        dispatch(setSelectedTender(row.id))
    }

    return (
        <div className="flex justify-end text-lg">
            {row.status === 'Pengajuan' ? (
                <>
                    <Tooltip title="Progress">
                        <span
                            className={`cursor-pointer p-2 hover:${textTheme}`}
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                onProgressUpdate()
                            }}
                        >
                            <GiProgression />
                        </span>
                    </Tooltip>
                    <span
                        className={`cursor-pointer p-2 hover:${textTheme}`}
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            onEdit()
                        }}
                    >
                        <HiOutlinePencil />
                    </span>
                    <span
                        className="cursor-pointer p-2 hover:text-red-500"
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            onDelete()
                        }}
                    >
                        <HiOutlineTrash />
                    </span>
                </>
            ) : row.status === 'Diterima' ? (
                <>
                    <Tooltip title="Progress">
                        <span
                            className={`cursor-pointer p-2 hover:${textTheme}`}
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                onProgressUpdate()
                            }}
                        >
                            <GiProgression />
                        </span>
                    </Tooltip>
                    <Tooltip title="Tambah Proyek">
                        <span
                            className={`cursor-pointer p-2 hover:${textTheme}`}
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                onCreateProject()
                            }}
                        >
                            <HiOutlineDocumentAdd />
                        </span>
                    </Tooltip>
                    <span
                        className={`cursor-pointer p-2 hover:${textTheme}`}
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            onEdit()
                        }}
                    >
                        <HiOutlinePencil />
                    </span>
                    <span
                        className="cursor-pointer p-2 hover:text-red-500"
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            onDelete()
                        }}
                    >
                        <HiOutlineTrash />
                    </span>
                </>
            ) : (
                <>
                    <Tooltip title="Progress">
                        <span
                            className={`cursor-pointer p-2 hover:${textTheme}`}
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                onProgressUpdate()
                            }}
                        >
                            <GiProgression />
                        </span>
                    </Tooltip>

                    <span
                        className={`cursor-pointer p-2 hover:${textTheme}`}
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            onEdit()
                        }}
                    >
                        <HiOutlinePencil />
                    </span>
                    <span
                        className="cursor-pointer p-2 hover:text-red-500"
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            onDelete()
                        }}
                    >
                        <HiOutlineTrash />
                    </span>
                </>
            )}
        </div>
    )
}

const TenderTable = () => {
    const navigate = useNavigate()
    const tableRef = useRef<DataTableResetHandle>(null)

    const dispatch = useAppDispatch()

    const user = useAppSelector((state) => state.auth.user)

    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.tenderList.data.tableData
    )

    const filterData = useAppSelector(
        (state) => state.tenderList.data.filterData
    )

    const loading = useAppSelector((state) => state.tenderList.data.loading)

    const data = useAppSelector((state) => state.tenderList.data.productList)

    // Setelah diubah
    const handleRowClick = (row: any) => {
        if (row.status === 'Diterima') {
            navigate(`/manajemen-tender-detail/${row.id}`)
        }
    }

    useEffect(() => {
        fetchData()
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
            getTenders({
                page: pageIndex,
                limit: pageSize,
                sort,
                query,
                filterData: filterData,
            })
        )
    }

    const handleUpdateStatus = async (status: string, id: string) => {
        dispatch(setUpdateConfirmation(true))
        dispatch(setSelectedTender(id))
        dispatch(setTenderStatus(status))
    }

    const columns: ColumnDef<Product>[] = useMemo(() => {
        const baseColumns: ColumnDef<Product>[] = [
            {
                header: 'Pekerjaan',
                accessorKey: 'pekerjaan',
                minWidth: 350,
                cell: (props) => {
                    const row = props.row.original
                    return <span className="capitalize">{row.pekerjaan}</span>
                },
            },
            {
                header: 'Nilai Kontrak',
                accessorKey: 'nilai_kontrak',
                minWidth: 150,
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="capitalize">
                            Rp {row.nilai_kontrak.toLocaleString('id-ID')}
                        </span>
                    )
                },
            },
            {
                header: 'Klien',
                accessorKey: 'client',
                minWidth: 150,
                cell: (props) => {
                    const row = props.row.original

                    return <span className="capitalize">{row.client}</span>
                },
            },
            {
                header: 'Divisi',
                accessorKey: 'idDivisi',
                minWidth: 150,
                cell: (props) => {
                    const row = props.row.original

                    return <span>{row.Divisi?.name}</span>
                },
            },
            {
                header: 'Tgl. Pengajuan',
                accessorKey: 'tanggal_pengajuan',
                minWidth: 150,
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="capitalize">
                            {formatDate(row.tanggal_pengajuan)}
                        </span>
                    )
                },
            },
            {
                header: 'Status',
                accessorKey: 'status',
                minWidth: 150,
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="capitalize">
                            {row.status === 'Pengajuan' ? (
                                <div className="gap-2 flex flex-col">
                                    <div className="text-gray-500 px-4 rounded-lg py-2 bg-gray-200 text-center">
                                        Pengajuan
                                    </div>{' '}
                                    <div className="flex flex-row gap-2">
                                        <Button
                                            size="xs"
                                            variant="solid"
                                            disabled={
                                                user?.authority === 'Owner'
                                            }
                                            onClick={(e) => {
                                                handleUpdateStatus(
                                                    'Diproses',
                                                    row.id
                                                )
                                                e.stopPropagation()
                                            }}
                                        >
                                            Diproses
                                        </Button>
                                        <Button
                                            size="xs"
                                            variant="solid"
                                            disabled={
                                                user?.authority === 'Owner'
                                            }
                                            color="gray-500"
                                            onClick={(e) => {
                                                handleUpdateStatus(
                                                    'Batal',
                                                    row.id
                                                )
                                                e.stopPropagation()
                                            }}
                                        >
                                            Batal
                                        </Button>
                                    </div>
                                </div>
                            ) : row.status === 'Diterima' ? (
                                <div className="text-green-600 px-4 rounded-lg py-2 bg-green-100 text-center">
                                    Menang
                                </div>
                            ) : row.status === 'Ditolak' ? (
                                <div className="text-rose-500 px-4 rounded-lg py-2 bg-rose-100 text-center">
                                    Kalah
                                </div>
                            ) : row.status === 'Diproses' ? (
                                <div className="gap-2 flex flex-col">
                                    <div className="text-indigo-500 px-4 rounded-lg py-2 bg-indigo-100 text-center">
                                        Diproses
                                    </div>{' '}
                                    <div className="flex flex-row gap-2">
                                        <Button
                                            size="xs"
                                            variant="solid"
                                            color="green"
                                            disabled={
                                                user?.authority === 'Owner'
                                            }
                                            onClick={(e) => {
                                                handleUpdateStatus(
                                                    'Diterima',
                                                    row.id
                                                )
                                                e.stopPropagation()
                                            }}
                                        >
                                            Diterima
                                        </Button>
                                        <Button
                                            size="xs"
                                            variant="solid"
                                            disabled={
                                                user?.authority === 'Owner'
                                            }
                                            color="rose"
                                            onClick={(e) => {
                                                handleUpdateStatus(
                                                    'Ditolak',
                                                    row.id
                                                )
                                                e.stopPropagation()
                                            }}
                                        >
                                            Ditolak
                                        </Button>
                                        <Button
                                            size="xs"
                                            variant="solid"
                                            disabled={
                                                user?.authority === 'Owner'
                                            }
                                            color="gray-500"
                                            onClick={(e) => {
                                                handleUpdateStatus(
                                                    'Batal',
                                                    row.id
                                                )
                                                e.stopPropagation()
                                            }}
                                        >
                                            Batal
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-gray-500 px-4  rounded-lg py-2 bg-gray-200 text-center">
                                    {row.status}
                                </div>
                            )}
                        </span>
                    )
                },
            },
            {
                header: 'Progress',
                accessorKey: 'progress',
                minWidth: 150,
                cell: (props) => {
                    const row = props.row.original
                    return <span>{row.progress}%</span>
                },
            },
            {
                header: 'Prioritas',
                accessorKey: 'prioritas',
                minWidth: 150,
                cell: (props) => {
                    const row = props.row.original
                    return <span>{row.prioritas || '-'}</span>
                },
            },
            {
                header: 'Dibuat Oleh',
                accessorKey: 'User.nama',
                minWidth: 150,
                cell: (props) => {
                    const row = props.row.original
                    return <span>{row.User?.nama}</span>
                },
            },
            {
                header: 'Keterangan',
                accessorKey: 'KeteranganTenders[0].keterangan',
                minWidth: 260,
                cell: (props) => {
                    const row = props.row.original
                    return <span>{row.KeteranganTenders[0]?.keterangan}</span>
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
    }, [user])

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
                    totalPage: tableData.totalPage as number, // Tambahkan jika diperlukan
                }}
                onPaginationChange={onPaginationChange}
                onSelectChange={onSelectChange}
                onSort={onSort}
                onRowClick={handleRowClick}
            />
            <TenderDeleteConfirmation />
            <TenderUpdateStatusConfirmation />
            <TenderUpdateProgress />
        </>
    )
}

export default TenderTable
