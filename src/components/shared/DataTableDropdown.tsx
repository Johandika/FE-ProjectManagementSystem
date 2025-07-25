import {
    forwardRef,
    useMemo,
    useRef,
    useEffect,
    useState,
    useImperativeHandle,
    Fragment,
} from 'react'
import classNames from 'classnames'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import Checkbox from '@/components/ui/Checkbox'
import TableRowSkeleton from './loaders/TableRowSkeleton'
import Loading from './Loading'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
    ColumnDef,
    ColumnSort,
    Row,
    CellContext,
    getExpandedRowModel,
} from '@tanstack/react-table'
import type { SkeletonProps } from '@/components/ui/Skeleton'
import type { ForwardedRef, ChangeEvent } from 'react'
import type { CheckboxProps } from '@/components/ui/Checkbox'
import { formatRupiah } from '@/utils/formatStringRupiah'
import { formatDate } from '@/utils/formatDate'

export type OnSortParam = { order: 'asc' | 'desc' | ''; key: string | number }

type DataTableProps<T> = {
    columns: ColumnDef<T>[]
    data?: unknown[]
    loading?: boolean
    onCheckBoxChange?: (checked: boolean, row: T) => void
    onIndeterminateCheckBoxChange?: (checked: boolean, rows: Row<T>[]) => void
    onPaginationChange?: (page: number) => void
    onSelectChange?: (num: number) => void
    onSort?: (sort: OnSortParam) => void
    onRowClick?: (row: T) => void // Add this new prop
    pageSizes?: number[]
    selectable?: boolean
    skeletonAvatarColumns?: number[]
    getRowCanExpand: (row: Row<T>) => boolean
    skeletonAvatarProps?: SkeletonProps
    pagingData?: {
        total: number
        pageIndex: number
        pageSize: number
    }
}

type CheckBoxChangeEvent = ChangeEvent<HTMLInputElement>

interface IndeterminateCheckboxProps extends Omit<CheckboxProps, 'onChange'> {
    onChange: (event: CheckBoxChangeEvent) => void
    indeterminate: boolean
    onCheckBoxChange?: (event: CheckBoxChangeEvent) => void
    onIndeterminateCheckBoxChange?: (event: CheckBoxChangeEvent) => void
}

const { Tr, Th, Td, THead, TBody, Sorter } = Table

const IndeterminateCheckbox = (props: IndeterminateCheckboxProps) => {
    const {
        indeterminate,
        onChange,
        onCheckBoxChange,
        onIndeterminateCheckBoxChange,
        ...rest
    } = props

    const ref = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (typeof indeterminate === 'boolean' && ref.current) {
            ref.current.indeterminate = !rest.checked && indeterminate
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref, indeterminate])

    const handleChange = (e: CheckBoxChangeEvent) => {
        onChange(e)
        onCheckBoxChange?.(e)
        onIndeterminateCheckBoxChange?.(e)
    }

    return (
        <Checkbox
            ref={ref}
            className="mb-0"
            onChange={(_, e) => handleChange(e)}
            {...rest}
        />
    )
}

export type DataTableResetHandle = {
    resetSorting: () => void
    resetSelected: () => void
}

