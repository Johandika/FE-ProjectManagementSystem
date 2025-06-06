import React, { useState, useEffect } from 'react'
import { HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi'
import { LuFilePlus2 } from 'react-icons/lu'
import classNames from 'classnames'
import isLastChild from '@/utils/isLastChild'
import DescriptionSection from './DesriptionSection'
import reducer, {
    getBastpsByProyek,
    getTermins,
    useAppDispatch,
    useAppSelector,
} from '../store'
import { injectReducer } from '@/store'
import { Field, FieldProps, Form, Formik } from 'formik'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import AdaptableCard from '@/components/shared/AdaptableCard'
import { ConfirmDialog, Loading } from '@/components/shared'
import * as Yup from 'yup'
import { Dialog, Notification, toast } from '@/components/ui'
import DatePicker from '@/components/ui/DatePicker'
import {
    apiCreateBastp,
    apiDeleteBastp,
    apiEditBastp,
    apiUpdateTanggalPembayaranBastp,
} from '@/services/BastpService'
import dayjs from 'dayjs'
import { IoIosAdd } from 'react-icons/io'

type Bastp = {
    id: string
    tanggal: string
    idProject: string
    createdAt: string
    updatedAt: string
    tanggal_pembayaran?: string
}

// Form values type
type FormValues = {
    tempTanggal: Date | null
    tempIdProject: string
}

export interface SetSubmitting {
    (isSubmitting: boolean): void
}
interface BastpFormValues {
    tanggal_pembayaran: string | null
}

// Validation schema for the form fields
const validationSchema = Yup.object().shape({
    tempTanggal: Yup.date()
        .required('Tanggal harus diisi')
        .typeError('Format tanggal tidak valid'),
})

// Schema validasi untuk form termin
const BastpSchema = Yup.object().shape({
    tanggal_pembayaran: Yup.string().required('Tanggal wajib diisi'),
})

injectReducer('proyekDetail', reducer)

export default function Bastp() {
    const [showForm, setShowForm] = useState(false)
    const [editIndex, setEditIndex] = useState<number | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
    const [selectedBastpToEdit, setSelectedBastpToEdit] = useState<any>(null)
    const [bastpDialogIsOpen, setBastpDialogIsOpen] = useState(false)
    const [idTermin, setIdTermin] = useState('')
    const [isEditBastpMode, setIsEditBastpMode] = useState(false)
    const [bastpFormInitialValues, setBastpFormInitialValues] =
        useState<BastpFormValues>({
            tanggal_pembayaran: null,
        })

    const dispatch = useAppDispatch()
    const projectId = location.pathname.substring(
        location.pathname.lastIndexOf('/') + 1
    )

    const terminsData = useAppSelector(
        (state) => state.proyekDetail.data.terminsData
    )

    const loadingTermins = useAppSelector(
        (state) => state.proyekDetail.data.loadingTermins
    )

    const getProjectId = () => {
        return location.pathname.substring(
            location.pathname.lastIndexOf('/') + 1
        )
    }

    const handleBastpSubmit = async (
        values: BastpFormValues,
        { setSubmitting }: { setSubmitting: SetSubmitting }
    ) => {
        setSubmitting(true)
        const projectId = getProjectId()

        const processedData = {
            ...values,
            id: idTermin || '',
        }

        let success = false

        try {
            if (isEditBastpMode && selectedBastpToEdit) {
                // Update existing termin
                const updateData = {
                    ...processedData,
                    id: selectedBastpToEdit.id,
                }

                success = await apiUpdateTanggalPembayaranBastp(updateData)

                if (success) {
                    dispatch(getTermins({ id: projectId }))
                    popNotification('diperbarui')
                }
            } else {
                // Create new termin

                success = await apiUpdateTanggalPembayaranBastp(processedData)
                if (success) {
                    dispatch(getTermins({ id: projectId }))
                    popNotification('ditambahkan')
                }
            }
        } catch (error) {
            console.error(
                `Error ${isEditBastpMode ? 'updating' : 'creating'} termin:`,
                error
            )
            toast.push(
                <Notification
                    title={`${isEditBastpMode ? 'Update' : 'Create'} Failed`}
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
            setBastpDialogIsOpen(false)
        }
    }

    const onBastpDialogClose = () => {
        setBastpDialogIsOpen(false)
        setIsEditBastpMode(false)
        setSelectedBastpToEdit(null)
    }

    // Fetch BASTs when component mounts
    useEffect(() => {
        const requestParam = { id: projectId }
        dispatch(getTermins(requestParam))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, projectId])

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })
    }

    // Initialize form values
    const initialValues: FormValues = {
        tempTanggal: null,
        tempIdProject: projectId || '',
    }

    // Success notification helper
    const popNotification = (keyword: string) => {
        toast.push(
            <Notification
                title={`Berhasil ${keyword}`}
                type="success"
                duration={2500}
            >
                Data BASTP berhasil {keyword}
            </Notification>,
            {
                placement: 'top-center',
            }
        )
    }

    return (
        <Loading loading={loadingTermins || isSubmitting}>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={() => {
                    // Form submission is handled by save button
                }}
            >
                {(formikProps) => {
                    const { values, errors, touched, setFieldValue } =
                        formikProps

                    const openBastpDialog = (
                        data: any = null,
                        isEdit = false
                    ) => {
                        setIsEditBastpMode(isEdit)
                        setSelectedBastpToEdit(data)

                        if (isEdit && data) {
                            setBastpFormInitialValues({
                                tanggal_pembayaran:
                                    data.tanggal_pembayaran || null,
                            })
                        } else {
                            // For new termin
                            setBastpFormInitialValues({
                                tanggal_pembayaran: null,
                            })
                        }

                        setBastpDialogIsOpen(true)
                    }

                    const handleSave = async () => {
                        // Validate fields
                        if (!errors.tempTanggal) {
                            setIsSubmitting(true)

                            const requestData = {
                                tanggal: values.tempTanggal?.toISOString(),
                                idProject: values.tempIdProject,
                            }

                            try {
                                let result

                                if (editIndex !== null && terminsData) {
                                    // Handle edit with API call
                                    const bastpId = terminsData[editIndex].id
                                    result = await apiEditBastp({
                                        id: bastpId,
                                        ...requestData,
                                    })
                                } else {
                                    // Handle create with API call
                                    result = await apiCreateBastp(requestData)
                                }

                                if (
                                    result &&
                                    result.data?.statusCode >= 200 &&
                                    result.data?.statusCode < 300
                                ) {
                                    dispatch(getTermins({ id: projectId }))
                                    // Show success notification
                                    popNotification(
                                        editIndex !== null
                                            ? 'diperbarui'
                                            : 'ditambahkan'
                                    )

                                    // Reset form and close
                                    resetFormFields()
                                    setShowForm(false)
                                    setEditIndex(null)
                                } else {
                                    // Show error notification
                                    toast.push(
                                        <Notification
                                            title="Error"
                                            type="danger"
                                            duration={2500}
                                        >
                                            {result
                                                ? result?.message
                                                : 'Gagal menambahkan BASTP'}
                                        </Notification>,
                                        { placement: 'top-center' }
                                    )
                                }
                            } catch (error) {
                                console.error('Error:', error)

                                // Show generic error notification
                                toast.push(
                                    <Notification
                                        title="Error"
                                        type="danger"
                                        duration={2500}
                                    >
                                        {error
                                            ? error.response.data?.message
                                            : 'Gagal menambahkan BASTP'}
                                    </Notification>,
                                    { placement: 'top-center' }
                                )
                            } finally {
                                setIsSubmitting(false)
                            }
                        }
                    }

                    // Helper function to reset form fields
                    const resetFormFields = () => {
                        setFieldValue('tempTanggal', null)
                    }

                    const handleCancel = () => {
                        setShowForm(false)
                        setEditIndex(null)
                        resetFormFields()
                    }

                    const handleEdit = (index: number) => {
                        if (terminsData) {
                            const bastp = terminsData[index]

                            // Set temporary values for editing
                            setFieldValue(
                                'tempTanggal',
                                new Date(bastp.tanggal)
                            )
                            setFieldValue('tempIdProject', bastp.idProject)

                            setEditIndex(index)
                            setShowForm(true)
                        }
                    }

                    // Function to open confirmation dialog
                    const handleConfirmDelete = (index: number) => {
                        setDeleteIndex(index)
                        setDialogOpen(true)
                    }

                    // Function to close confirmation dialog
                    const handleCancelDelete = () => {
                        setDialogOpen(false)
                        setDeleteIndex(null)
                    }

                    const handleDelete = async () => {
                        if (deleteIndex !== null && terminsData) {
                            const bastpId = terminsData[deleteIndex].id

                            setIsSubmitting(true)
                            try {
                                // Call delete API with BASTP ID
                                const success = await apiDeleteBastp({
                                    id: bastpId,
                                })

                                if (success) {
                                    // Refresh data aft'er successful delete

                                    dispatch(getTermins({ id: projectId }))

                                    popNotification('dihapus')
                                }
                            } catch (error) {
                                console.error('Error deleting BASTP:', error)

                                // Show error notification
                                toast.push(
                                    <Notification
                                        title="Error"
                                        type="danger"
                                        duration={2500}
                                    >
                                        {error.response.data?.message ||
                                            'Gagal menghapus BASTP'}
                                    </Notification>,
                                    { placement: 'top-center' }
                                )
                            } finally {
                                setIsSubmitting(false)
                                setDialogOpen(false)
                                setDeleteIndex(null)
                            }
                        }
                    }

                    return (
                        <Form>
                            <AdaptableCard divider>
                                <div className="flex justify-between items-center mb-4">
                                    <DescriptionSection
                                        title="Informasi BASTP"
                                        desc="Informasi Berita Acara Serah Terima Pekerjaan"
                                    />
                                </div>

                                {/* Form untuk input BASTP */}
                                {showForm && (
                                    <div className="mb-4 border bg-slate-50 rounded-md p-4">
                                        <h6 className="mb-3">
                                            {editIndex !== null
                                                ? 'Edit <BASTP></BASTP>'
                                                : 'Tambah BASTP Baru'}
                                        </h6>

                                        <FormContainer>
                                            <div className="grid grid-cols-2 gap-4">
                                                {/* Tanggal */}
                                                <FormItem
                                                    label="Tanggal"
                                                    errorMessage={
                                                        errors.tempTanggal &&
                                                        touched.tempTanggal
                                                            ? errors.tempTanggal
                                                            : ''
                                                    }
                                                    invalid={
                                                        !!(
                                                            errors.tempTanggal &&
                                                            touched.tempTanggal
                                                        )
                                                    }
                                                >
                                                    <DatePicker
                                                        placeholder="Pilih tanggal"
                                                        value={
                                                            values.tempTanggal
                                                        }
                                                        inputFormat="DD-MM-YYYY"
                                                        onChange={(date) => {
                                                            setFieldValue(
                                                                'tempTanggal',
                                                                date
                                                            )
                                                        }}
                                                    />
                                                </FormItem>
                                            </div>

                                            <div className="flex justify-end space-x-2 mt-4">
                                                <Button
                                                    size="sm"
                                                    variant="plain"
                                                    onClick={handleCancel}
                                                    type="button"
                                                >
                                                    Batal
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="solid"
                                                    onClick={handleSave}
                                                    type="button"
                                                    loading={isSubmitting}
                                                >
                                                    Simpan
                                                </Button>
                                            </div>
                                        </FormContainer>
                                    </div>
                                )}

                                {/* Daftar BASTP */}
                                {terminsData && terminsData.length > 0 ? (
                                    <div className="rounded-lg border border-gray-200 dark:border-gray-600">
                                        {terminsData.map(
                                            (data: any, index: number) => {
                                                // If currently editing this item, don't show it in the list
                                                if (editIndex === index) {
                                                    return null
                                                }

                                                return (
                                                    <div
                                                        key={data.id}
                                                        className={classNames(
                                                            'flex items-center justify-between px-4 py-6',
                                                            !isLastChild(
                                                                terminsData,
                                                                index
                                                            ) &&
                                                                'border-b border-gray-200 dark:border-gray-600'
                                                        )}
                                                    >
                                                        <div className="flex items-center flex-grow">
                                                            <div className="text-3xl">
                                                                <LuFilePlus2 className="text-indigo-500" />
                                                            </div>
                                                            <div className="ml-3 rtl:mr-3 space-y-1">
                                                                <div className="flex items-center">
                                                                    <div className="text-gray-900 dark:text-gray-100 font-semibold">
                                                                        BASTP{' '}
                                                                        {index +
                                                                            1}
                                                                    </div>
                                                                </div>
                                                                {data.tanggal_pembayaran !==
                                                                null ? (
                                                                    <div className="text-gray-500 text-sm mt-1">
                                                                        <div>
                                                                            Tanggal:{' '}
                                                                            {formatDate(
                                                                                data.tanggal_pembayaran
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    !showForm && (
                                                                        <Button
                                                                            size="sm"
                                                                            variant="twoTone"
                                                                            shape="circle"
                                                                            className="w-fit text-xs"
                                                                            type="button"
                                                                            icon={
                                                                                <IoIosAdd />
                                                                            }
                                                                            onClick={() => {
                                                                                setIdTermin(
                                                                                    data.id
                                                                                )
                                                                                openBastpDialog(
                                                                                    data
                                                                                )
                                                                            }}
                                                                        >
                                                                            Tambah
                                                                            BASTP
                                                                        </Button>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center space-x-2">
                                                            <Button
                                                                type="button"
                                                                shape="circle"
                                                                variant="plain"
                                                                size="sm"
                                                                icon={
                                                                    <HiOutlinePencil />
                                                                }
                                                                className="text-indigo-500"
                                                                onClick={() =>
                                                                    // handleEdit(
                                                                    //     index
                                                                    // )
                                                                    openBastpDialog(
                                                                        data,
                                                                        true
                                                                    )
                                                                }
                                                            />
                                                            <Button
                                                                type="button"
                                                                shape="circle"
                                                                variant="plain"
                                                                size="sm"
                                                                className="text-red-500"
                                                                icon={
                                                                    <HiOutlineTrash />
                                                                }
                                                                onClick={() =>
                                                                    handleConfirmDelete(
                                                                        index
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        Belum ada data BASTP. Klik 'Tambah
                                        BASTP' untuk menambahkan.
                                    </div>
                                )}
                            </AdaptableCard>

                            {/* Dialog Konfirmasi Hapus */}
                            <ConfirmDialog
                                isOpen={dialogOpen}
                                type="danger"
                                title="Hapus BASTP"
                                confirmButtonColor="red-600"
                                onClose={handleCancelDelete}
                                onRequestClose={handleCancelDelete}
                                onCancel={handleCancelDelete}
                                onConfirm={handleDelete}
                            >
                                <p>
                                    Apakah kamu yakin ingin menghapus BASTP ini?
                                </p>
                            </ConfirmDialog>
                        </Form>
                    )
                }}
            </Formik>

            {/* Form for update date bastp */}
            <Formik
                initialValues={bastpFormInitialValues}
                validationSchema={BastpSchema}
                onSubmit={handleBastpSubmit}
                enableReinitialize={true}
            >
                {({ errors, touched, isSubmitting, values, setFieldValue }) => (
                    <>
                        <Dialog
                            isOpen={bastpDialogIsOpen}
                            onClose={onBastpDialogClose}
                            onRequestClose={onBastpDialogClose}
                        >
                            <Form>
                                <h5 className="mb-4">
                                    {isEditBastpMode
                                        ? 'Edit Tanggal Bastp'
                                        : 'Tambah Tanggal Bastp'}
                                </h5>

                                {/* Form Bastp Tanggal Pembayaran */}
                                <FormItem
                                    label="Tanggal Pembayaran"
                                    invalid={
                                        (errors.tanggal_pembayaran &&
                                            touched.tanggal_pembayaran) as boolean
                                    }
                                    errorMessage={errors.tanggal_pembayaran}
                                >
                                    <Field name="tanggal_pembayaran">
                                        {({ field, form }: FieldProps) => (
                                            <DatePicker
                                                placeholder="Pilih Tanggal"
                                                value={
                                                    field.value
                                                        ? new Date(field.value)
                                                        : null
                                                }
                                                inputFormat="DD-MM-YYYY"
                                                onChange={(date) => {
                                                    const formattedDate = date
                                                        ? dayjs(date).format(
                                                              'YYYY-MM-DD'
                                                          )
                                                        : ''
                                                    form.setFieldValue(
                                                        field.name,
                                                        formattedDate
                                                    )
                                                }}
                                            />
                                        )}
                                    </Field>
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
                                        {isEditBastpMode ? 'Update' : 'Simpan'}
                                    </Button>
                                </div>
                            </Form>
                        </Dialog>
                        {/* <ConfirmDialog
                            isOpen={terminDeleteConfirmOpen}
                            type="danger"
                            title="Hapus Termin"
                            confirmButtonColor="red-600"
                            onClose={handleCancelDeleteTermin}
                            onRequestClose={handleCancelDeleteTermin}
                            onCancel={handleCancelDeleteTermin}
                            onConfirm={handleDeleteTermin}
                        >
                            <p>
                                Apakah kamu yakin ingin menghapus termin ini?
                                {selectedBastpToEdit?.FakturPajak?.id && (
                                    <span className="block mt-2 text-red-500">
                                        Faktur yang terkait dengan termin ini
                                        juga akan dihapus!
                                    </span>
                                )}
                            </p>
                        </ConfirmDialog> */}
                    </>
                )}
            </Formik>
        </Loading>
    )
}
