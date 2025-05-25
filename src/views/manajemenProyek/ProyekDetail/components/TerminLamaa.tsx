import { Loading } from '@/components/shared'
import React, { useEffect } from 'react'
import DescriptionSection from './DesriptionSection'
import { Button, Checkbox } from '@/components/ui'
import { useAppDispatch } from '@/store'
import {
    getFakturPajakByProyekId,
    getTermins,
    updateFakturPajak,
    useAppSelector,
} from '../../ProyekEdit/store'
import {
    HiChevronDown,
    HiChevronUp,
    HiOutlinePencil,
    HiOutlinePlus,
    HiOutlineTrash,
} from 'react-icons/hi'

export default function Termin() {
    const dispatch = useAppDispatch()

    // Get project ID from path
    const getProjectId = () => {
        return location.pathname.substring(
            location.pathname.lastIndexOf('/') + 1
        )
    }

    const terminsData = useAppSelector(
        (state) => state.proyekEdit.data.terminsData
    )

    const { loadingTermins, loadingFakturPajakByProyekData } = useAppSelector(
        (state) => state.proyekEdit.data
    )

    const fetchData = (data: { id: string }) => {
        dispatch(getTermins(data)) // by id
        dispatch(getFakturPajakByProyekId(data))
    }

    useEffect(() => {
        const projectId = getProjectId()
        const requestParam = { id: projectId }
        fetchData(requestParam)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname])
    return (
        <Loading loading={loadingTermins || loadingFakturPajakByProyekData}>
            <div className="flex flex-col py-6 mt-4">
                {/* SECTION ATAS */}
                <div className="flex flex-row justify-between items-center mb-2">
                    <div>
                        <DescriptionSection
                            title="Termin"
                            desc="Tambahkan data termin dan faktur"
                        />
                        <div className="mt-2 text-sm">
                            Total:{' '}
                            <span className="font-bold">
                                60%
                                {/* {totalPercentageUsed}% */}
                            </span>{' '}
                            {/* ({remainingPercentage}% remaining) */}
                            (40% remaining)
                        </div>
                    </div>
                    <Button
                        size="sm"
                        variant="twoTone"
                        // onClick={() => openTerminDialog()}
                        className="w-fit text-xs"
                        // disabled={remainingPercentage <= 0}
                    >
                        Tambah Termin
                    </Button>
                </div>
                {/* SECTION BAWAH */}
                {/* Header Tabel */}
                <div className="grid grid-cols-4 px-4 gap-4 font-semibold bg-gray-100 py-5 rounded-t-md">
                    <div>Nama Termin</div>
                    <div>Persentase (%)</div>
                    <div>Nilai</div>
                    <div className="ml-auto ">Aksi</div>
                </div>
                {/* Data Tabel */}
                <div className="grid grid-cols-4 px-4 gap-4 py-5 ">
                    <div>
                        {' '}
                        <div className="col-span-1 flex items-center">
                            <button
                                // onClick={() => toggleItemExpand(index)}
                                className="mr-2"
                                type="button"
                            >
                                {/* {expandedItems[index] ? ( */}
                                <HiChevronUp />
                                {/* ) : ( */}
                                <HiChevronDown />
                                {/* )} */}
                            </button>
                            <span className="font-semibold">
                                <Checkbox
                                // defaultChecked={item.status}
                                // onChange={(checked, e) =>
                                //     onCheck(item)(checked, e)
                                // }
                                >
                                    {/* {item.nama} */}
                                    Test
                                </Checkbox>
                                {/* {
                                  item.nama
                                 } */}
                            </span>
                        </div>
                    </div>
                    <div>Persentase (%)</div>
                    <div>Nilai</div>
                    <div className="col-span-1 flex justify-end space-x-2">
                        <Button
                            size="xs"
                            variant="twoTone"
                            // onClick={() => handleAddDetail(index)}
                            icon={<HiOutlinePlus />}
                        >
                            Faktur
                        </Button>
                        <Button
                            size="xs"
                            variant="twoTone"
                            // onClick={() => handleEditItem(index)}
                            icon={<HiOutlinePencil />}
                        />
                        <Button
                            size="xs"
                            variant="twoTone"
                            color="red"
                            // onClick={() => handleConfirmDeleteItem(index)}
                            icon={<HiOutlineTrash />}
                        />
                    </div>
                </div>
            </div>
        </Loading>
    )
}
