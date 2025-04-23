import { Checkbox } from '@/components/ui'
import { ChangeEvent, useEffect } from 'react'
// import {
//     getBerkasProyek,
//     useAppDispatch,
//     useAppSelector,
// } from '../../ProyekEdit/store'
import reducer, {
    useAppSelector,
    getBerkasProyek,
    useAppDispatch,
    updateBerkasProyekStatus,
} from '../store'
import { injectReducer } from '@/store'
import { Loading } from '@/components/shared'
import { isEmpty } from 'lodash'

injectReducer('proyekDetail', reducer)

export default function Bastp() {
    const dispatch = useAppDispatch()

    const berkasProyekData = useAppSelector(
        (state) => state.proyekDetail.data.berkasProyekData || []
    )

    const loadingBerkasProyekData = useAppSelector(
        (state) => state.proyekDetail.data.loadingBerkasProyeks
    )

    // Fungsi handler untuk checkbox
    const onCheck =
        (item: any) => (checked: boolean, e: ChangeEvent<HTMLInputElement>) => {
            // Buat objek baru dengan status yang diperbarui
            const updatedItem = {
                ...item,
                status: checked,
            }

            // Dispatch action untuk update
            dispatch(updateBerkasProyekStatus(updatedItem))
        }

    const fetchData = (data: { id: string }) => {
        dispatch(getBerkasProyek(data))
    }

    useEffect(() => {
        const path = location.pathname.substring(
            location.pathname.lastIndexOf('/') + 1
        )
        const rquestParam = { id: path }
        fetchData(rquestParam)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname])

    return (
        <Loading loading={loadingBerkasProyekData}>
            <div className="flex flex-col gap-4  py-6">
                {!isEmpty(berkasProyekData) && (
                    <>
                        {berkasProyekData.map((item: any) => (
                            <Checkbox
                                key={item.id}
                                defaultChecked={item.status}
                                onChange={(checked, e) =>
                                    onCheck(item)(checked, e)
                                }
                            >
                                {item.nama}
                            </Checkbox>
                        ))}
                    </>
                )}
            </div>
        </Loading>
    )
}
