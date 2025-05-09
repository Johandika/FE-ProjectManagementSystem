import { useEffect, useMemo, useRef } from 'react'
import DataTable from '@/components/shared/DataTable'
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import {
    getPurchaseOrders,
    setTableData,
    setSelectedPurchaseOrder,
    toggleDeleteConfirmation,
    useAppDispatch,
    useAppSelector,
} from '../store'
import useThemeClass from '@/utils/hooks/useThemeClass'
import PurchaseOrderDeleteConfirmation from './PurchaseOrderDeleteConfirmation'
import { useNavigate } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep'
import type {
    DataTableResetHandle,
    OnSortParam,
    ColumnDef,
} from '@/components/shared/DataTable'
import { formatDate } from '@/utils/formatDate'

type PurchaseOrder = {
    id: string
    nomor_po: string
    nama: string
    tanggal_po: string
    pabrik: string
    harga: number
    status: string
    estimasi_pengerjaan: string
    idProject: string
}

const ActionColumn = ({ row }: { row: PurchaseOrder }) => {
    const dispatch = useAppDispatch()
    const { textTheme } = useThemeClass()
    const navigate = useNavigate()

    const onEdit = () => {
        navigate(`/purchase-order-edit/${row.id}`)
    }

    const onDelete = () => {
        dispatch(toggleDeleteConfirmation(true))
        dispatch(setSelectedPurchaseOrder(row.id))
    }

    return (
        <div className="flex justify-end text-lg">
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
        </div>
    )
}

const PurchaseOrderTable = () => {
    const tableRef = useRef<DataTableResetHandle>(null)

    const dispatch = useAppDispatch()

    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.purchaseOrderList.data.tableData
    )

    const filterData = useAppSelector(
        (state) => state.purchaseOrderList.data.filterData
    )

    const loading = useAppSelector(
        (state) => state.purchaseOrderList.data.loading
    )

    const data = useAppSelector(
        (state) => state.purchaseOrderList.data.purchaseOrderList
    )

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex, pageSize, sort])

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
            getPurchaseOrders({ pageIndex, pageSize, sort, query, filterData })
        )
    }

    const columns: ColumnDef<PurchaseOrder>[] = useMemo(
        () => [
            {
                header: 'Nomor',
                accessorKey: 'nomor_po', // Changed from 'nomor'
                cell: (props) => {
                    const row = props.row.original
                    return <span className="capitalize">{row.nomor_po}</span>
                },
            },
            {
                header: 'Nama',
                accessorKey: 'nama', // Changed from 'keterangan'
                cell: (props) => {
                    const row = props.row.original
                    return <span className="capitalize">{row.nama}</span>
                },
            },
            {
                header: 'Nominal',
                accessorKey: 'harga', // Changed from 'nominal'
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="capitalize">
                            {row.harga.toLocaleString('id-ID')}
                        </span>
                    )
                },
            },
            {
                header: 'Estimasi Pengerjaan',
                accessorKey: 'estimasi_pengerjaan', // Changed from 'keterangan'
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="capitalize">
                            {row.estimasi_pengerjaan}
                        </span>
                    )
                },
            },
            {
                header: 'Tanggal',
                accessorKey: 'tanggal_po', // Changed from 'tanggal'
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="capitalize">
                            {formatDate(row.tanggal_po)}
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
            />
            <PurchaseOrderDeleteConfirmation />
        </>
    )
}

export default PurchaseOrderTable
