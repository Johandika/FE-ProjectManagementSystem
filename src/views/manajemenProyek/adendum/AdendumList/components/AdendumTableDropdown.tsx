// import { getAdendums, useAppSelector } from '../store'
// import { useMemo, Fragment, useEffect } from 'react'
// import Table from '@/components/ui/Table'
// import {
//     useReactTable,
//     getCoreRowModel,
//     getExpandedRowModel,
//     flexRender,
// } from '@tanstack/react-table'
// import { HiOutlineChevronRight, HiOutlineChevronDown } from 'react-icons/hi'
// import type { ColumnDef, Row } from '@tanstack/react-table'
// import type { ReactElement } from 'react'
// import { useAppDispatch } from '@/store'
// import { DataTable, Loading } from '@/components/shared'
// import { Button } from '@/components/ui'
// import { formatDate } from '@/utils/formatDate'
// import { formatRupiah } from '@/utils/formatStringRupiah'

// export type PersonWithSubRow = {
//     firstName: string
// }

// type AdendumTableProps<T> = {
//     renderRowSubComponent: (props: { row: Row<T> }) => ReactElement
//     getRowCanExpand: (row: Row<T>) => boolean
//     data: any
// }

// const { Tr, Th, Td, THead, TBody } = Table

// const ActionColumn = ({ row }: { row: Product }) => {
//     const dispatch = useAppDispatch()

//     const handleApproveClick = () => {
//         console.log('id row', row.id)
//     }

//     const handleRejectClick = () => {
//         console.log('id row', row.id)
//     }

//     return (
//         <div className="flex justify-end text-lg gap-2">
//             <Button size="sm" variant="solid" onClick={handleApproveClick}>
//                 Terima
//             </Button>
//             <Button size="sm" onClick={handleRejectClick}>
//                 Tolak
//             </Button>
//         </div>
//     )
// }

// const renderSubComponent = ({ row }: { row: Row<PersonWithSubRow> }) => {
//     return (
//         <pre style={{ fontSize: '10px' }}>
//             <code>{JSON.stringify(row.original, null, 2)}</code>
//         </pre>
//     )
// }

// function AdendumTable({
//     getRowCanExpand,
//     data,
// }: AdendumTableProps<PersonWithSubRow>) {
//     const columns = useMemo<ColumnDef<PersonWithSubRow>[]>(
//         () => [
//             {
//                 // Make an expander cell
//                 header: () => null, // No header
//                 id: 'expander', // It needs an ID
//                 cell: ({ row }) => (
//                     <>
//                         {row.getCanExpand() ? (
//                             <button
//                                 className="text-lg"
//                                 {...{ onClick: row.getToggleExpandedHandler() }}
//                             >
//                                 {row.getIsExpanded() ? (
//                                     <HiOutlineChevronDown />
//                                 ) : (
//                                     <HiOutlineChevronRight />
//                                 )}
//                             </button>
//                         ) : null}
//                     </>
//                 ),
//                 // We can override the cell renderer with a SubCell to be used with an expanded row
//                 subCell: () => null, // No expander on an expanded row
//             },
//             {
//                 header: 'Dasar Adendum',
//                 accessorKey: 'dasar_adendum',
//             },
//             {
//                 header: '',
//                 id: 'action',
//                 cell: (props) => <ActionColumn row={props.row.original} />,
//             },
//         ],
//         []
//     )

//     const table = useReactTable({
//         data: data,
//         columns,
//         getRowCanExpand,
//         getCoreRowModel: getCoreRowModel(),
//         getExpandedRowModel: getExpandedRowModel(),
//     })

//     return (
//         <>
//             <Table>
//                 <THead>
//                     {table.getHeaderGroups().map((headerGroup) => (
//                         <Tr key={headerGroup.id}>
//                             {headerGroup.headers.map((header) => {
//                                 return (
//                                     <Th
//                                         key={header.id}
//                                         colSpan={header.colSpan}
//                                     >
//                                         {flexRender(
//                                             header.column.columnDef.header,
//                                             header.getContext()
//                                         )}
//                                     </Th>
//                                 )
//                             })}
//                         </Tr>
//                     ))}
//                 </THead>
//                 <TBody>
//                     {table.getRowModel().rows.map((row) => {
//                         return (
//                             <Fragment key={row.id}>
//                                 <Tr>
//                                     {/* first row is a normal row */}
//                                     {row.getVisibleCells().map((cell) => {
//                                         return (
//                                             <td key={cell.id}>
//                                                 {flexRender(
//                                                     cell.column.columnDef.cell,
//                                                     cell.getContext()
//                                                 )}
//                                             </td>
//                                         )
//                                     })}
//                                 </Tr>
//                                 {row.getIsExpanded() && (
//                                     <Tr>
//                                         {/* 2nd row is a custom 1 cell row */}
//                                         <Td
//                                             colSpan={
//                                                 row.getVisibleCells().length
//                                             }
//                                             className="w-full"
//                                         >
//                                             {/* Timeline */}
//                                             {row.original?.dasar_adendum ===
//                                                 'Timeline' &&
//                                                 row.original?.DetailAdendums.map(
//                                                     (
//                                                         detail: any,
//                                                         index: number
//                                                     ) => (
//                                                         <div
//                                                             key={index}
//                                                             className="grid grid-cols-2 gap-2"
//                                                         >
//                                                             <div>
//                                                                 {detail.nama_column ===
//                                                                 'timeline_awal'
//                                                                     ? 'T.awal'
//                                                                     : 'T.akhir'}{' '}
//                                                                 sebelum :{' '}
//                                                                 {formatDate(
//                                                                     detail.value_sebelum
//                                                                 )}
//                                                             </div>
//                                                             <div>
//                                                                 {detail.nama_column ===
//                                                                 'timeline_awal'
//                                                                     ? 'T.awal'
//                                                                     : 'T.akhir'}{' '}
//                                                                 sesudah :{' '}
//                                                                 {formatDate(
//                                                                     detail.value_adendum
//                                                                 )}
//                                                             </div>
//                                                         </div>
//                                                     )
//                                                 )}

