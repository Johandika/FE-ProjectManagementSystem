import { useEffect, useMemo, useRef, useState } from 'react'
import DataTable from '@/components/shared/DataTable'
import { HiOutlineEye, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import {
    getTagihanKliens,
    setTableData,
    setSelectedProduct,
    toggleDeleteConfirmation,
    useAppDispatch,
    useAppSelector,
    getTagihanKlien,
} from '../store'
import useThemeClass from '@/utils/hooks/useThemeClass'
// import TagihanKlienDeleteConfirmation from './TagihanKlienDeleteConfirmation'
import { useNavigate } from 'react-router-dom'
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
    nama: string
    total_tagihan: number
}

const TagihanKlienTable = () => {
    const tableRef = useRef<DataTableResetHandle>(null)
    const dispatch = useAppDispatch()
    const { textTheme } = useThemeClass()
    const [isOpenDialog, setIsOpenDialog] = useState(false)

    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.tagihanKlienList.data.tableData
    )

    const filterData = useAppSelector(
        (state) => state.tagihanKlienList.data.filterData
    )

    const { loading, loadingGetTagihanKlien } = useAppSelector(
        (state) => state.tagihanKlienList.data
    )

    const data = useAppSelector(
        (state) => state.tagihanKlienList.data.productList
    )

    const tagihanData = useAppSelector(
        (state) => state.tagihanKlienList.data.tagihanData
    )

    console.log('tagihanData', tagihanData)
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
            getTagihanKliens({ pageIndex, pageSize, sort, query, filterData })
        )
    }

    const handleDetail = (id: string) => {
        dispatch(getTagihanKlien({ id }))
        setIsOpenDialog(true)
    }

    const onDialogClose = () => {
        setIsOpenDialog(false)
    }

    const columns: ColumnDef<Product>[] = useMemo(
        () => [
            {
                header: 'Nama',
                accessorKey: 'nama',
                cell: (props) => {
                    const row = props.row.original
                    return <span className="capitalize">{row.nama}</span>
                },
            },
            {
                header: 'Total Tagihan',
                accessorKey: 'total_tagihan',
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
                header: '',
                id: 'action',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex justify-end text-lg">
                            <span
                                className={`cursor-pointer p-2 hover:${textTheme}`}
                                onClick={() => handleDetail(row.id)}
                            >
                                <HiOutlineEye />
                            </span>
                        </div>
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
            {/* <TagihanKlienDeleteConfirmation /> */}
            <Dialog
                isOpen={isOpenDialog}
                width={1000}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
            >
                <div className="flex flex-col h-full justify-between">
                    <h5 className="mb-4">Detail Daftar Tagihan</h5>
                    <div className="overflow-y-auto bg-slate-50">
                        {loadingGetTagihanKlien ? (
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

export default TagihanKlienTable
