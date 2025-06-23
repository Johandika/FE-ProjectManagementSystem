import { useEffect, useMemo, useRef, useState } from 'react'
import DataTable from '@/components/shared/DataTable'
import {
    getTagihanProyeks,
    setTableData,
    // setSelectedProduct,
    // toggleDeleteConfirmation,
    useAppDispatch,
    useAppSelector,
} from '../store'
// import TagihanProyekDeleteConfirmation from './TagihanProyekDeleteConfirmation'
import cloneDeep from 'lodash/cloneDeep'
import type {
    DataTableResetHandle,
    OnSortParam,
    ColumnDef,
} from '@/components/shared/DataTable'
import { Button, Dialog, Spinner } from '@/components/ui'
import { formatDate } from '@/utils/formatDate'

type Product = {
    id: string
    total_tagihan: number
    nilai_kontrak: number
    nomor_kontrak: string
    pekerjaan: string
    pic: string
    tanggal_kontrak: string
}

const TagihanProyekTable = () => {
    const tableRef = useRef<DataTableResetHandle>(null)
    const dispatch = useAppDispatch()
    const [isOpenDialog, setIsOpenDialog] = useState(false)

    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.tagihanProyekList.data.tableData
    )

    const filterData = useAppSelector(
        (state) => state.tagihanProyekList.data.filterData
    )

    const { loading, loadingGetTagihanProyek } = useAppSelector(
        (state) => state.tagihanProyekList.data
    )

    const data = useAppSelector(
        (state) => state.tagihanProyekList.data.proyeksList
    )

    const tagihanData = useAppSelector(
        (state) => state.tagihanProyekList.data.tagihanData
    )

    console.log(
        'data',
        useAppSelector((state) => state.tagihanProyekList.data.proyeksList)
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
            getTagihanProyeks({ pageIndex, pageSize, sort, query, filterData })
        )
    }

    const onDialogClose = () => {
        setIsOpenDialog(false)
    }

    const columns: ColumnDef<Product>[] = useMemo(
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
                                {row.nomor_kontrak}
                            </div>
                            <div className="text-base font-medium text-neutral-800">
                                {row.idTender && (
                                    <span className="bg-emerald-100 text-emerald-600 w-[20px] h-[20px] px-[6px] py-[2px]  mr-2 text-xs font-semibold rounded-md">
                                        Tender
                                    </span>
                                )}
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
                header: 'Nilai Kontrak',
                accessorKey: 'nilai_kontrak',
                minWidth: 150,
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
                header: 'Total Tagihan',
                accessorKey: 'total_tagihan',
                minWidth: 150,
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="capitalize">
                            {row.total_tagihan.toLocaleString('id-ID')}
                        </span>
                    )
                },
            },
            {
                header: 'Tanggal Kontrak',
                accessorKey: 'tanggal_kontrak',
                minWidth: 150,
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="capitalize">
                            {formatDate(row.tanggal_kontrak)}
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
                    totalPage: tableData.totalPage as number, // Tambahkan jika diperlukan
                }}
                onPaginationChange={onPaginationChange}
                onSelectChange={onSelectChange}
                onSort={onSort}
            />
            {/* <TagihanProyekDeleteConfirmation /> */}
            <Dialog
                isOpen={isOpenDialog}
                width={1000}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
            >
                <div className="flex flex-col h-full justify-between">
                    <h5 className="mb-4">Detail Daftar Tagihan</h5>
                    <div className="overflow-y-auto bg-slate-50">
                        {loadingGetTagihanProyek ? (
                            <div className="flex justify-center items-center ">
                                <Spinner size={100} />
                            </div>
                        ) : (
                            <div className=" max-h-[50vh] ml-6">
                                {tagihanData.tagihan_details?.length > 0 ? (
                                    tagihanData.tagihan_details?.map(
                                        (item, index) => (
                                            <div
                                                key={item.id}
                                                className="flex flex-row my-2 py-4 border-b gap-2"
                                            >
                                                <div>
                                                    <strong>
                                                        {`${index + 1}.`}
                                                    </strong>
                                                </div>
                                                <div>
                                                    <p>
                                                        <strong>
                                                            Pekekrjaan:
                                                        </strong>{' '}
                                                        {item.pekerjaan}
                                                    </p>
                                                    <p>
                                                        <strong>PIC:</strong>{' '}
                                                        {item.pic}
                                                    </p>
                                                    <p>
                                                        <strong>
                                                            Nomor Kontrak:
                                                        </strong>{' '}
                                                        {item.nomor_kontrak}
                                                    </p>
                                                    <p>
                                                        <strong>
                                                            Nliai Kontrak:
                                                        </strong>{' '}
                                                        {item.nilai_kontrak.toLocaleString(
                                                            'id-ID'
                                                        )}
                                                    </p>
                                                    <p>
                                                        <strong>
                                                            Nominal Tagihan:
                                                        </strong>{' '}
                                                        {item.nominal_tagihan.toLocaleString(
                                                            'id-ID'
                                                        )}
                                                    </p>
                                                    <p>
                                                        <strong>
                                                            Tanggal Kontrak:
                                                        </strong>{' '}
                                                        {formatDate(
                                                            item.tanggal_kontrak
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    )
                                ) : (
                                    <div>Tidak ada detail tagihan</div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="text-right mt-6">
                        <Button variant="solid" onClick={onDialogClose}>
                            OK
                        </Button>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default TagihanProyekTable
