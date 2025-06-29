import { useEffect, useMemo, useRef } from 'react'
import DataTable from '@/components/shared/DataTable'
import {
    HiOutlineDocumentAdd,
    HiOutlinePencil,
    HiOutlineTrash,
} from 'react-icons/hi'
import {
    getTenders,
    setTableData,
    toggleDeleteConfirmation,
    useAppDispatch,
    useAppSelector,
    setUpdateConfirmation,
    setSelectedTender,
    setTenderStatus,
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
import { Button } from '@/components/ui'
import TenderUpdateStatusConfirmation from './TenderUpdateStatusConfirmation'

type Product = {
    id: string
    pekerjaan: string
    nilai_kontrak: string
    tanggal_pengajuan: string
    client: string
    idClient?: string
    idDivisi?: string
    status: string
}

const ActionColumn = ({ row }: { row: Product }) => {
    const dispatch = useAppDispatch()
    const { textTheme } = useThemeClass()
    const navigate = useNavigate()

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
                    <span
                        className={`cursor-pointer p-2 hover:${textTheme}`}
                        onClick={onEdit}
                    >
                        <HiOutlinePencil />
                    </span>
                    <span
                        className="cursor-pointer p-2 hover:text-red-500"
                        onClick={onDelete}
                    >
                        <HiOutlineTrash />
                    </span>
                </>
            ) : row.status === 'Diterima' ? (
                <span
                    className={`cursor-pointer p-2 hover:${textTheme}`}
                    onClick={onCreateProject}
                >
                    <HiOutlineDocumentAdd />
                </span>
            ) : null}
        </div>
    )
}

const TenderTable = () => {
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
                                    Pengajuan
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
                                <span className="text-green-500">Menang</span>
                            ) : row.status === 'Ditolak' ? (
                                <span className="text-rose-500">Kalah</span>
                            ) : row.status === 'Diproses' ? (
                                <div className="gap-2 flex flex-col">
                                    <span className="text-indigo-500">
                                        Diproses
                                    </span>{' '}
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
                                <span className="text-gray-500">
                                    {row.status}
                                </span>
                            )}
                        </span>
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
            />
            <TenderDeleteConfirmation />
            <TenderUpdateStatusConfirmation />
        </>
    )
}

export default TenderTable
