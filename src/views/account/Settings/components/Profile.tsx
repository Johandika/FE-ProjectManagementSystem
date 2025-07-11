import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import toast from '@/components/ui/toast'
import { FormContainer } from '@/components/ui/Form'
import FormDesription from './FormDesription'
import FormRow from './FormRow'
import { Field, Form, Formik } from 'formik'
import { HiOutlineUserCircle, HiOutlineMail } from 'react-icons/hi'
import * as Yup from 'yup'
import { BiPhone } from 'react-icons/bi'
import { apiUpdateUser } from '@/services/UserService'
import useAuth from '@/utils/hooks/useAuth'
import { Notification } from '@/components/ui'
import { injectReducer, setUser, useAppDispatch } from '@/store'
import reducer, {
    getOnePengguna,
    useAppSelector,
} from '@/views/peranPengguna/Pengguna/PenggunaEdit/store'
import { useEffect } from 'react'
import { Loading } from '@/components/shared'
import { useNavigate } from 'react-router-dom'

injectReducer('penggunaEdit', reducer)

export type ProfileFormModel = {
    nama: string
    email: string
    nomor_telepon: string
}

const validationSchema = Yup.object().shape({
    nama: Yup.string().required('Nama wajib diisi'),
    email: Yup.string()
        .email('Email tidak valid')
        .required('Email wajib diisi'),
    nomor_telepon: Yup.string().required('Nomor telepon wajib diisi'),
})

const Profile = () => {
    const { user } = useAuth()
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    // MODIFIKASI: Ambil data & status loading dari slice 'penggunaEdit'
    const { onePenggunaData, loadingOnePengguna } = useAppSelector(
        (state) => state.penggunaEdit.data
    )

    const fetchData = () => {
        if (user?.id) {
            dispatch(getOnePengguna({ id: user.id }))
        }
    }

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id])

    const onFormSubmit = async (
        values: ProfileFormModel,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setSubmitting(true)

        const proceedData = { ...values, id: user.id }

        try {
            const result: any = await apiUpdateUser(proceedData)

            if (result.data.statusCode === 200) {
                toast.push(
                    <Notification
                        title={'Berhasil Mengupdate'}
                        type="success"
                        duration={3500}
                    >
                        {result.data.message}
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )

                dispatch(
                    setUser({
                        id: proceedData.id || '',
                        username: proceedData.nama || '',
                        email: proceedData.email || '',
                    })
                )
                dispatch(getOnePengguna({ id: user.id }))
            } else {
                // Menampilkan notifikasi error
                toast.push(
                    <Notification
                        title={'Gagal Menambahkan'}
                        type="danger"
                        duration={3500}
                    >
                        {result.data.message}
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
            }
        } catch (error) {
            // Menampilkan notifikasi error
            toast.push(
                <Notification
                    title={'Gagal Menambahkan'}
                    type="danger"
                    duration={3500}
                >
                    {result?.data.message}
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Loading loading={loadingOnePengguna}>
            <Formik
                enableReinitialize
                initialValues={
                    onePenggunaData || {
                        nama: '',
                        email: '',
                        nomor_telepon: '',
                    }
                }
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    setSubmitting(true)
                    setTimeout(() => {
                        onFormSubmit(values, setSubmitting)
                    }, 1000)
                }}
            >
                {({ values, touched, errors, isSubmitting }) => {
                    const validatorProps = { touched, errors }
                    return (
                        <Form>
                            <FormContainer>
                                <FormDesription
                                    title="Info Dasar"
                                    desc="Informasi dasar, seperti nama, email, dan nomor telepon"
                                />
                                <FormRow
                                    name="nama"
                                    label="Nama"
                                    {...validatorProps}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="nama"
                                        placeholder="Nama"
                                        component={Input}
                                        prefix={
                                            <HiOutlineUserCircle className="text-xl" />
                                        }
                                    />
                                </FormRow>
                                <FormRow
                                    name="email"
                                    label="Email"
                                    {...validatorProps}
                                >
                                    <Field
                                        type="email"
                                        autoComplete="off"
                                        name="email"
                                        placeholder="Email"
                                        component={Input}
                                        prefix={
                                            <HiOutlineMail className="text-xl" />
                                        }
                                    />
                                </FormRow>

                                <FormRow
                                    name="nomor_telepon"
                                    label="Nomor Telepon"
                                    {...validatorProps}
                                    border={false}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="nomor_telepon"
                                        placeholder="08xxxxxxxxxx"
                                        component={Input}
                                        prefix={<BiPhone className="text-xl" />}
                                    />
                                </FormRow>

                                <div className="mt-4 ltr:text-right">
                                    <Button
                                        className="ltr:mr-2 rtl:ml-2"
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
                                        {isSubmitting
                                            ? 'Proses...'
                                            : 'Perbarui'}
                                    </Button>
                                </div>
                            </FormContainer>
                        </Form>
                    )
                }}
            </Formik>
        </Loading>
    )
}

export default Profile
