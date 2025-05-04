import { useEffect, useMemo, useRef } from 'react'
import DataTable from '@/components/shared/DataTable'
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import { TbReportSearch } from 'react-icons/tb'
import {
    getProyeks,
    setTableData,
    setSelectedProyek,
    toggleDeleteConfirmation,
    useAppDispatch,
    useAppSelector,
    getKliens,
} from '../store'
import useThemeClass from '@/utils/hooks/useThemeClass'
import ProyekDeleteConfirmation from './ProyekDeleteConfirmation'
import { useNavigate } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep'
import type {
    DataTableResetHandle,
    OnSortParam,
    ColumnDef,
} from '@/components/shared/DataTable'
import { IoLocationSharp } from 'react-icons/io5'
import { AiFillCreditCard } from 'react-icons/ai'
import { formatDate } from '@/utils/formatDate'

type Proyek = {
    id: string
    pekerjaan: string
    pic: string
    client: string
    nomor_kontrak: number
    tanggal_service_po: string
    tanggal_delivery: string
    tanggal_kontrak: string
    nilai_kontrak: number
    uang_muka: number
    progress: number
    status: string
    idKlien: string
    Lokasis?: Array<{
        lokasi: string
        latitude: number
        longitude: number
    }>
}

const ActionColumn = ({ row }: { row: Proyek }) => {
    const dispatch = useAppDispatch()
    const { textTheme } = useThemeClass()
    const navigate = useNavigate()

    const onDetail = (e) => {
        e.stopPropagation()
        navigate(`/manajemen-proyek-detail/${row.id}`)
    }

    const onEdit = (e) => {
        e.stopPropagation()
        navigate(`/manajemen-proyek-edit/${row.id}`)
    }

    const onDelete = (e) => {
        e.stopPropagation()
        dispatch(toggleDeleteConfirmation(true))
        dispatch(setSelectedProyek(row.id))
    }

    return (
        <div className="flex justify-end text-lg">
            <span
                className={`cursor-pointer p-2 hover:${textTheme}`}
                onClick={(e) => onDetail(e)}
            >
                <TbReportSearch />
            </span>
            <span
                className={`cursor-pointer p-2 hover:${textTheme}`}
                onClick={(e) => onEdit(e)}
            >
                <HiOutlinePencil />
            </span>
            <span
                className="cursor-pointer p-2 hover:text-red-500"
                onClick={(e) => onDelete(e)}
            >
                <HiOutlineTrash />
            </span>
        </div>
    )
}

