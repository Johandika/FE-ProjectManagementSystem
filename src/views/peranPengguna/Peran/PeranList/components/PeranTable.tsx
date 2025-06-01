import { useEffect, useMemo, useRef } from 'react'
import DataTable from '@/components/shared/DataTable'
import { useAppDispatch, useAppSelector, getRoles } from '../store'
import type {
    DataTableResetHandle,
    ColumnDef,
} from '@/components/shared/DataTable'

type Satuan = {
    id: string
    nama: string
}

const PeranTable = () => {
    const tableRef = useRef<DataTableResetHandle>(null)

    const dispatch = useAppDispatch()

    const loading = useAppSelector((state) => state.peranList.data.loading)

    const rolesData = useAppSelector((state) => state.peranList.data.peranList)

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchData = () => {
        dispatch(getRoles())
    }

    const columns: ColumnDef<Satuan>[] = useMemo(
        () => [
            {
                header: 'Peran',
                accessorKey: 'satuan',
                cell: (props) => {
                    const row = props.row.original
                    return <span className="capitalize">{row.nama}</span>
                },
            },
        ],
        []
    )

    return (
        <>
            <DataTable
                ref={tableRef}
                columns={columns}
                data={rolesData}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ className: 'rounded-md' }}
                loading={loading}
                pagingData={{
                    total: 2,
                    pageIndex: 1,
                    pageSize: 10,
                }}
            />
        </>
    )
}

export default PeranTable