//                                             {/* Nilai Kontrak */}
//                                             {row.original?.dasar_adendum ===
//                                                 'Nilai Kontrak' &&
//                                                 row.original?.DetailAdendums.map(
//                                                     (
//                                                         detail: any,
//                                                         index: number
//                                                     ) => (
//                                                         <div
//                                                             key={index}
//                                                             className="grid grid-cols-2 gap-2"
//                                                         >
//                                                             <div>
//                                                                 Nilai kontrak
//                                                                 sebelum :{' '}
//                                                                 {formatRupiah(
//                                                                     detail.value_sebelum
//                                                                 )}
//                                                             </div>
//                                                             <div>
//                                                                 Nilai kontrak
//                                                                 sesudah :{' '}
//                                                                 {formatRupiah(
//                                                                     detail.value_adendum
//                                                                 )}
//                                                             </div>
//                                                         </div>
//                                                     )
//                                                 )}

//                                             {/* Lokasi */}
//                                             {row.original?.dasar_adendum ===
//                                                 'Lokasi' &&
//                                                 row.original?.DetailAdendums.map(
//                                                     (
//                                                         detail: any,
//                                                         index: number
//                                                     ) => (
//                                                         <div
//                                                             key={index}
//                                                             className="grid grid-cols-2 gap-2"
//                                                         >
//                                                             <div>
//                                                                 {detail.nama_column ===
//                                                                 'lokasi'
//                                                                     ? 'Lokasi'
//                                                                     : detail.nama_column ===
//                                                                       'longitude'
//                                                                     ? 'Longitude'
//                                                                     : 'Latitude'}{' '}
//                                                                 sebelum :{' '}
//                                                                 {
//                                                                     detail.value_sebelum
//                                                                 }
//                                                             </div>
//                                                             <div>
//                                                                 {detail.nama_column ===
//                                                                 'lokasi'
//                                                                     ? 'Lokasi'
//                                                                     : detail.nama_column ===
//                                                                       'longitude'
//                                                                     ? 'Longitude'
//                                                                     : 'Latitude'}{' '}
//                                                                 sesudah :{' '}
//                                                                 {
//                                                                     detail.value_adendum
//                                                                 }
//                                                             </div>
//                                                         </div>
//                                                     )
//                                                 )}
//                                         </Td>
//                                     </Tr>
//                                 )}
//                             </Fragment>
//                         )
//                     })}
//                 </TBody>
//             </Table>
//         </>
//     )
// }

// const SubComponent = () => {
//     const dispatch = useAppDispatch()

//     const { pageIndex, pageSize, query, total } = useAppSelector(
//         (state) => state.adendumList.data.tableData
//     )

//     const filterData = useAppSelector(
//         (state) => state.adendumList.data.filterData
//     )

//     const loading = useAppSelector((state) => state.adendumList.data.loading)

//     const data = useAppSelector((state) => state.adendumList.data.adendumsList)

//     const fetchData = () => {
//         dispatch(getAdendums({ pageIndex, pageSize, query, filterData }))
//     }

//     useEffect(() => {
//         fetchData()
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [pageIndex, pageSize])

//     // console.log('data', data)
//     console.log(
//         'ini dia',
//         useAppSelector((state) => state.adendumList.data)
//     )

//     return (
//         <Loading loading={loading}>
//             <AdendumTable
//                 data={data}
//                 renderRowSubComponent={renderSubComponent}
//                 getRowCanExpand={() => true}
//                 // onPaginationChange={onPaginationChange}
//                 // onSelectChange={onSelectChange}
//                 // onSort={onSort}
//             />
//         </Loading>
//     )
// }

// export default SubComponent
