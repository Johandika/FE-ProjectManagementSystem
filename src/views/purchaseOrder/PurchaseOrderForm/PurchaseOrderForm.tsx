import { forwardRef, useState } from 'react'
import { FormContainer } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import hooks from '@/components/ui/hooks'
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
    nomor_po?: string
    nama?: string
    tanggal_po?: string
    pabrik?: string
    harga?: number
    status?: string
    estimasi_pengerjaan?: string
    idProject?: string
}

export type FormModel = Omit<InitialData, 'tags'> & {
    tags: { label: string; value: string }[] | string[]
}

export type SetSubmitting = (isSubmitting: boolean) => void

export type OnDeleteCallback = React.Dispatch<React.SetStateAction<boolean>>

type OnDelete = (callback: OnDeleteCallback) => void

type PurchaseOrderForm = {
    initialData?: InitialData
    type: 'edit' | 'new'
    onDiscard?: () => void
    onDelete?: OnDelete
    onFormSubmit: (formData: FormModel, setSubmitting: SetSubmitting) => void
}

const { useUniqueId } = hooks

const validationSchema = Yup.object().shape({
    nomor_po: Yup.string().required('Nomor wajib diisi'),
    nama: Yup.string().required('Nomor wajib diisi'),
    tanggal_po: Yup.string().required('Nomor wajib diisi'),
    harga: Yup.number().required('Nomor wajib diisi'),
    status: Yup.string().required('Status wajib diisi'),
    pabrik: Yup.string().required('Keterangan wajib diisi'),
    estimasi_pengerjaan: Yup.string().required('Estimasi wajib diisi'),
    idProject: Yup.string().required('Tanggal wajib diisi'),
})

const DeletePurchaseOrderButton = ({ onDelete }: { onDelete: OnDelete }) => {
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
                title="Hapus purchase order pajak"
                confirmButtonColor="red-600"
                onClose={onConfirmDialogClose}
                onRequestClose={onConfirmDialogClose}
                onCancel={onConfirmDialogClose}
                onConfirm={handleConfirm}
            >
                <p>
                    Apakah Anda yakin ingin menghapus purchase order pajak ini?
                </p>
            </ConfirmDialog>
        </>
    )
}

const PurchaseOrderForm = forwardRef<FormikRef, PurchaseOrderForm>(
    (props, ref) => {
        const {
            type,
            initialData = {
                id: '',
                nomor_po: '',
                nama: '',
                tanggal_po: '',
                harga: 0,
                status: '',
                pabrik: '',
                estimasi_pengerjaan: '',
                idProject: '',
            },
            onFormSubmit,
            onDiscard,
            onDelete,
        } = props

        const newId = useUniqueId('purchaseOrder-')

        return (
            <>
                <Formik
                    innerRef={ref}
                    initialValues={{
                        ...initialData,
                        // tags: initialData?.tags
                        //     ? initialData.tags.map((value) => ({
                        //           label: value,
                        //           value,
                        //       }))
                        //     : [],
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values: FormModel, { setSubmitting }) => {
                        const formData = cloneDeep(values)
                        // formData.tags = formData.tags.map((tag) => {
                        //     if (typeof tag !== 'string') {
                        //         return tag.value
                        //     }
                        //     return tag
                        // })
                        if (type === 'new') {
                            formData.id = newId
                        }
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
                                        />
                                    </div>
                                </div>
                                <StickyFooter
                                    className="-mx-8 px-8 flex items-center justify-between py-4"
                                    stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                >
                                    <div>
                                        {type === 'edit' && (
                                            <DeletePurchaseOrderButton
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
    }
)

PurchaseOrderForm.displayName = 'PurchaseOrderForm'

export default PurchaseOrderForm
