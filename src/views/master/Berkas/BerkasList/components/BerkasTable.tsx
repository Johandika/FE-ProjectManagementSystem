import { useEffect, useMemo, useRef } from 'react'
import DataTable from '@/components/shared/DataTable'
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import {
    getBerkases,
    setTableData,
    setSelectedBerkas,
    toggleDeleteConfirmation,
    useAppDispatch,
    useAppSelector,
    toggleRestoreConfirmation,
} from '../store'
import useThemeClass from '@/utils/hooks/useThemeClass'
import BerkasDeleteConfirmation from './BerkasDeleteConfirmation'
import { useNavigate } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep'
import type {
    DataTableResetHandle,
    OnSortParam,
    ColumnDef,
} from '@/components/shared/DataTable'
import { FaTrashRestoreAlt } from 'react-icons/fa'
import BerkasRestoreConfirmation from './BerkasRestoreConfirmation copy'

type Berkas = {
    id: string
    nama: string
}

const ActionColumn = ({ row }: { row: Berkas }) => {
    const dispatch = useAppDispatch()
    const { textTheme } = useThemeClass()
    const navigate = useNavigate()

    const onEdit = () => {
        navigate(`/master/berkas-edit/${row.id}`)
    }

    const onDelete = () => {
        dispatch(toggleDeleteConfirmation(true))
        dispatch(setSelectedBerkas(row.id))
    }

    const onRestore = () => {
        dispatch(toggleRestoreConfirmation(true))
        dispatch(setSelectedBerkas(row.id))
    }

    return (
        <div className="flex justify-end text-lg">
            {row.deletedAt === null ? (
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
            ) : (
                <span
                    className={`cursor-pointer p-2 hover:${textTheme}`}
                    onClick={onRestore}
                >
                    <FaTrashRestoreAlt />
                </span>
            )}
        </div>
    )
}

const BerkasTable = () => {
    const tableRef = useRef<DataTableResetHandle>(null)

    const dispatch = useAppDispatch()

    const user = useAppSelector((state) => state.auth.user)

    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.berkasList.data.tableData
    )

    const filterData = useAppSelector(
        (state) => state.berkasList.data.filterData
    )

    const loading = useAppSelector((state) => state.berkasList.data.loading)

    const data = useAppSelector((state) => state.berkasList.data.berkasList)

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
        dispatch(getBerkases({ pageIndex, pageSize, sort, query, filterData }))
    }

    const columns: ColumnDef<Berkas>[] = useMemo(() => {
        const baseColumns: ColumnDef<Berkas>[] = [
            {
                header: 'Nama',
                accessorKey: 'nama',
                cell: (props) => {
                    const row = props.row.original
                    return <span className="capitalize">{row.nama}</span>
                },
            },
        ]

        if (user?.authority !== 'Admin' && user?.authority !== 'Owner') {
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
                }}
                onPaginationChange={onPaginationChange}
                onSelectChange={onSelectChange}
                onSort={onSort}
            />
            <BerkasDeleteConfirmation />
            <BerkasRestoreConfirmation />
        </>
    )
}

export default BerkasTable
