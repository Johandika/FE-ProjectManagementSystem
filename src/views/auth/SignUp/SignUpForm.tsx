import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import PasswordInput from '@/components/shared/PasswordInput'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import type { CommonProps } from '@/@types/common'
import { apiRegister } from '@/services/AuthService'

interface SignUpFormProps extends CommonProps {
    disableSubmit?: boolean
    signInUrl?: string
}

type SignUpFormSchema = {
    nama: string
    password: string
    email: string
    nomor_telepon: number
}

const validationSchema = Yup.object().shape({
    nama: Yup.string().required('Nama tidak boleh kosong'),
    email: Yup.string()
        .email('Email tidak valid')
        .required('Email tidak boleh kosong'),
    password: Yup.string().required('Password tidak boleh kosong'),
    confirmPassword: Yup.string().oneOf(
        [Yup.ref('password')],
        'Password tidak cocok'
    ),
})

const SignUpForm = (props: SignUpFormProps) => {
    const { disableSubmit = false, className, signInUrl = '/sign-in' } = props

    const [message, setMessage] = useTimeOutMessage()

    const onSignUp = async (
        values: SignUpFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {

        const { nama, password, email, nomor_telepon } = values
        setSubmitting(true)

        const result = await apiRegister({
            nama,
            password,
            email,
            nomor_telepon,
        })

        if (result?.status === 'failed') {
            setMessage(result.message)
        }

        setSubmitting(false)
    }

    return (
        <div className={className}>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    {message}
                </Alert>
            )}
            <Formik
                initialValues={{
                    nama: '',
                    password: '',
                    confirmPassword: '',
                    email: '',
                    nomor_telepon: '' as unknown as number,
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (!disableSubmit) {
                        onSignUp(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <FormItem
                                label="Nama"
                                invalid={errors.nama && touched.nama}
                                errorMessage={errors.nama}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="nama"
                                    placeholder="Nama Lengkap"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="Email"
                                invalid={errors.email && touched.email}
                                errorMessage={errors.email}
                            >
                                <Field
                                    type="email"
                                    autoComplete="off"
                                    name="email"
                                    placeholder="Email"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="Nomor Telepon"
                                invalid={
                                    errors.nomor_telepon &&
                                    touched.nomor_telepon
                                }
                                errorMessage={errors.nomor_telepon}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="nomor_telepon"
                                    placeholder="Nomor Telepon"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="Password"
                                invalid={errors.password && touched.password}
                                errorMessage={errors.password}
                            >
                                <Field
                                    autoComplete="off"
                                    name="password"
                                    placeholder="Password"
                                    component={PasswordInput}
                                />
                            </FormItem>
                            <FormItem
                                label="Konfirmasi Password"
                                invalid={
                                    errors.confirmPassword &&
                                    touched.confirmPassword
                                }
                                errorMessage={errors.confirmPassword}
                            >
                                <Field
                                    autoComplete="off"
                                    name="confirmPassword"
                                    placeholder="Konfirmasi Password"
                                    component={PasswordInput}
                                />
                            </FormItem>
                            <Button
                                block
                                loading={isSubmitting}
                                variant="solid"
                                type="submit"
                            >
                                {isSubmitting ? 'Membuat Akun...' : 'Daftar'}
                            </Button>
                            <div className="mt-4 text-center">
                                <span>Sudah punya akun? </span>
                                <ActionLink to={signInUrl}>Masuk</ActionLink>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default SignUpForm
