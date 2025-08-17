import { forwardRef, useState } from 'react'
import { FormContainer } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import StickyFooter from '@/components/shared/StickyFooter'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { Form, Formik, FormikProps } from 'formik'
import BasicInformationFields from './BasicInformationFields'
import cloneDeep from 'lodash/cloneDeep'
import { HiOutlineTrash } from 'react-icons/hi'
import { AiOutlineSave } from 'react-icons/ai'
import * as Yup from 'yup'

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
type FormikRef = FormikProps<any>

type InitialData = {
    id?: string
    nama: string
    email: string
    nomor_telepon: string
    status_aktif: boolean
    password: string
    idRole: string
    idDivisi: string
    DivisiUsers?: any[]
}

export type FormModel = InitialData

export type SetSubmitting = (isSubmitting: boolean) => void

export type OnDeleteCallback = React.Dispatch<React.SetStateAction<boolean>>

type OnDelete = (callback: OnDeleteCallback) => void

type PenggunaForm = {
    initialData?: InitialData
    roleData?: any[]
    divisiData?: any[]
    type: 'edit' | 'new'
    onDiscard?: () => void
    onDelete?: OnDelete
    onFormSubmit: (formData: FormModel, setSubmitting: SetSubmitting) => void
}

const validationSchema = Yup.object().shape({
    nama: Yup.string().required('Nama wajib diisi'),
    email: Yup.string()
        .email('Email tidak valid')
        .required('Email wajib diisi'),
    nomor_telepon: Yup.string().required('Nomor telepon wajib diisi'),
})

const DeletePenggunaButton = ({ onDelete }: { onDelete: OnDelete }) => {
    const [dialogOpen, setDialogOpen] = useState(false)

    const onConfirmDialogOpen = () => {
        setDialogOpen(true)
    }

    const onConfirmDialogClose = () => {
        setDialogOpen(false)
    }

    const handleConfirm = () => {
        onDelete?.(setDialogOpen)
    }

    return (
        <>
            <Button
                className="text-red-600"
                variant="plain"
                size="sm"
                icon={<HiOutlineTrash />}
                type="button"
                onClick={onConfirmDialogOpen}
            >
                Hapus
            </Button>
            <ConfirmDialog
                isOpen={dialogOpen}
                type="danger"
                title="Hapus pengguna"
                confirmButtonColor="red-600"
                onClose={onConfirmDialogClose}
                onRequestClose={onConfirmDialogClose}
                onCancel={onConfirmDialogClose}
                onConfirm={handleConfirm}
            >
                <p>Apakah Anda yakin ingin menghapus pengguna ini?</p>
            </ConfirmDialog>
        </>
    )
}

const PenggunaForm = forwardRef<FormikRef, PenggunaForm>((props, ref) => {
    const {
        type,
        initialData,
        onFormSubmit,
        onDiscard,
        onDelete,
        roleData,
        divisiData,
    } = props

    // Proses data DivisiUsers dari API menjadi string yang dipisah koma
    const formattedDivisiIds =
        initialData?.DivisiUsers?.map(
            (divisiUser: any) => divisiUser.idDivisi
        ).join(',') || ''

    const formInitialValues = {
        id: '',
        nama: '',
        email: '',
        nomor_telepon: '',
        idRole: '',
        idDivisi: '',
        password: '',
        ...initialData,
        idDivisi: formattedDivisiIds, // <-- Pastikan ini menimpa idDivisi
    }

    return (
        <>
            <Formik
                innerRef={ref}
                initialValues={formInitialValues}
                validationSchema={validationSchema}
                onSubmit={(values: FormModel, { setSubmitting }) => {
                    const formData = cloneDeep(values)

                    onFormSubmit?.(formData, setSubmitting)
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div className="lg:col-span-2">
                                    <BasicInformationFields
                                        touched={touched}
                                        errors={errors}
                                        type={type}
                                        roleData={roleData}
                                        divisiData={divisiData}
                                    />
                                </div>
                            </div>
                            <StickyFooter
                                className="-mx-8 px-8 flex items-center justify-between py-4"
                                stickyClass="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                            >
                                <div>
                                    {type === 'edit' && (
                                        <DeletePenggunaButton
                                            onDelete={onDelete as OnDelete}
                                        />
                                    )}
                                </div>
                                <div className="md:flex items-center">
                                    <Button
                                        size="sm"
                                        className="ltr:mr-3 rtl:ml-3"
                                        type="button"
                                        onClick={() => onDiscard?.()}
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="solid"
                                        loading={isSubmitting}
                                        icon={<AiOutlineSave />}
                                        type="submit"
                                    >
                                        Simpan
                                    </Button>
                                </div>
                            </StickyFooter>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </>
    )
})

PenggunaForm.displayName = 'PenggunaForm'

export default PenggunaForm
