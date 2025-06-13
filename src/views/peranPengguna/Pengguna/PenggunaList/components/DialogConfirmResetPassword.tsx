import {
    Button,
    Dialog,
    FormItem,
    Input,
    Notification,
    toast,
} from '@/components/ui'
import { Field, Form, Formik } from 'formik'
import { useState } from 'react'
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi'
import * as Yup from 'yup'
import {
    useAppDispatch,
    useAppSelector,
    setDialogUpdatePassword,
    getPenggunas,
    setDialogResetPassword,
} from '../store'
import { apiUpdatePassword } from '@/services/UserService'
import { useNavigate } from 'react-router-dom'
import { ConfirmDialog } from '@/components/shared'
import { apiResetPassword } from '@/services/AuthService'

const BastpSchema = Yup.object().shape({
    old_password: Yup.string().required('Tanggal wajib diisi'),
})

interface BastpFormValues {
    old_password: string | null
    new_password: string | null
    id?: string | null
}

export default function DialogConfirmResetPassword() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const cancelStatusChange = () => {
        dispatch(setDialogResetPassword(false))
    }

    const penggunaDialogIsOpen = useAppSelector(
        (state) => state.penggunaList.data.dialogResetPassword
    )

    const idUserActive = useAppSelector(
        (state) => state.penggunaList.data.idUserActive
    )

    const popNotification = (keyword: string) => {
        toast.push(
            <Notification
                title={`Successfuly ${keyword}`}
                type="success"
                duration={2500}
            >
                Berhasil melakukan {keyword}
            </Notification>,
            {
                placement: 'top-center',
            }
        )
        navigate('/peran-dan-pengguna/pengguna')
    }

    const confirmStatusChange = async () => {
        try {
            const data = {
                id: idUserActive,
            }
            const result = await apiResetPassword(data)

            if (result.data.statusCode === 200) {
                dispatch(setDialogResetPassword(false))
                popNotification('reset password')
                dispatch(getPenggunas())
            } else {
                toast.push(
                    <Notification
                        title="Update Status Failed"
                        type="danger"
                        duration={2500}
                    >
                        {result.data.statusCode.message}
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
            }
        } catch (error) {
            console.error('Error updating status faktur:', error)
            toast.push(
                <Notification
                    title="Update Status Failed"
                    type="danger"
                    duration={2500}
                >
                    Gagal memperbarui status faktur
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        }
    }

    return (
        <ConfirmDialog
            isOpen={penggunaDialogIsOpen}
            onClose={cancelStatusChange}
            onRequestClose={cancelStatusChange}
            onCancel={cancelStatusChange}
            type="warning"
            title="Reset Password"
            onConfirm={confirmStatusChange}
        >
            <p>Apakah kamu yakin ingin mereset password ?</p>
        </ConfirmDialog>
    )
}