function _DataTable<T>(
    props: DataTableProps<T>,
    ref: ForwardedRef<DataTableResetHandle>
) {
    const {
        skeletonAvatarColumns,
        columns: columnsProp = [],
        data = [],
        loading = false,
        onCheckBoxChange,
        onIndeterminateCheckBoxChange,
        onPaginationChange,
        onSelectChange,
        onSort,
        onRowClick, // Extract the onRowClick prop
        pageSizes = [10, 25, 50, 100],
        selectable = false,
        skeletonAvatarProps,
        getRowCanExpand,
        pagingData = {
            total: 0,
            pageIndex: 1,
            pageSize: 10,
        },
    } = props

    const { pageSize, pageIndex, total } = pagingData

    const [sorting, setSorting] = useState<ColumnSort[] | null>(null)

    const pageSizeOption = useMemo(
        () =>
            pageSizes.map((number) => ({
                value: number,
                label: `${number} / page`,
            })),
        [pageSizes]
    )

    const handleCheckBoxChange = (checked: boolean, row: T) => {
        if (!loading) {
            onCheckBoxChange?.(checked, row)
        }
    }

    const handleIndeterminateCheckBoxChange = (
        checked: boolean,
        rows: Row<T>[]
    ) => {
        if (!loading) {
            onIndeterminateCheckBoxChange?.(checked, rows)
        }
    }

    const handlePaginationChange = (page: number) => {
        if (!loading) {
            onPaginationChange?.(page)
        }
    }

    const handleSelectChange = (value?: number) => {
        if (!loading) {
            onSelectChange?.(Number(value))
        }
    }

    useEffect(() => {
        if (Array.isArray(sorting)) {
            const sortOrder =
                sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : ''
            const id = sorting.length > 0 ? sorting[0].id : ''
            onSort?.({ order: sortOrder, key: id })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sorting])

    const finalColumns: ColumnDef<T>[] = useMemo(() => {
        const columns = columnsProp

        if (selectable) {
            return [
                {
                    id: 'select',
                    header: ({ table }) => (
                        <IndeterminateCheckbox
                            checked={table.getIsAllRowsSelected()}
                            indeterminate={table.getIsSomeRowsSelected()}
                            onChange={table.getToggleAllRowsSelectedHandler()}
                            onIndeterminateCheckBoxChange={(e) => {
                                handleIndeterminateCheckBoxChange(
                                    e.target.checked,
                                    table.getRowModel().rows
                                )
                            }}
                        />
                    ),
                    cell: ({ row }) => (
                        <IndeterminateCheckbox
                            checked={row.getIsSelected()}
                            disabled={!row.getCanSelect()}
                            indeterminate={row.getIsSomeSelected()}
                            onChange={row.getToggleSelectedHandler()}
                            onCheckBoxChange={(e) =>
                                handleCheckBoxChange(
                                    e.target.checked,
                                    row.original
                                )
                            }
                        />
                    ),
                },
                ...columns,
            ]
        }
        return columns
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columnsProp, selectable])

    const table = useReactTable({
        data,
        getRowCanExpand,
        getExpandedRowModel: getExpandedRowModel(),
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        columns: finalColumns as ColumnDef<unknown | object | any[], any>[],
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        manualSorting: true,
        onSortingChange: (sorter) => {
            setSorting(sorter as ColumnSort[])
        },
        state: {
            sorting: sorting as ColumnSort[],
        },
    })

    const resetSorting = () => {
        table.resetSorting()
    }

    const resetSelected = () => {
        table.toggleAllRowsSelected(false)
    }

    useImperativeHandle(ref, () => ({
        resetSorting,
        resetSelected,
    }))

    return (
        <Loading loading={loading && data.length !== 0} type="cover">
            <Table>
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <Th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                        // tambahan style lebar kolom
                                        style={{
                                            width: header.column.columnDef
                                                .width,
                                            minWidth:
                                                header.column.columnDef
                                                    .minWidth,
                                        }}
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div
                                                className={classNames(
                                                    header.column.getCanSort() &&
                                                        'cursor-pointer select-none point',
                                                    loading &&
                                                        'pointer-events-none'
                                                )}
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext()
                                                )}
                                                {header.column.getCanSort() && (
                                                    <Sorter
                                                        sort={header.column.getIsSorted()}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </Th>
                                )
                            })}
                        </Tr>
                    ))}
                </THead>
                {loading && data.length === 0 ? (
                    <TableRowSkeleton
                        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
                        columns={(finalColumns as Array<T>).length}
                        rows={pagingData.pageSize}
                        avatarInColumns={skeletonAvatarColumns}
                        avatarProps={skeletonAvatarProps}
                    />
                ) : (
                    <TBody>
                        {table
                            .getRowModel()
                            .rows.slice(0, pageSize)
                            .map((row) => {
                                return (
                                    <Fragment key={row.id}>
                                        <Tr
                                            key={row.id}
                                            className={
                                                onRowClick
                                                    ? 'cursor-pointer hover:bg-gray-50'
                                                    : ''
                                            }
                                            onClick={() =>
                                                onRowClick &&
                                                onRowClick(row.original as T)
                                            }
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => {
                                                    return (
                                                        <Td
                                                            key={cell.id}
                                                            style={{
                                                                width: cell
                                                                    .column
                                                                    .columnDef
                                                                    .width,
                                                                minWidth:
                                                                    cell.column
                                                                        .columnDef
                                                                        .minWidth,
                                                            }}
                                                        >
                                                            {flexRender(
                                                                cell.column
                                                                    .columnDef
                                                                    .cell,
                                                                cell.getContext()
                                                            )}
                                                        </Td>
                                                    )
                                                })}
                                        </Tr>
                                        {/* Submenu Dropdown */}
                                        {row.getIsExpanded() && (
                                            <Tr>
                                                {/* 2nd row is a custom 1 cell row */}
                                                <Td
                                                    colSpan={
                                                        row.getVisibleCells()
                                                            .length
                                                    }
                                                    className="w-full"
                                                >
                                                    {/* Timeline */}
                                                    {row.original
                                                        ?.dasar_adendum ===
                                                        'Timeline' &&
                                                        row.original?.DetailAdendums.map(
                                                            (
                                                                detail: any,
                                                                index: number
                                                            ) => (
                                                                <div
                                                                    key={index}
                                                                    className="grid grid-cols-2 gap-2"
                                                                >
                                                                    <div>
                                                                        {detail.nama_column ===
                                                                        'timeline_awal'
                                                                            ? 'T.awal'
                                                                            : 'T.akhir'}{' '}
                                                                        sebelum
                                                                        :{' '}
                                                                        {formatDate(
                                                                            detail.value_sebelum
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        {detail.nama_column ===
                                                                        'timeline_awal'
                                                                            ? 'T.awal'
                                                                            : 'T.akhir'}{' '}
                                                                        sesudah
                                                                        :{' '}
                                                                        {formatDate(
                                                                            detail.value_adendum
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}

                                                    {/* Nilai Kontrak */}
                                                    {row.original
                                                        ?.dasar_adendum ===
                                                        'Nilai Kontrak' &&
                                                        row.original?.DetailAdendums.map(
                                                            (
                                                                detail: any,
                                                                index: number
                                                            ) => (
                                                                <div
                                                                    key={index}
                                                                    className="grid grid-cols-2 gap-2"
                                                                >
                                                                    <div>
                                                                        Nilai
                                                                        kontrak
                                                                        sebelum
                                                                        : Rp{' '}
                                                                        {formatRupiah(
                                                                            detail.value_sebelum
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        Nilai
                                                                        kontrak
                                                                        sesudah
                                                                        : Rp{' '}
                                                                        {formatRupiah(
                                                                            detail.value_adendum
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}

                                                    {/* Lokasi */}
                                                    {row.original
                                                        ?.dasar_adendum ===
                                                        'Lokasi' &&
                                                        row.original?.DetailAdendums.map(
                                                            (
                                                                detail: any,
                                                                index: number
                                                            ) => (
                                                                <div
                                                                    key={index}
                                                                    className="grid grid-cols-2 gap-2"
                                                                >
                                                                    <div>
                                                                        {detail.nama_column ===
                                                                        'lokasi'
                                                                            ? 'Lokasi'
                                                                            : detail.nama_column ===
                                                                              'longitude'
                                                                            ? 'Longitude'
                                                                            : 'Latitude'}{' '}
                                                                        sebelum
                                                                        :{' '}
                                                                        {
                                                                            detail.value_sebelum
                                                                        }
                                                                    </div>
                                                                    <div>
                                                                        {detail.nama_column ===
                                                                        'lokasi'
                                                                            ? 'Lokasi'
                                                                            : detail.nama_column ===
                                                                              'longitude'
                                                                            ? 'Longitude'
                                                                            : 'Latitude'}{' '}
                                                                        sesudah
                                                                        :{' '}
                                                                        {
                                                                            detail.value_adendum
                                                                        }
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                </Td>
                                            </Tr>
                                        )}
                                    </Fragment>
                                )
                            })}
                    </TBody>
                )}
            </Table>
            <div className="flex items-center justify-between mt-4">
                <Pagination
                    pageSize={pageSize}
                    currentPage={pageIndex}
                    total={total}
                    onChange={handlePaginationChange}
                />
                <div style={{ minWidth: 130 }}>
                    <Select
                        size="sm"
                        menuPlacement="top"
                        isSearchable={false}
                        value={pageSizeOption.filter(
                            (option) => option.value === pageSize
                        )}
                        options={pageSizeOption}
                        onChange={(option) => handleSelectChange(option?.value)}
                    />
                </div>
            </div>
        </Loading>
    )
}

const DataTableDropdown = forwardRef(_DataTable) as <T>(
    props: DataTableProps<T> & {
        ref?: ForwardedRef<DataTableResetHandle>
    }
) => ReturnType<typeof _DataTable>

export type { ColumnDef, Row, CellContext }
export default DataTableDropdown
