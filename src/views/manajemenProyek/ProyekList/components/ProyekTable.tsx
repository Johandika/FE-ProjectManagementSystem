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

type Proyek = {
    id: string
    pekerjaan: string
    klien: string
    nomor_spk: number
    tanggal_service_po: string
    tanggal_delivery: string
    nilai_kontrak: number
    realisasi: number
    progress: number
    status: string
    idKlien: string
}

const ActionColumn = ({ row }: { row: Proyek }) => {
    const dispatch = useAppDispatch()
    const { textTheme } = useThemeClass()
    const navigate = useNavigate()

    const onDetail = () => {
        navigate(`/manajemen-proyek-detail/${row.id}`)
    }

    const onEdit = () => {
        navigate(`/manajemen-proyek-edit/${row.id}`)
    }

    const onDelete = () => {
        dispatch(toggleDeleteConfirmation(true))
        dispatch(setSelectedProyek(row.id))
    }

    return (
        <div className="flex justify-end text-lg">
            <span
                className={`cursor-pointer p-2 hover:${textTheme}`}
                onClick={onDetail}
            >
                <TbReportSearch />
            </span>
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

const ProyekTable = () => {
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
                cell: (props) => {
                    const row = props.row.original
                    return <span className="capitalize">{row.pekerjaan}</span>
                },
            },
            {
                header: 'Klien',
                accessorKey: 'klien',
                cell: (props) => {
                    const row = props.row.original
                    return <span className="capitalize">{row.klien}</span>
                },
            },
            {
                header: 'Nomor SPK',
                accessorKey: 'nomor_spk',
                cell: (props) => {
                    const row = props.row.original
                    return <span className="capitalize">{row.nomor_spk}</span>
                },
            },

            {
                header: 'Tangggal Servis PO',
                accessorKey: 'tanggal_service_po',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="capitalize">
                            {row.tanggal_service_po}
                        </span>
                    )
                },
            },
            {
                header: 'Tangggal Delivery',
                accessorKey: 'tanggal_delivery',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="capitalize">
                            {row.tanggal_delivery}
                        </span>
                    )
                },
            },
            {
                header: 'Nilai Kontrak',
                accessorKey: 'nilai_kontrak',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="capitalize">
                            {row.nilai_kontrak.toLocaleString('id-ID')}
                        </span>
                    )
                },
            },
            {
                header: 'Realiasasi',
                accessorKey: 'realisasi',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="capitalize">
                            {row.realisasi.toLocaleString('id-ID')}
                        </span>
                    )
                },
            },
            {
                header: 'Progress',
                accessorKey: 'progress',
                cell: (props) => {
                    const row = props.row.original
                    return <span className="capitalize">{row.progress}%</span>
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
            />
            <ProyekDeleteConfirmation />
        </>
    )
}

export default ProyekTable
