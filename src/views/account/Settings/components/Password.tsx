import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { FormContainer } from '@/components/ui/Form'
import FormDesription from './FormDesription'
import FormRow from './FormRow'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import useAuth from '@/utils/hooks/useAuth'
import Dialog from '@/components/ui/Dialog'
import { apiUpdatePassword } from '@/services/UserService'
import { useNavigate } from 'react-router-dom'
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi'

type PasswordFormModel = {
    old_password: string
    new_password: string
    confirmNewPassword: string
}

const validationSchema = Yup.object().shape({
    old_password: Yup.string().required('Kata sandi saat ini wajib diisi'),
    new_password: Yup.string()
        .required('Kata sandi baru wajib diisi')
        .min(8, 'Kata sandi minimal 8 karakter'),
    confirmNewPassword: Yup.string()
        .oneOf([Yup.ref('new_password')], 'Kata sandi baru tidak cocok')
        .required('Konfirmasi kata sandi wajib diisi'),
})

const Password = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [dialogIsOpen, setDialogIsOpen] = useState(false)
    const [pwInputType, setPwInputType] = useState('password')

    const onPasswordVisibleClick = (e: MouseEvent) => {
        e.preventDefault()
        setPwInputType(pwInputType === 'password' ? 'text' : 'password')
    }

    const inputIcon = (
        <span
            className="cursor-pointer"
            onClick={(e) => onPasswordVisibleClick(e)}
        >
            {pwInputType === 'password' ? (
                <HiOutlineEyeOff />
            ) : (
                <HiOutlineEye />
            )}
        </span>
    )

    // Fungsi untuk membungkus konfirmasi dalam sebuah Promise
    const confirmUpdate = () => {
        return new Promise<boolean>((resolve) => {
            setDialogIsOpen(true)

            // Simpan fungsi resolve agar bisa dipanggil oleh tombol dialog
            window.confirmPasswordAction = (isConfirmed: boolean) => {
                setDialogIsOpen(false)
                resolve(isConfirmed)
            }
        })
    }

    // Seluruh logika sekarang terpusat di sini
    const handleUpdatePassword = async (
        values: PasswordFormModel,
        { setSubmitting, resetForm }: any
    ) => {
        // Buka dialog dan tunggu konfirmasi dari pengguna
        const isConfirmed = await confirmUpdate()

        // Jika pengguna menekan "Batal", hentikan proses
        if (!isConfirmed) {
            setSubmitting(false)
            return
        }

        // Jika dikonfirmasi, lanjutkan dengan pemanggilan API
        try {
            const dataToSubmit = {
                id: user.id,
                old_password: values.old_password,
                new_password: values.new_password,
            }
            const result: any = await apiUpdatePassword(dataToSubmit)

            if (result.data.statusCode === 200) {
                toast.push(
                    <Notification
                        title={'Kata sandi berhasil diperbarui'}
                        type="success"
                    />
                )
                resetForm() // Reset form setelah berhasil
            } else {
                toast.push(
                    <Notification title={'Gagal'} type="danger">
                        {result.data.message}
                    </Notification>
                )
            }
        } catch (error: any) {
            toast.push(
                <Notification title={'Gagal'} type="danger">
                    {error?.response?.data?.message || 'Terjadi kesalahan'}
                </Notification>
            )
        } finally {
            // Selalu hentikan loading Formik, apa pun hasilnya
            setSubmitting(false)
        }
    }

    return (
        <>
            <Formik
                initialValues={{
                    old_password: '',
                    new_password: '',
                    confirmNewPassword: '',
                }}
                validationSchema={validationSchema}
                onSubmit={handleUpdatePassword}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <FormDesription
                                title="Kata Sandi"
                                desc="Masukkan kata sandi saat ini & kata sandi baru Anda"
                            />
                            <FormRow
                                name="old_password"
                                label="Kata Sandi Saat Ini"
                                {...{ touched, errors }}
                            >
                                <Field
                                    autoComplete="off"
                                    name="old_password"
                                    component={Input}
                                    type={pwInputType}
                                    suffix={inputIcon}
                                    placeholder="Kata sandi lama"
                                />
                            </FormRow>
                            <FormRow
                                name="new_password"
                                label="Kata Sandi Baru"
                                {...{ touched, errors }}
                            >
                                <Field
                                    autoComplete="off"
                                    name="new_password"
                                    type={pwInputType}
                                    suffix={inputIcon}
                                    placeholder="Kata sandi baru"
                                    component={Input}
                                />
                            </FormRow>
                            <FormRow
                                name="confirmNewPassword"
                                label="Konfirmasi Kata Sandi Baru"
                                {...{ touched, errors }}
                            >
                                <Field
                                    type={pwInputType}
                                    suffix={inputIcon}
                                    autoComplete="off"
                                    placeholder="Konfirmasi kata sandi baru"
                                    name="confirmNewPassword"
                                    component={Input}
                                />
                            </FormRow>
                            <div className="mt-4 ltr:text-right space-x-2">
                                <Button
                                    type="button"
                                    onClick={() => navigate('/dashboard')}
                                >
                                    Batal
                                </Button>
                                <Button
                                    variant="solid"
                                    loading={isSubmitting}
                                    type="submit"
                                >
                                    Perbarui
                                </Button>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>

            {/* Dialog ini sekarang jauh lebih sederhana */}
            <Dialog
                isOpen={dialogIsOpen}
                onClose={() => window.confirmPasswordAction?.(false)}
                onRequestClose={() => window.confirmPasswordAction?.(false)}
            >
                <h5 className="mb-4">Ubah Kata Sandi</h5>
                <p>Apakah Anda yakin ingin memperbarui kata sandi?</p>
                <div className="text-right mt-6">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        onClick={() => window.confirmPasswordAction?.(false)}
                    >
                        Batal
                    </Button>
                    <Button
                        variant="solid"
                        color="amber-600"
                        onClick={() => window.confirmPasswordAction?.(true)}
                    >
                        Konfirmasi
                    </Button>
                </div>
            </Dialog>
        </>
    )
}

// Tambahkan tipe untuk window agar TypeScript tidak error
declare global {
    interface Window {
        confirmPasswordAction?: (isConfirmed: boolean) => void
    }
}

export default Password
