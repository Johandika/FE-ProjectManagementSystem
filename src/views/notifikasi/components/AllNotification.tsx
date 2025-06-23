import { Loading } from '@/components/shared'
import reducer, {
    getAllNotification,
    useAppSelector,
    useAppDispatch,
    setUnreadNotification,
} from '../store'

import { injectReducer } from '@/store'
import { useEffect, useState } from 'react'
import { Avatar, Button, Notification, toast } from '@/components/ui'
import { HiOutlineBell, HiOutlineTrash } from 'react-icons/hi'
import { formatWaktuNotifikasi } from '@/utils/formatDate'
import {
    apiDeleteOneNotification,
    apiGetOneAndReadNotification,
} from '@/services/NotificationService'

injectReducer('notification', reducer)

export default function AllNotification() {
    const dispatch = useAppDispatch()
    const [openDetailId, setOpenDetailId] = useState<string | null>(null)

    const dataNotification = useAppSelector(
        (state) => state.notification.data.dataNotification.data
    )

    const loading = useAppSelector((state) => state.notification.data.loading)
    console.log('data luar', dataNotification)

    const handleDeletNotification = async (data: { id: string }) => {
        try {
            const result = await apiDeleteOneNotification(data)
            if (
                result &&
                result.data.statusCode >= 200 &&
                result.data.statusCode < 300
            ) {
                dispatch(getAllNotification())

                toast.push(
                    <Notification
                        title="Berhasil Hapus Notifikasi"
                        type="success"
                        duration={2500}
                    >
                        Notifikasi berhasil dihapus
                    </Notification>,
                    { placement: 'top-center' }
                )
            } else {
                toast.push(
                    <Notification
                        title="Gagal Hapus Notifikasi"
                        type="danger"
                        duration={2500}
                    >
                        {result.data.message ||
                            'Terjadi kesalahan saat menghapus notifikasi'}
                    </Notification>,
                    { placement: 'top-center' }
                )
            }
        } catch (error) {
            console.error('Error deleting notification:', error)
            toast.push(
                <Notification
                    title="Gagal Hapus Notifikasi"
                    type="danger"
                    duration={2500}
                >
                    Terjadi kesalahan saat menghapus notifikasi
                </Notification>,
                { placement: 'top-center' }
            )
        }
    }

    const handleReadStatus = async (data: { id: string }) => {
        try {
            const result = await apiGetOneAndReadNotification(data)
            if (result && result.statusCode >= 200 && result.statusCode < 300) {
                dispatch(getAllNotification())
                toast.push(
                    <Notification
                        title="Berhasil Tandai Dibaca"
                        type="success"
                        duration={2500}
                    >
                        Notifikasi berhasil ditandai sebagai sudah dibaca
                    </Notification>,
                    { placement: 'top-center' }
                )
            } else {
                toast.push(
                    <Notification
                        title="Gagal Tandai Dibaca"
                        type="danger"
                        duration={2500}
                    >
                        {result.data.message ||
                            'Terjadi kesalahan saat menandai notifikasi'}
                    </Notification>,
                    { placement: 'top-center' }
                )
            }
        } catch (error) {
            console.error('Error marking notification as read:', error)
            toast.push(
                <Notification
                    title="Gagal Tandai Dibaca"
                    type="danger"
                    duration={2500}
                >
                    Terjadi kesalahan saat menandai notifikasi
                </Notification>,
                { placement: 'top-center' }
            )
        }
    }

    useEffect(() => {
        dispatch(getAllNotification())
    }, [location.pathname])

    useEffect(() => {
        if (!dataNotification || dataNotification.length === 0) {
            dispatch(setUnreadNotification(false))
        }
    }, [dataNotification, dispatch])

    return (
        <Loading loading={loading}>
            <div>
                {dataNotification && dataNotification.length > 0 ? (
                    dataNotification.map((item, index) => (
                        <div
                            key={item.id}
                            className={`py-2 
                                ${index === 0 ? 'border-t' : ''}
                                ${openDetailId === item.id ? 'bg-slate-50' : ''}
                                    border-b hover:bg-slate-50 cursor-pointer pl-4`}
                            onClick={() =>
                                setOpenDetailId(
                                    openDetailId === item.id ? null : item.id
                                )
                            }
                        >
                            <div className="my-1 flex items-center">
                                <Avatar
                                    shape="circle"
                                    className={`
                                            ${
                                                item.type === 'timeline'
                                                    ? 'bg-amber-100 text-amber-600'
                                                    : item.type === 'adendum'
                                                    ? 'bg-blue-100 text-blue-600'
                                                    : item.type ===
                                                      'faktur_pajak'
                                                    ? 'bg-green-100 text-green-600'
                                                    : item.type === 'project'
                                                    ? 'bg-fuchsia-100 text-fuchsia-600'
                                                    : ''
                                            }
                                            dark:bg-blue-500/20 dark:text-blue-100`}
                                    icon={<HiOutlineBell />}
                                />
                                <span className="ml-3 font-semibold text-gray-900 dark:text-gray-100">
                                    {item.type}
                                </span>
                                <span className="mx-2">diinfokan pada</span>
                                <span className="">
                                    {formatWaktuNotifikasi(item.createdAt)}{' '}
                                </span>
                                <div className="flex flex-row ml-auto space-x-2 justify-center items-center">
                                    {item.status_baca === false ? (
                                        <Button
                                            size="xs"
                                            className="flex items-center justify-center ml-auto"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleReadStatus(item)
                                            }}
                                        >
                                            Tandai Dibaca
                                        </Button>
                                    ) : (
                                        <Button
                                            size="xs"
                                            className="flex items-center justify-center ml-auto"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleReadStatus(item)
                                            }}
                                            disabled
                                        >
                                            Sudah Dibaca
                                        </Button>
                                    )}
                                    <Button
                                        type="button"
                                        shape="circle"
                                        variant="plain"
                                        size="sm"
                                        className="text-red-500"
                                        icon={<HiOutlineTrash />}
                                        onClick={() =>
                                            handleDeletNotification(item)
                                        }
                                    />
                                </div>
                            </div>
                            {openDetailId === item.id && (
                                <div className="mt-8 mb-8 ">
                                    <p>{item.pesan}</p>
                                    {item.type === 'faktur_pajak' && (
                                        <div className="mt-4 flex gap-3">
                                            <Button
                                                size="sm"
                                                className="text-xs flex justify-center items-center"
                                            >
                                                Tolak Faktur
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="text-xs flex justify-center items-center"
                                                variant="solid"
                                            >
                                                Setujui Faktur
                                            </Button>
                                        </div>
                                    )}
                                    {item.type === 'adendum' && (
                                        <div className="mt-4 flex">
                                            <Button
                                                variant="solid"
                                                size="sm"
                                                className="text-xs flex justify-center items-center"
                                            >
                                                Lihat Adendum
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div>data empty</div>
                )}
            </div>
        </Loading>
    )
}
