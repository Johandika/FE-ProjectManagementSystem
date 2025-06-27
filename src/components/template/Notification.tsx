import { useEffect, useState, useCallback } from 'react'
import classNames from 'classnames'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import ScrollBar from '@/components/ui/ScrollBar'
import Spinner from '@/components/ui/Spinner'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Tooltip from '@/components/ui/Tooltip'
import { HiOutlineBell, HiOutlineTrash } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import isLastChild from '@/utils/isLastChild'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { injectReducer, useAppDispatch } from '@/store'
import useResponsive from '@/utils/hooks/useResponsive'
import {
    apiDeleteAllReadNotification,
    apiGetUnreadNotification,
} from '@/services/NotificationService'
import { formatWaktuNotifikasi } from '@/utils/formatDate'
import { toast, Notification as NotificationuUi } from '../ui'
import reducer, {
    getAllNotification,
    getUnreadNotifiaction, // Thunk action untuk mengambil semua notifikasi
    setUnreadNotification,
    useAppSelector, // Hook selector dari slice Anda
} from '@/views/notifikasi/store'

type NotificationList = {
    id: string
    type: string
    pesan: string
    status_baca: boolean
    waktu_baca: string
    createdAt: string
}

const notificationHeight = 'h-72'

injectReducer('notification', reducer)

const NotificationToggle = ({
    className,
    dot,
}: {
    className?: string
    dot: boolean
}) => {
    return (
        <div className={classNames('text-2xl', className)}>
            {dot ? (
                <Badge badgeStyle={{ top: '3px', right: '6px' }}>
                    <HiOutlineBell />
                </Badge>
            ) : (
                <HiOutlineBell />
            )}
        </div>
    )
}