const ProyekTable = () => {
    const navigate = useNavigate()
    const tableRef = useRef<DataTableResetHandle>(null)

    const dispatch = useAppDispatch()

    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.proyekList.data.tableData
    )

    const filterData = useAppSelector(
        (state) => state.proyekList.data.filterData
    )

    const loading = useAppSelector((state) => state.proyekList.data.loading)

    const proyekData = useAppSelector(
        (state) => state.proyekList.data.proyekList
    )
    const kliensList = useAppSelector(
        (state) => state.proyekList.data.kliensList
    )

    // Handler for row click to navigate to detail page
    const handleRowClick = (row: Proyek) => {
        navigate(`/manajemen-proyek-detail/${row.id}`)
    }

    // Process the data to include client names
    const data = useMemo(() => {
        return proyekData.map((proyek) => {
            // Find the matching client
            const client = kliensList.find(
                (client) => client.id === proyek.idKlien
            )

            // Return proyek object with client name from kliensList
            return {
                ...proyek,
                klien: client ? client.nama : 'Klien Tidak Ditemukan',
            }
        })
    }, [proyekData, kliensList])

    useEffect(() => {
        fetchData()
        dispatch(getKliens()) // kliens
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
        dispatch(getProyeks({ pageIndex, pageSize, sort, query, filterData }))
    }

    const columns: ColumnDef<Proyek>[] = useMemo(
        () => [
            {
                header: 'Pekerjaan',
                accessorKey: 'pekerjaan',
                row: 100,
                minWidth: 350,
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex flex-col gap-1">
                            <div className="text-blue-600 text-xs font-semibold capitalize">
                                {row.client}
                            </div>
                            <div className="text-base font-medium text-neutral-800 ">
                                {row.pekerjaan}
                            </div>
                            <div className="text-blue-600 text-xs font-semibold">
                                {row.pic}
                            </div>
                        </div>
                    )
                },
            },
            {
                header: 'Nomor Kontrak',
                accessorKey: 'nomor_kontrak',
                minWidth: 200,
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div>
                            <div className="capitalize mb-1">
                                {row.nomor_kontrak}
                            </div>
                            <div className="bg-blue-600 text-xs rounded-md px-3 py-[3px] text-center text-white w-fit">
                                {formatDate(row.tanggal_kontrak)}
                            </div>
                        </div>
                    )
                },
            },
            {
                header: 'Lokasi',
                accessorKey: 'lokasi',
                minWidth: 200,
                cell: (props) => {
                    const row = props.row.original

                    return (
                        <div className="flex flex-col gap-1">
                            {row.Lokasis && row.Lokasis.length > 0 ? (
                                row.Lokasis.map((loc, index) => {
                                    console.log('row', row)
                                    return (
                                        <a
                                            key={index}
                                            href={`https://www.google.com/maps?q=${loc.latitude},${loc.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group"
                                        >
                                            <div className="text-sm font-medium flex gap-1 items-center group-hover:text-blue-600 transition">
                                                <div className="text-lg group-hover:scale-110 transition">
                                                    <IoLocationSharp className="group-hover:text-blue-600 transition" />
                                                </div>
                                                <div className="text-blue-600">
                                                    {loc.lokasi}
                                                </div>
                                            </div>
                                        </a>
                                    )
                                })
                            ) : (
                                <span className="text-gray-400">
                                    Tidak ada lokasi
                                </span>
                            )}
                        </div>
                    )
                },
            },
            {
                header: 'Nilai Kontrak',
                accessorKey: 'nilai_kontrak',
                minWidth: 200,
                cell: (props) => {
                    const row = props.row.original

                    // Determine the color based on conditions
                    let textColorClass = 'text-yellow-600' // Default color

                    if (row.uang_muka === 0) {
                        textColorClass = 'text-red-500' // Red when realization is 0
                    } else if (row.uang_muka === row.nilai_kontrak) {
                        textColorClass = 'text-green-500' // Green when realization equals contract value
                    }

                    return (
                        <div className="flex flex-col">
                            <div className="text-sm font-semibold text-neutral-700">
                                Rp {row.nilai_kontrak.toLocaleString('id-ID')}
                            </div>
                            <div
                                className={`text-xs font-semibold ${textColorClass} gap-1 flex items-center`}
                            >
                                <div className="text-lg">
                                    <AiFillCreditCard className="group-hover:text-blue-600 transition" />
                                </div>
                                <span>
                                    Rp {row.uang_muka.toLocaleString('id-ID')}
                                    {/* Rp {row.uang_muka} */}
                                </span>
                            </div>
                        </div>
                    )
                },
            },

            {
                header: 'Progress',
                accessorKey: 'progress',
                minWidth: 150,
                cell: (props) => {
                    const row = props.row.original
                    const progress = row.progress || 0

                    return (
                        <div className="flex items-center justify-start">
                            <div className="relative w-16 h-16">
                                {/* Background circle */}
                                <svg
                                    className="w-full h-full"
                                    viewBox="0 0 100 100"
                                >
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="none"
                                        stroke="#a8e6d5"
                                        strokeWidth="15"
                                    />
                                    {/* Progress circle */}
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="none"
                                        stroke="#3cbfa6"
                                        strokeWidth="15"
                                        strokeDasharray={`${
                                            progress * 2.51
                                        } 251`}
                                        strokeDashoffset="0"
                                        transform="rotate(-90 50 50)"
                                    />
                                </svg>
                                {/* Percentage text in the middle */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xs font-medium text-teal-500">
                                        {progress}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                },
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => {
                    const row = props.row.original
                    return <span className="capitalize">{row.status}</span>
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
                onRowClick={handleRowClick}
            />
            <ProyekDeleteConfirmation />
        </>
    )
}

export default ProyekTable
