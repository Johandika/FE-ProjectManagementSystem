import { useEffect, useMemo, useRef } from 'react'
import { HiOutlineChevronDown, HiOutlineChevronRight } from 'react-icons/hi'
import {
    getAdendums,
    setTableData,
    useAppDispatch,
    useAppSelector,
    toggleUpdateConfirmation,
    setSelectedAdendum,
    setAdendumStatus,
} from '../store'
// import AdendumDeleteConfirmation from './AdendumDeleteConfirmation'
import cloneDeep from 'lodash/cloneDeep'
import type { ColumnDef } from '@/components/shared/DropdDataTableDropdown'
import DataTableDropdown from '@/components/shared/DataTableDropdown'
import { Button } from '@/components/ui'
import AdendumUpdateStatusConfirmation from './AdendumUpdateStatusConfirmation'
import { formatDate } from '@/utils/formatDate'

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

    const handleApproveClick = (
        e: React.MouseEvent<HTMLSpanElement, MouseEvent>
    ) => {
        e.stopPropagation()
        dispatch(toggleUpdateConfirmation(true))
        dispatch(setSelectedAdendum(row.id))
        dispatch(setAdendumStatus('Terima'))
    }

    const handleRejectClick = (
        e: React.MouseEvent<HTMLSpanElement, MouseEvent>
    ) => {
        e.stopPropagation()
        dispatch(toggleUpdateConfirmation(true))
        dispatch(setSelectedAdendum(row.id))
        dispatch(setAdendumStatus('Tolak'))
    }

    return (
        <div className="flex justify-end gap-2">
            {row.status === 'Belum Disetujui' && (
                <>
                    <Button
                        size="sm"
                        variant="solid"
                        onClick={(e) => handleApproveClick(e)}
                    >
                        Terima
                    </Button>
                    <Button size="sm" onClick={(e) => handleRejectClick(e)}>
                        Tolak
                    </Button>
                </>
            )}
            {row.status === 'Sudah Disetujui' && (
                <div className="text-green-600 px-4 rounded-lg py-2 bg-green-100">
                    {row.status}
                </div>
            )}
            {row.status === 'Tidak Disetujui' && (
                <div className="text-red-600 px-4 rounded-lg py-2 bg-red-50">
                    {row.status}
                </div>
            )}
        </div>
    )
}

const AdendumTable = () => {
    const tableRef = useRef<DataTableResetHandle>(null)

    const dispatch = useAppDispatch()

    const { pageIndex, pageSize, query, total } = useAppSelector(
        (state) => state.adendumList.data.tableData
    )

    const filterData = useAppSelector(
        (state) => state.adendumList.data.filterData
    )

    const loading = useAppSelector((state) => state.adendumList.data.loading)

    const data = useAppSelector((state) => state.adendumList.data.adendumsList)

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
            getAdendums({
                page: pageIndex,
                limit: pageSize,
                query,
                filterData: filterData,
            })
        )
    }

    const columns: ColumnDef<Product>[] = useMemo(
        () => [
            {
                header: () => null,
                id: 'expander',
                cell: ({ row }) => (
                    <>
                        {row.getCanExpand() ? (
                            <button
                                className="text-lg"
                                {...{ onClick: row.getToggleExpandedHandler() }}
                            >
                                {row.getIsExpanded() ? (
                                    <HiOutlineChevronDown />
                                ) : (
                                    <HiOutlineChevronRight />
                                )}
                            </button>
                        ) : null}
                    </>
                ),
                subCell: () => null,
            },
            {
                header: 'Dasar Adendum',
                accessorKey: 'dasar_adendum',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="capitalize">{row.dasar_adendum}</span>
                    )
                },
            },
            {
                header: 'Tanggal',
                accessorKey: 'tanggal',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="capitalize">
                            {formatDate(row.tanggal)}
                        </span>
                    )
                },
            },
            {
                header: 'Pekerjaan',
                accessorKey: 'pekerjaan',
                minWidth: 350,
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="capitalize">
                            {row.Project.pekerjaan}
                        </span>
                    )
                },
            },

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
            <AdendumUpdateStatusConfirmation />
        </>
    )
}

export default AdendumTable