const _Notification = ({ className }: { className?: string }) => {
    const dispatch = useAppDispatch()

    // --- MENGGUNAKAN DATA DARI REDUX STORE ---
    // State unread (dot) dan daftar notifikasi diambil dari Redux.
    const unreadNotification = useAppSelector(
        (state) => state.notification.data.unreadNotification
    )
    const notificationList = useAppSelector(
        (state) => state.notification.data.dataNotification.data || [] // Fallback ke array kosong
    )

    // Anda bisa juga mengambil status loading dari slice jika ada
    // const loading = useAppSelector((state) => state.notification.loading)
    const [loading, setLoading] = useState(false)

    const { larger } = useResponsive()
    const direction = useAppSelector((state) => state.theme.direction)

    // Fungsi untuk memeriksa jumlah notifikasi yang belum dibaca dari API
    const getNotificationCount = useCallback(async () => {
        try {
            const resp = await apiGetUnreadNotification()
            const unreadMessageQty = resp.data.data
            dispatch(setUnreadNotification(unreadMessageQty > 0))
        } catch (error) {
            console.error('Failed to get notification count:', error)
            dispatch(setUnreadNotification(false))
        }
    }, [dispatch])

    // Mengambil data awal saat komponen pertama kali dimuat
    useEffect(() => {
        getNotificationCount()
        // Dispatch action untuk mengambil semua notifikasi dan menyimpannya di store
        dispatch(getAllNotification())
    }, [dispatch, getNotificationCount])

    // Fungsi ini akan dijalankan saat dropdown notifikasi dibuka
    const onNotificationOpen = useCallback(() => {
        // Jika list kosong, coba fetch lagi.
        // Umumnya, data sudah ada dari useEffect di atas.
        if (notificationList.length === 0) {
            dispatch(getAllNotification())
        }
    }, [dispatch, notificationList.length])

    // Fungsi untuk menghapus semua notifikasi yang sudah dibaca
    const deleteAllReadNotification = useCallback(async () => {
        setLoading(true)
        try {
            await apiDeleteAllReadNotification()
            toast.push(
                <NotificationuUi
                    title="Berhasil"
                    type="success"
                    duration={2500}
                >
                    Berhasil menghapus notifikasi yang sudah dibaca
                </NotificationuUi>,
                { placement: 'top-center' }
            )
            // Setelah berhasil menghapus, dispatch action lagi untuk refresh data dari server
            dispatch(getAllNotification())
        } catch (error: any) {
            toast.push(
                <NotificationuUi title="Error" type="danger" duration={2500}>
                    {error.response?.data?.message ||
                        'Gagal menghapus notifikasi'}
                </NotificationuUi>,
                { placement: 'top-center' }
            )
        } finally {
            setLoading(false)
        }
    }, [dispatch])

    // Efek ini akan menjaga state `unreadNotification` (untuk dot merah)
    // tetap sinkron dengan data di `notificationList`
    useEffect(() => {
        const hasUnread = notificationList.some((n) => !n.status_baca)
        if (hasUnread !== unreadNotification) {
            dispatch(setUnreadNotification(hasUnread))
        }
    }, [notificationList, unreadNotification, dispatch])

    const unreadNotifications = notificationList.filter(
        (n) => n.status_baca === false
    )

    return (
        <Dropdown
            renderTitle={
                <NotificationToggle
                    dot={unreadNotification}
                    className={className}
                />
            }
            menuClass="p-0 min-w-[280px] md:min-w-[340px]"
            placement={larger.md ? 'bottom-end' : 'bottom-center'}
            onOpen={onNotificationOpen}
        >
            <Dropdown.Item variant="header">
                <div className="border-b border-gray-200 dark:border-gray-600 px-4 py-2 flex items-center justify-between">
                    <h6>Notifikasi ({unreadNotifications?.length})</h6>
                    <Tooltip title="Hapus pesan yg sudah dibaca">
                        <Button
                            variant="plain"
                            shape="circle"
                            size="sm"
                            icon={<HiOutlineTrash className="text-xl" />}
                            onClick={deleteAllReadNotification}
                        />
                    </Tooltip>
                </div>
            </Dropdown.Item>
            <div className={classNames('overflow-y-auto', notificationHeight)}>
                <ScrollBar direction={direction}>
                    {loading ? (
                        <div
                            className={classNames(
                                'flex items-center justify-center',
                                notificationHeight
                            )}
                        >
                            <Spinner size={40} />
                        </div>
                    ) : unreadNotifications?.length === 0 ? (
                        <div
                            className={classNames(
                                'flex items-center justify-center',
                                notificationHeight
                            )}
                        >
                            <div className="text-center">
                                <img
                                    className="mx-auto mb-2 max-w-[150px]"
                                    src="/img/others/no-notification.png"
                                    alt="no-notification"
                                />
                                <h6 className="font-semibold">
                                    Tidak Ada Notifikasi Baru
                                </h6>
                                <p className="mt-1">Semua sudah terbaca!</p>
                            </div>
                        </div>
                    ) : (
                        unreadNotifications?.map((item, index) => (
                            <div
                                key={item.id}
                                className={`relative flex px-4 py-4 active:bg-gray-100 dark:hover:bg-black dark:hover:bg-opacity-20 ${
                                    !isLastChild(unreadNotifications, index)
                                        ? 'border-b border-gray-200 dark:border-gray-600'
                                        : ''
                                }`}
                            >
                                <div>
                                    <Avatar
                                        shape="circle"
                                        className={`${
                                            item.type === 'timeline'
                                                ? 'bg-amber-100 text-amber-600'
                                                : item.type === 'adendum'
                                                ? 'bg-blue-100 text-blue-600'
                                                : item.type === 'faktur_pajak'
                                                ? 'bg-green-100 text-green-600'
                                                : item.type === 'project'
                                                ? 'bg-fuchsia-100 text-fuchsia-600'
                                                : ''
                                        } dark:bg-blue-500/20 dark:text-blue-100`}
                                        icon={<HiOutlineBell />}
                                    />
                                </div>
                                <div className="ltr:ml-3 rtl:mr-3">
                                    <div className="flex flex-col">
                                        {item.type && (
                                            <span className="font-semibold heading-text">
                                                {item.type
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    item.type
                                                        .slice(1)
                                                        .toLowerCase()}
                                            </span>
                                        )}
                                        <span>{item.pesan}</span>
                                    </div>
                                    <span className="text-xs">
                                        {formatWaktuNotifikasi(item.createdAt)}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </ScrollBar>
            </div>
            <Dropdown.Item variant="header">
                <div className="flex justify-center border-t border-gray-200 dark:border-gray-600 px-4 py-2">
                    <Link
                        to="/semua-notifikasi"
                        className="font-semibold cursor-pointer p-2 px-3 text-gray-600 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white"
                    >
                        Lihat Semua
                    </Link>
                </div>
            </Dropdown.Item>
        </Dropdown>
    )
}

const Notification = withHeaderItem(_Notification)

export default Notification
