import { useEffect, useMemo, useRef } from 'react'
import { HiOutlineChevronDown, HiOutlineChevronRight } from 'react-icons/hi'
import { getLogs, setTableData, useAppDispatch, useAppSelector } from '../store'
// import LogDeleteConfirmation from './LogDeleteConfirmation'
import cloneDeep from 'lodash/cloneDeep'

import { Button } from '@/components/ui'
import { DataTableResetHandle } from '@/components/shared'
import LogTableDropdown from './LogTableDropdown'
import dayjs from 'dayjs'

type Log = {
    id: string
    pekerjaan: string
    nilai_kontrak: string
    tanggal_pengajuan: string
    client: string
    idUser?: string
    status: string
}

const LogTable = () => {
    const tableRef = useRef<DataTableResetHandle>(null)

    const dispatch = useAppDispatch()

    const { pageIndex, pageSize, query, total } = useAppSelector(
        (state) => state.logList.data.tableData
    )

    const filterData = useAppSelector((state) => state.logList.data.filterData)

    const loading = useAppSelector((state) => state.logList.data.loading)

    const data = useAppSelector((state) => state.logList.data.logsList)

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex, pageSize, filterData])

    useEffect(() => {
        if (tableRef) {
            tableRef.current?.resetSorting()
        }
    }, [filterData, pageIndex, pageSize])

    const tableData = useMemo(
        () => ({ pageIndex, pageSize, query, total }),
        [pageIndex, pageSize, query, total]
    )
    const fetchData = () => {
        dispatch(
            getLogs({
                page: pageIndex,
                limit: pageSize,
                query,
                filterData: filterData,
            })
        )
    }

    const columns: ColumnDef<Log>[] = useMemo(
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
                header: 'Tipe Log',
                accessorKey: 'type',
                cell: (props) => {
                    const row = props.row.original
                    return <span className="capitalize">{row.type}</span>
                },
            },

            {
                header: 'Status',
                accessorKey: 'status',

                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="capitalize">
                            <Button
                                variant="solid"
                                shape="circle"
                                size="xs"
                                color={
                                    row.status === 'Success' ? 'green' : 'red'
                                }
                                className="cursor-auto"
                            >
                                {row.status}
                            </Button>
                        </span>
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
                            {dayjs(row.tanggal).format('HH:mm, DD-MM-YYYY')}
                        </span>
                    )
                },
            },
            {
                header: 'User',
                accessorKey: 'user',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="capitalize">
                            {row?.User?.nama || '-'}
                        </span>
                    )
                },
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
            <LogTableDropdown
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
        </>
    )
}

export default LogTable
