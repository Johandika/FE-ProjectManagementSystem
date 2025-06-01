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
} from '../store'
import { apiUpdatePassword } from '@/services/UserService'
import { useNavigate } from 'react-router-dom'

const BastpSchema = Yup.object().shape({
    old_password: Yup.string().required('Tanggal wajib diisi'),
})

interface BastpFormValues {
    old_password: string | null
    new_password: string | null
    id?: string | null
}

export default function DialogUpdatePassword() {
    const dispatch = useAppDispatch()
    const [pwInputType, setPwInputType] = useState('password')
    const navigate = useNavigate()
    const [bastpFormInitialValues, setBastpFormInitialValues] =
        useState<BastpFormValues>({
            old_password: '',
            new_password: '',
            id: '',
        })

    const penggunaDialogIsOpen = useAppSelector(
        (state) => state.penggunaList.data.dialogUpdatePassword
    )

    const idUserActive = useAppSelector(
        (state) => state.penggunaList.data.idUserActive
    )

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

    const popNotification = (keyword: string) => {
        toast.push(
            <Notification
                title={`Successfuly ${keyword}`}
                type="success"
                duration={2500}
            >
                Product successfuly {keyword}
            </Notification>,
            {
                placement: 'top-center',
            }
        )
        navigate('/peran-dan-pengguna/pengguna')
    }

    const onBastpDialogClose = () => {
        dispatch(setDialogUpdatePassword(false))
    }

    const handleBastpSubmit = async (
        values: BastpFormValues,
        { setSubmitting }: { setSubmitting: SetSubmitting }
    ) => {
        setSubmitting(true)

        const processedData = {
            ...values,
            id: idUserActive || '',
        }

        let success = false
        try {
            success = await apiUpdatePassword(processedData)
            if (success) {
                dispatch(setDialogUpdatePassword(false))
                dispatch(getPenggunas())
                popNotification('diperbarui')
            }
        } catch (error) {
            toast.push(
                <Notification
                    title="Update Password Failed"
                    type="danger"
                    duration={2500}
                >
                    {error.response.data.message}
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        } finally {
            setSubmitting(false)
            // dispatch(setDialogUpdatePassword(false))
        }
    }

    return (
        <Formik
            initialValues={bastpFormInitialValues}
            validationSchema={BastpSchema}
            onSubmit={handleBastpSubmit}
            enableReinitialize={true}
        >
            {({ errors, touched, isSubmitting, values, setFieldValue }) => (
                <>
                    <Dialog
                        isOpen={penggunaDialogIsOpen}
                        onClose={onBastpDialogClose}
                        onRequestClose={onBastpDialogClose}
                    >
                        <Form>
                            <h5 className="mb-4">{'Ubah Password'}</h5>

                            {/* Pass Lama */}
                            <FormItem
                                label="Password Lama"
                                invalid={
                                    (errors.old_password &&
                                        touched.old_password) as boolean
                                }
                                errorMessage={errors.old_password}
                            >
                                <Field
                                    autoComplete="off"
                                    name="old_password"
                                    suffix={inputIcon}
                                    type={pwInputType}
                                    placeholder="password"
                                    component={Input}
                                />
                            </FormItem>

                            {/* Pass Baru */}
                            <FormItem
                                label="Password Baru"
                                invalid={
                                    (errors.new_password &&
                                        touched.new_password) as boolean
                                }
                                errorMessage={errors.new_password}
                            >
                                <Field
                                    autoComplete="off"
                                    name="new_password"
                                    suffix={inputIcon}
                                    type={pwInputType}
                                    placeholder="password"
                                    component={Input}
                                />
                            </FormItem>

                            {/* Button Dialog Option */}
                            <div className="text-right mt-6">
                                <Button
                                    className="ltr:mr-2 rtl:ml-2"
                                    variant="plain"
                                    onClick={onBastpDialogClose}
                                    type="button"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="solid"
                                    type="submit"
                                    loading={isSubmitting}
                                >
                                    Simpan
                                </Button>
                            </div>
                        </Form>
                    </Dialog>
                </>
            )}
        </Formik>
    )
}
