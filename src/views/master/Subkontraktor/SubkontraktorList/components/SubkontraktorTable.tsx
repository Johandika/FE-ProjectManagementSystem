import { useEffect, useMemo, useRef } from 'react'
import DataTable from '@/components/shared/DataTable'
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import {
    getSubkontraktors,
    setTableData,
    setSelectedSubkontraktor,
    toggleDeleteConfirmation,
    useAppDispatch,
    useAppSelector,
} from '../store'
import useThemeClass from '@/utils/hooks/useThemeClass'
import SubkontraktorDeleteConfirmation from './SubkontraktorDeleteConfirmation'
import { useNavigate } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep'
import type {
    DataTableResetHandle,
    OnSortParam,
    ColumnDef,
} from '@/components/shared/DataTable'

type Subkontraktor = {
    id: string
    nama: string
}

const ActionColumn = ({ row }: { row: Subkontraktor }) => {
    const dispatch = useAppDispatch()
    const { textTheme } = useThemeClass()
    const navigate = useNavigate()

    const onEdit = () => {
        navigate(`/master/subkontraktor-edit/${row.id}`)
    }

    const onDelete = () => {
        dispatch(toggleDeleteConfirmation(true))
        dispatch(setSelectedSubkontraktor(row.id))
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

const SubkontraktorTable = () => {
    const tableRef = useRef<DataTableResetHandle>(null)

    const dispatch = useAppDispatch()

    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.subkontraktorList.data.tableData
    )

    const filterData = useAppSelector(
        (state) => state.subkontraktorList.data.filterData
    )

    const loading = useAppSelector(
        (state) => state.subkontraktorList.data.loading
    )

    const data = useAppSelector(
        (state) => state.subkontraktorList.data.subkontraktorList
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
            getSubkontraktors({ pageIndex, pageSize, sort, query, filterData })
        )
    }

    const columns: ColumnDef<Subkontraktor>[] = useMemo(
        () => [
            {
                header: 'Nama',
                accessorKey: 'nama',
                cell: (props) => {
                    const row = props.row.original
                    return <span className="capitalize">{row.nama}</span>
                },
            },

            // {
            //     header: 'Keterangan',
            //     accessorKey: 'keterangan',
            //     cell: (props) => {
            //         const row = props.row.original
            //         return <span className="capitalize">{row.keterangan}</span>
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
            <SubkontraktorDeleteConfirmation />
        </>
    )
}

export default SubkontraktorTable
