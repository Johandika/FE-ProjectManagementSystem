import { useEffect, useMemo, useRef } from 'react'
import { HiOutlineTrash } from 'react-icons/hi'
import {
    // getFakturPajaks,
    setTableData,
    useAppDispatch,
    useAppSelector,
    toggleUpdateConfirmation,
    setSelectedFakturPajak,
    setFakturPajakStatus,
    getNotificationFakturPajaks,
} from '../store'
// import FakturPajakDeleteConfirmation from './FakturPajakDeleteConfirmation'
import cloneDeep from 'lodash/cloneDeep'
import DataTableDropdown, {
    ColumnDef,
} from '@/components/shared/DataTableDropdown'
import { Button, Notification, toast } from '@/components/ui'
import FakturPajakUpdateStatusConfirmation from './FakturPajakUpdateStatusConfirmation'
import { formatDate, formatDateWithTime } from '@/utils/formatDate'
import { apiDeleteOneNotification } from '@/services/NotificationService'

type Product = {
    id: string
    pekerjaan: string
    nilai_kontrak: string
    tanggal_pengajuan: string
    client: string
    idClient?: string
    status: string
}

const ActionColumn = ({ row }: { row: Product }) => {
    const dispatch = useAppDispatch()
    const user = useAppSelector((state) => state.auth.user)

    const handleDeleteClick = async () => {
        try {
            // Panggil API untuk menghapus notifikasi
            const response = await apiDeleteOneNotification(row)

            if (response.data) {
                // Tampilkan notifikasi sukses
                toast.push(
                    <Notification title="Sukses" type="success">
                        Notifikasi berhasil dihapus
                    </Notification>
                )
                // Panggil kembali data notifikasi untuk memperbarui tabel
                dispatch(getNotificationFakturPajaks({}))
            }
        } catch (error) {
            // Tampilkan notifikasi error
            toast.push(
                <Notification title="Gagal" type="danger">
                    Gagal menghapus notifikasi
                </Notification>
            )
            console.error('Error deleting notification:', error)
        }
    }

    return (
        <div className="flex justify-end gap-2">
            <>
                <span
                    className="cursor-pointer p-2 hover:text-red-500"
                    onClick={handleDeleteClick}
                >
                    <HiOutlineTrash />
                </span>
                {/* <Button size="sm" onClick={(e) => handleRejectClick(e)}>
                    Tolak
                </Button> */}
            </>
            {/* {row.status === 'Sudah Disetujui' && (
                <div className="text-green-600 px-4 rounded-lg py-2 bg-green-100">
                    {row.status}
                </div>
            )}
            {row.status === 'Tidak Disetujui' && (
                <div className="text-red-600 px-4 rounded-lg py-2 bg-red-50">
                    {row.status}
                </div>
            )} */}
        </div>
    )
}

const FakturPajakTable = () => {
    const tableRef = useRef<DataTableResetHandle>(null)

    const dispatch = useAppDispatch()

    const { pageIndex, pageSize, query, total } = useAppSelector(
        (state) => state.fakturPajakList.data.tableData
    )

    const filterData = useAppSelector(
        (state) => state.fakturPajakList.data.filterData
    )

    const loading = useAppSelector(
        (state) => state.fakturPajakList.data.loading
    )

    const data = useAppSelector(
        (state) => state.fakturPajakList.data.fakturPajaksList
    )

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex, pageSize])

    useEffect(() => {
        if (tableRef) {
            tableRef.current?.resetSorting()
        }
    }, [filterData])

    const tableData = useMemo(
        () => ({ pageIndex, pageSize, query, total }),
        [pageIndex, pageSize, query, total]
    )

    const fetchData = () => {
        dispatch(
            getNotificationFakturPajaks({
                // page: pageIndex,
                // limit: pageSize,
                // query,
                // filterData: filterData,
            })
        )
    }

    const handleApproveClick = (
        e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
        row: Product
    ) => {
        e.stopPropagation()
        dispatch(toggleUpdateConfirmation(true))
        dispatch(setSelectedFakturPajak(row.FakturPajak.id))
        dispatch(setFakturPajakStatus('Terima'))
    }

    console.log('data', data)
    const columns: ColumnDef<Product>[] = useMemo(
        () => [
            // {
            //     header: () => null,
            //     id: 'expander',
            //     cell: ({ row }) => (
            //         <>
            //             {row.getCanExpand() ? (
            //                 <button
            //                     className="text-lg"
            //                     {...{ onClick: row.getToggleExpandedHandler() }}
            //                 >
            //                     {row.getIsExpanded() ? (
            //                         <HiOutlineChevronDown />
            //                     ) : (
            //                         <HiOutlineChevronRight />
            //                     )}
            //                 </button>
            //             ) : null}
            //         </>
            //     ),
            //     subCell: () => null,
            // },
            {
                header: 'Pesan',
                accessorKey: 'pesan',
                width: 300,
                cell: (props) => {
                    const row = props.row.original
                    return <span className="capitalize">{row.pesan}</span>
                },
            },
            {
                header: 'User',
                accessorKey: 'User.nama',
                cell: (props) => {
                    const row = props.row.original
                    return <span className="capitalize">{row.User.nama}</span>
                },
            },
            {
                header: 'Nomor Faktur',
                accessorKey: 'FakturPajak.nomor',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="capitalize">
                            {row.FakturPajak.nomor}
                        </span>
                    )
                },
            },
            {
                header: 'Nominal',
                accessorKey: 'FakturPajak.nominal',
                width: 150,
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="capitalize">
                            Rp {row.FakturPajak.nominal.toLocaleString('id-ID')}
                        </span>
                    )
                },
            },
            {
                header: 'Tanggal',
                accessorKey: 'tanggal',
                width: 140,
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="capitalize">
                            {formatDateWithTime(row.updatedAt)}
                        </span>
                    )
                },
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div>
                            {row.FakturPajak?.status === 'Sudah Bayar' ? (
                                <div className="flex justify-end gap-2">
                                    <div className="text-green-600 px-4 rounded-lg py-2 bg-green-100">
                                        Sudah Disetujui
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    size="sm"
                                    variant="solid"
                                    onClick={(e) => handleApproveClick(e, row)}
                                >
                                    Setujui
                                </Button>
                            )}
                        </div>
                    )
                },
            },
            // {
            //     header: 'Pekerjaan',
            //     accessorKey: 'pekerjaan',
            //     minWidth: 350,
            //     cell: (props) => {
            //         const row = props.row.original
            //         return (
            //             <span className="capitalize">
            //                 {row.Project.pekerjaan}
            //             </span>
            //         )
            //     },
            // },

            {
                header: '',
                id: 'action',
                cell: (props) => <ActionColumn row={props.row.original} />,
            },
        ],
        []
    )

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

    return (
        <>
            <DataTableDropdown
                ref={tableRef}
                getRowCanExpand={() => true}
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
                // onSort={onSort}
            />
            <FakturPajakUpdateStatusConfirmation />
        </>
    )
}

export default FakturPajakTable
