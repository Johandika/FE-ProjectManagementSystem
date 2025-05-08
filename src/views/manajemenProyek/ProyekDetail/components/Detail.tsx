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
import { formatDate } from '@/utils/formatDate'
import { format } from 'path'

injectReducer('proyekEdit', reducer)

export default function Detail() {
    const dispatch = useAppDispatch()
    const location = useLocation()

    const proyekData = useAppSelector(
        (state) => state.proyekEdit.data.proyekData
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
            <div>
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
                            <div>{proyekData.Client?.nama}</div>
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
                            <div>
                                {formatDate(proyekData.tanggal_kontrak || '')}
                            </div>
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
                            <div className="font-semibold">Progress (%) :</div>
                            <div>{proyekData.progress}</div>
                        </div>
                        <div className="flex flex-row gap-2">
                            <div className="font-semibold">
                                Waktu Pengerjaan (hari) :
                            </div>
                            <div>{proyekData.timeline}</div>
                        </div>
                        {/* <div className="flex flex-row gap-2">
                            <div className="font-semibold">
                                Berkas Tagihan :
                            </div>
                            <div>
                                {proyekData.BerkasProjects &&
                                    proyekData.BerkasProjects.map(
                                        (berkas, index) => (
                                            <span key={berkas.id}>
                                                {berkas.nama}
                                                {index <
                                                proyekData?.BerkasProjects
                                                    .length -
                                                    1
                                                    ? ', '
                                                    : ''}
                                            </span>
                                        )
                                    )}
                            </div>
                        </div> */}

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

                {/* Subkontraktor */}
                {/* <div className="flex flex-col gap-4 border-b border-gray-200 py-6">
                    <DescriptionSection
                        title="Informasi Subkontraktor"
                        desc="Informasi subkontraktor proyek"
                    />
                    {proyekData.SubkonProjects && (
                        <div className="rounded-lg border border-gray-200 dark:border-gray-600">
                            {proyekData.SubkonProjects?.map((data, index) => (
                                <section
                                    key={data.id}
                                    className={classNames(
                                        'flex items-center px-4 py-6 group',
                                        !isLastChild(
                                            proyekData.SubkonProjects as [],
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
                                                    {data.nama}
                                                </div>
                                                <span>
                                                    ({data.nomor_surat})
                                                </span>
                                            </div>
                                            <div>
                                                {data.nilai_subkontrak?.toLocaleString(
                                                    'id-ID'
                                                )}
                                            </div>
                                            <span>
                                                {formatDate(
                                                    data.waktu_mulai_pelaksanaan ||
                                                        ''
                                                )}{' '}
                                                s.d.{' '}
                                                {formatDate(
                                                    data.waktu_selesai_pelaksanaan ||
                                                        ''
                                                )}
                                            </span>
                                            <div>{data.keterangan}</div>
                                        </div>
                                    </div>
                                </section>
                            ))}
                        </div>
                    )}
                    {!proyekData.SubkonProjects && (
                        <div>Subkontraktor tidak terdaftar</div>
                    )}
                </div> */}
            </div>
        </section>
    )
}
