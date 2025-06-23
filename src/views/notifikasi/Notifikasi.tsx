import { AdaptableCard, ConfirmDialog, Container } from '@/components/shared'
import React, { useState } from 'react'
import AllNotification from './components/AllNotification'
import { injectReducer, useAppDispatch } from '@/store'
import reducer, { getAllNotification } from './store'
import { Button, Notification, toast } from '@/components/ui'
import { HiOutlineTrash } from 'react-icons/hi'
import { apiDeleteAllReadNotification } from '@/services/NotificationService'

injectReducer('notification', reducer)

export default function Notifikasi() {
    const dispatch = useAppDispatch()
    const [statusChangeDialogOpen, setStatusChangeDialogOpen] = useState(false)

    const cancelStatusChange = () => {
        setStatusChangeDialogOpen(false)
    }

    const confirmStatusChange = async () => {
        setStatusChangeDialogOpen(false)

        try {
            const result = await apiDeleteAllReadNotification()
            if (
                result &&
                result.data.statusCode >= 200 &&
                result.data.statusCode < 300
            ) {
                toast.push(
                    <Notification
                        title="Berhasil Hapus Notifikasi"
                        type="success"
                        duration={2500}
                    >
                        Semua notifikasi yang sudah dibaca berhasil dihapus
                    </Notification>,
                    { placement: 'top-center' }
                )
                dispatch(getAllNotification())
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

    return (
        <Container>
            <AdaptableCard>
                <div className="grid lg:grid-cols-5 gap-8">
                    <div className="col-span-4">
                        <div className="flex flex-row justify-between">
                            <h3 className="mb-6">Semua Notifikasi</h3>
                            <Button
                                variant="solid"
                                size="sm"
                                className="text-xs flex justify-center items-center"
                                color="red"
                                onClick={() => setStatusChangeDialogOpen(true)}
                            >
                                <HiOutlineTrash className="inline-block mr-2" />
                                Bersihkan Notifikasi
                            </Button>
                        </div>

                        <AllNotification />
                        <ConfirmDialog
                            isOpen={statusChangeDialogOpen}
                            onClose={cancelStatusChange}
                            onRequestClose={cancelStatusChange}
                            onCancel={cancelStatusChange}
                            type="warning"
                            title="Ubah Status"
                            onConfirm={confirmStatusChange}
                        >
                            <p>
                                Apakah kamu yakin ingin menghapus semua
                                notifikasi yang sudah dibaca ?
                            </p>
                        </ConfirmDialog>
                    </div>
                </div>
            </AdaptableCard>
        </Container>
    )
}
