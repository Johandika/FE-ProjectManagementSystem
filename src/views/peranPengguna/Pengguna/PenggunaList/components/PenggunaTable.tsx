import { useEffect, useMemo, useRef, useState } from 'react'
import DataTable from '@/components/shared/DataTable'
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import { MdLockReset, MdOutlinePassword } from 'react-icons/md'
import {
    getPenggunas,
    setTableData,
    setSelectedPengguna,
    toggleDeleteConfirmation,
    useAppDispatch,
    useAppSelector,
    setDialogUpdatePassword,
    setIdUserActive,
    setDialogResetPassword,
    toggleRestoreConfirmation,
} from '../store'
import useThemeClass from '@/utils/hooks/useThemeClass'
import PenggunaDeleteConfirmation from './PenggunaDeleteConfirmation'
import { useNavigate } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep'
import type {
    DataTableResetHandle,
    OnSortParam,
    ColumnDef,
} from '@/components/shared/DataTable'
import DialogUpdatePassword from './DialogUpdatePassword'
import DialogConfirmResetPassword from './DialogConfirmResetPassword'
import PenggunaRestoreConfirmation from './PenggunaRestoreConfirmation copy'
import { FaTrashRestoreAlt } from 'react-icons/fa'

type Pengguna = {
    id: string
    pengguna: string
}

const ActionColumn = ({ row }: { row: Pengguna }) => {
    const dispatch = useAppDispatch()
    const { textTheme } = useThemeClass()
    const navigate = useNavigate()

    const onEdit = () => {
        navigate(`/peran-dan-pengguna/pengguna-edit/${row.id}`)
    }

    const onUpdatePassword = (row: { id: string }) => {
        dispatch(setDialogUpdatePassword(true))
        dispatch(setIdUserActive(row.id))
    }

    const onResetPassword = (row: { id: string }) => {
        dispatch(setDialogResetPassword(true))
        dispatch(setIdUserActive(row.id))
    }

    const onRestore = () => {
        dispatch(toggleRestoreConfirmation(true))
        dispatch(setSelectedPengguna(row.id))
    }

    const onDelete = () => {
        dispatch(toggleDeleteConfirmation(true))
        dispatch(setSelectedPengguna(row.id))
    }

    const user = useAppSelector((state) => state.auth.user)

    return (
        <div className="flex justify-end text-lg">
            {row.email === user.email && (
                <span
                    className={`cursor-pointer p-2 hover:${textTheme}`}
                    onClick={(e) => {
                        e.stopPropagation()
                        onUpdatePassword(row)
                    }}
                >
                    <MdOutlinePassword />
                </span>
            )}
            {row.deletedAt === null && (
                <span
                    className={`cursor-pointer p-2 hover:${textTheme}`}
                    onClick={onEdit}
                >
                    <HiOutlinePencil />
                </span>
            )}
            {user.authority === 'Super Admin' && row.deletedAt === null && (
                <>
                    <span
                        className={`cursor-pointer p-2 hover:${textTheme}`}
                        onClick={(e) => {
                            e.stopPropagation()
                            onResetPassword(row)
                        }}
                    >
                        <MdLockReset />
                    </span>

                    <span
                        className="cursor-pointer p-2 hover:text-red-500"
                        onClick={onDelete}
                    >
                        <HiOutlineTrash />
                    </span>
                </>
            )}
        </div>
    )
}

const PenggunaTable = () => {
    const tableRef = useRef<DataTableResetHandle>(null)

    const dispatch = useAppDispatch()

    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.penggunaList.data.tableData
    )

    const filterData = useAppSelector(
        (state) => state.penggunaList.data.filterData
    )

    const user = useAppSelector((state) => state.auth.user)

    const { loading } = useAppSelector((state) => state.penggunaList.data)

    const { penggunaList } = useAppSelector((state) => state.penggunaList.data)

    const filteredPenggunaList = useMemo(() => {
        if (user.authority === 'Super Admin') {
            return penggunaList
        }
        return penggunaList.filter((pengguna) => pengguna.email === user.email)
    }, [user, penggunaList])

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
        dispatch(getPenggunas({ pageIndex, pageSize, sort, query, filterData }))
    }

    const columns: ColumnDef<Pengguna>[] = useMemo(
        () => [
            {
                header: 'Nama',
                accessorKey: 'pengguna',
                cell: (props) => {
                    const row = props.row.original
                    return <span className="capitalize">{row.nama}</span>
                },
            },
            {
                header: 'Email',
                accessorKey: 'email',
                cell: (props) => {
                    const row = props.row.original
                    return <span>{row.email}</span>
                },
            },
            {
                header: 'Peran',
                accessorKey: 'peran',
                cell: (props) => {
                    const row = props.row.original
                    return <span>{row.Role.nama}</span>
                },
            },
            {
                header: 'Divisi',
                accessorKey: 'divisi',
                cell: (props) => {
                    const row = props.row.original
                    return <span>{row.Divisi?.name}</span>
                },
            },
            {
                header: 'Kontak',
                accessorKey: 'kontak',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="capitalize">{row.nomor_telepon}</span>
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
                data={filteredPenggunaList}
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
            <PenggunaDeleteConfirmation />
            <DialogUpdatePassword />
            <DialogConfirmResetPassword />
            <PenggunaRestoreConfirmation />
        </>
    )
}

export default PenggunaTable
