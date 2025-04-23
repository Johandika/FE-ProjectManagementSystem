import reducer, {
    useAppDispatch,
    getProyek,
    useAppSelector,
    getTermins,
} from '../../ProyekEdit/store'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import DescriptionSection from './DesriptionSection'
import { IoLocationSharp } from 'react-icons/io5'
import { BiHardHat } from 'react-icons/bi'
import isLastChild from '@/utils/isLastChild'
import classNames from 'classnames'
import { injectReducer } from '@/store'

injectReducer('proyekEdit', reducer)

export default function Detail() {
    const dispatch = useAppDispatch()
    const location = useLocation()

    const proyekData = useAppSelector(
        (state) => state.proyekEdit.data.proyekData
    )

    const terminsData = useAppSelector(
        (state) => state.proyekEdit.data.terminsData
    )

    const fetchData = (data: { id: string }) => {
        dispatch(getProyek(data))
        dispatch(getTermins(data))
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

    return (
        <section className=" ">
            <div className="">
                {/* Informasi Dasar */}
                <div className="flex flex-col gap-4 border-b border-gray-200 py-6">
                    <DescriptionSection
                        title="Informasi Dasar"
                        desc="Informasi dasar proyek"
                    />
                    <div className="space-y-0">
                        <div className="flex flex-col sm:flex-row gap-0 sm:gap-2">
                            <div className="font-semibold flex-0">
                                Nama Pekerjaan :
                            </div>
                            <div className="flex-1">{proyekData.pekerjaan}</div>
                        </div>
                        <div className="flex flex-row gap-2">
                            <div className="font-semibold">Klien :</div>
                            <div>{proyekData.klien}</div>
                        </div>
                        <div className="flex flex-row gap-2">
                            <div className="font-semibold">PIC :</div>
                            <div>{proyekData.pic}</div>
                        </div>
                        <div className="flex flex-row gap-2">
                            <div className="font-semibold">Nomor Kontrak :</div>
                            <div>{proyekData.nomor_kontrak}</div>
                        </div>
                        <div className="flex flex-row gap-2">
                            <div className="font-semibold">Tgl. Kontrak :</div>
                            <div>{proyekData.tanggal_kontrak}</div>
                        </div>
                        <div className="flex flex-row gap-2">
                            <div className="font-semibold">Tgl. PO :</div>
                            <div>{proyekData.tanggal_service_po}</div>
                        </div>
                        <div className="flex flex-row gap-2">
                            <div className="font-semibold">Tgl. Delivery :</div>
                            <div>{proyekData.tanggal_delivery}</div>
                        </div>
                        <div className="flex flex-row gap-2">
                            <div className="font-semibold">Status :</div>
                            <div>{proyekData.status}</div>
                        </div>
                        <div className="flex flex-row gap-2">
                            <div className="font-semibold">Nilai Kontrak :</div>
                            <div>
                                {proyekData.nilai_kontrak?.toLocaleString(
                                    'id-ID'
                                )}
                            </div>
                        </div>
                        <div className="flex flex-row gap-2">
                            <div className="font-semibold">Realisasi :</div>
                            <div>
                                {proyekData.realisasi?.toLocaleString('id-ID')}
                            </div>
                        </div>
                        <div className="flex flex-row gap-2">
                            <div className="font-semibold">Progress (%) :</div>
                            <div>{proyekData.progress}</div>
                        </div>
                        <div className="flex flex-row gap-2">
                            <div className="font-semibold">
                                Waktu Pengerjaan (hari) :
                            </div>
                            <div>{proyekData.sisa_waktu}</div>
                        </div>
                        <div className="flex flex-row gap-2">
                            <div className="font-semibold">Berkas BAST :</div>
                            <div>
                                {proyekData.berkas &&
                                    proyekData.berkas.map((berkas, index) => (
                                        <span key={index}>
                                            {berkas}
                                            {index <
                                            proyekData.berkas.length - 1
                                                ? ', '
                                                : ''}
                                        </span>
                                    ))}
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-0 sm:gap-2">
                            <div className="font-semibold flex-0">
                                Keterangan :
                            </div>
                            <div className="flex-1">
                                {proyekData.keterangan}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Informasi Lokasi */}
                <div className="flex flex-col gap-4 border-b border-gray-200 py-6">
                    <DescriptionSection
                        title="Informasi Lokasi"
                        desc="Informasi lokasi proyek"
                    />
                    {proyekData && (
                        <div className="rounded-lg border border-gray-200 dark:border-gray-600">
                            {proyekData.lokasi?.map((data, index) => (
                                <a
                                    key={data.nama}
                                    href={`https://www.google.com/maps?q=${data.latitude},${data.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={classNames(
                                        'flex items-center px-4 py-6 group',
                                        !isLastChild(
                                            proyekData.lokasi as [],
                                            index
                                        ) &&
                                            'border-b border-gray-200 dark:border-gray-600'
                                    )}
                                >
                                    <div className="flex items-center">
                                        <div className="text-3xl">
                                            <IoLocationSharp className="group-hover:text-blue-600 transition" />
                                        </div>
                                        <div className="ml-3 rtl:mr-3">
                                            <div className="flex items-center">
                                                <div className="text-gray-900 dark:text-gray-100 font-semibold">
                                                    {data.nama}
                                                </div>
                                            </div>
                                            <span>
                                                lat: {data.latitude}, long:{' '}
                                                {data.longitude}
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}
                </div>
                {/* Informasi Termin */}
                <div className="flex flex-col gap-4 border-b border-gray-200 py-6">
                    <DescriptionSection
                        title="Informasi Termin"
                        desc="Informasi termin pembayaran proyek"
                    />
                    <div className="space-y-2">
                        {terminsData?.map((termin, index) => (
                            <div
                                key={index}
                                className="bg-slate-50 rounded-md flex flex-row items-center gap-3 p-6 w-full"
                            >
                                {termin.keterangan} = {termin.persen}%
                            </div>
                        ))}
                    </div>
                </div>
                {/* Subkontraktor */}
                <div className="flex flex-col gap-4 border-b border-gray-200 py-6">
                    <DescriptionSection
                        title="Informasi Subkontraktor"
                        desc="Informasi subkontraktor proyek"
                    />
                    {proyekData.subkontraktor && (
                        <div className="rounded-lg border border-gray-200 dark:border-gray-600">
                            {proyekData.subkontraktor?.map((data, index) => (
                                <section
                                    key={data.nama_vendor_subkon}
                                    className={classNames(
                                        'flex items-center px-4 py-6 group',
                                        !isLastChild(
                                            proyekData.subkontraktor as [],
                                            index
                                        ) &&
                                            'border-b border-gray-200 dark:border-gray-600'
                                    )}
                                >
                                    <div className="flex items-center">
                                        <div className="text-3xl">
                                            <BiHardHat />
                                        </div>
                                        <div className="ml-3 rtl:mr-3">
                                            <div className="flex items-center gap-1">
                                                <div className="text-gray-900 dark:text-gray-100 font-semibold">
                                                    {data.nama_vendor_subkon}
                                                </div>
                                                <span>
                                                    ({data.nomor_surat})
                                                </span>
                                            </div>
                                            <div>
                                                {data.nilai_subkon.toLocaleString(
                                                    'id-ID'
                                                )}
                                            </div>
                                            <span>
                                                {
                                                    data
                                                        .waktu_pelaksanaan_kerja[0]
                                                }{' '}
                                                s.d.{' '}
                                                {
                                                    data
                                                        .waktu_pelaksanaan_kerja[1]
                                                }
                                            </span>
                                            <div>{data.keterangan}</div>
                                        </div>
                                    </div>
                                </section>
                            ))}
                        </div>
                    )}
                    {!proyekData.subkontraktor && (
                        <div>Subkontraktor tidak terdaftar</div>
                    )}
                </div>
            </div>
        </section>
    )
}
