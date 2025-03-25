import {
    useAppDispatch,
    getProyek,
    useAppSelector,
} from '../../ProyekEdit/store'
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function Detail() {
    const dispatch = useAppDispatch()
    const location = useLocation()

    const proyekData = useAppSelector(
        (state) => state.proyekEdit.data.proyekData
    )

    const fetchData = (data: { id: string }) => {
        dispatch(getProyek(data))
    }

    useEffect(() => {
        const path = location.pathname.substring(
            location.pathname.lastIndexOf('/') + 1
        )
        const rquestParam = { id: path }
        fetchData(rquestParam)

        // dispatch(getKliens()) // kliens
        // dispatch(getBerkases()) // kliens
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname])

    console.log('proyekdata', proyekData)
    return (
        <div className="space-y-3">
            <div className="flex flex-row gap-4">
                <div className="font-semibold">Nama :</div>
                <div>{proyekData.pekerjaan}</div>
            </div>
            <div className="flex flex-row gap-4">
                <div className="font-semibold">Klien :</div>
                <div>{proyekData.klien}</div>
            </div>
            <div className="flex flex-row gap-4">
                <div className="font-semibold">PIC :</div>
                <div>{proyekData.pic}</div>
            </div>
            <div className="flex flex-row gap-4">
                <div className="font-semibold">Nomor SPK :</div>
                <div>{proyekData.nomor_spk}</div>
            </div>
            <div className="flex flex-row gap-4">
                <div className="font-semibold">Nomor SPO :</div>
                <div>{proyekData.nomor_spo}</div>
            </div>
            <div className="flex flex-row gap-4">
                <div className="font-semibold">Tgl. Kontrak :</div>
                <div>{proyekData.tanggal_kontrak}</div>
            </div>
            <div className="flex flex-row gap-4">
                <div className="font-semibold">Tgl. Service PO :</div>
                <div>{proyekData.tanggal_service_po}</div>
            </div>
            <div className="flex flex-row gap-4">
                <div className="font-semibold">Tgl. Delivery :</div>
                <div>{proyekData.tanggal_delivery}</div>
            </div>
            <div className="flex flex-row gap-4">
                <div className="font-semibold">Status :</div>
                <div>{proyekData.status}</div>
            </div>
            <div className="flex flex-row gap-4">
                <div className="font-semibold">Nilai Kontrak :</div>
                <div>{proyekData.nilai_kontrak?.toLocaleString('id-ID')}</div>
            </div>
            <div className="flex flex-row gap-4">
                <div className="font-semibold">Realisasi :</div>
                <div>{proyekData.realisasi?.toLocaleString('id-ID')}</div>
            </div>
        </div>
    )
}
