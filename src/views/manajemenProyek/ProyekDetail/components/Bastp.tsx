import React, { useState, useEffect } from 'react'
import { HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi'
import { LuFilePlus2 } from 'react-icons/lu'
import classNames from 'classnames'
import isLastChild from '@/utils/isLastChild'
import DescriptionSection from './DesriptionSection'
import reducer, {
    getBastpsByProyek,
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
import { Notification, toast } from '@/components/ui'
import DatePicker from '@/components/ui/DatePicker'
import {
    apiCreateBastp,
    apiDeleteBastp,
    apiEditBastp,
} from '@/services/BastpService'

type Bastp = {
    id: string
    tanggal: string
    keterangan: string
    idProject: string
    createdAt: string
    updatedAt: string
}

// Form values type
type FormValues = {
    tempTanggal: Date | null
    tempKeterangan: string
    tempIdProject: string
}

// Validation schema for the form fields
const validationSchema = Yup.object().shape({
    tempKeterangan: Yup.string().required('Keterangan harus diisi'),
    tempTanggal: Yup.date()
        .required('Tanggal harus diisi')
        .typeError('Format tanggal tidak valid'),
})

injectReducer('proyekDetail', reducer)

export default function Bastp() {
    const [showForm, setShowForm] = useState(false)
    const [editIndex, setEditIndex] = useState<number | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null)

    const dispatch = useAppDispatch()
    const projectId = location.pathname.substring(
        location.pathname.lastIndexOf('/') + 1
    )

    const bastpsByProyekData = useAppSelector(
        (state) => state.proyekDetail.data.bastpProyekData.data
    )

    const loading = useAppSelector(
        (state) => state.proyekDetail.data.loadingBastpsByProyek
    )

    // Fetch BASTs when component mounts
    useEffect(() => {
        const requestParam = { id: projectId }
        dispatch(getBastpsByProyek(requestParam))
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
        tempKeterangan: '',
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

    console.log('bastpsByProyekData', bastpsByProyekData)

    return (
        <Loading loading={loading || isSubmitting}>
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

                    const handleAddBastp = () => {
                        setShowForm(true)
                        setEditIndex(null)

                        // Reset temp values
                        setFieldValue('tempTanggal', null)
                        setFieldValue('tempKeterangan', '')
                    }

                    const handleSave = async () => {
                        // Validate fields
                        if (!errors.tempKeterangan && !errors.tempTanggal) {
                            setIsSubmitting(true)

                            const requestData = {
                                tanggal: values.tempTanggal?.toISOString(),
                                keterangan: values.tempKeterangan,
                                idProject: values.tempIdProject,
                            }

                            try {
                                let result

                                if (editIndex !== null && bastpsByProyekData) {
                                    // Handle edit with API call
                                    const bastpId =
                                        bastpsByProyekData[editIndex].id
                                    result = await apiEditBastp({
                                        id: bastpId,
                                        ...requestData,
                                    })
                                } else {
                                    // Handle create with API call
                                    result = await apiCreateBastp(requestData)
                                }

                                setIsSubmitting(false)

                                if (
                                    result &&
                                    result.data?.statusCode >= 200 &&
                                    result.data?.statusCode < 300
                                ) {
                                    console.log('result', result)

                                    // Refresh data
                                    dispatch(
                                        getBastpsByProyek({ id: projectId })
                                    )

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
                                setIsSubmitting(false)
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
                            }
                        }
                    }

                    // Helper function to reset form fields
                    const resetFormFields = () => {
                        setFieldValue('tempTanggal', null)
                        setFieldValue('tempKeterangan', '')
                    }

                    const handleCancel = () => {
                        setShowForm(false)
                        setEditIndex(null)
                        resetFormFields()
                    }

                    const handleEdit = (index: number) => {
                        if (bastpsByProyekData) {
                            const bastp = bastpsByProyekData[index]

                            // Set temporary values for editing
                            setFieldValue(
                                'tempTanggal',
                                new Date(bastp.tanggal)
                            )
                            setFieldValue('tempKeterangan', bastp.keterangan)
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
                        if (deleteIndex !== null && bastpsByProyekData) {
                            const bastpId = bastpsByProyekData[deleteIndex].id

                            setIsSubmitting(true)
                            try {
                                // Call delete API with BASTP ID
                                const success = await apiDeleteBastp({
                                    id: bastpId,
                                })

                                if (success) {
                                    // Refresh data aft'er successful delete
                                    console.log(
                                        'projectId sebelum refresh',
                                        projectId
                                    )

                                    dispatch(
                                        getBastpsByProyek({ id: projectId })
                                    )
                                    console.log(
                                        'projectId setelah refresh',
                                        projectId
                                    )
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
                                    {!showForm && (
                                        <Button
                                            size="sm"
                                            variant="twoTone"
                                            onClick={handleAddBastp}
                                            className="w-fit text-xs"
                                            type="button"
                                        >
                                            Tambah BASTP
                                        </Button>
                                    )}
                                </div>

                                {/* Form untuk input BASTP */}
                                {showForm && (
                                    <div className="mb-4 border bg-slate-50 rounded-md p-4">
                                        <h6 className="mb-3">
                                            {editIndex !== null
                                                ? 'Edit BASTP'
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

                                                {/* Keterangan */}
                                                <FormItem
                                                    label="Keterangan"
                                                    errorMessage={
                                                        errors.tempKeterangan &&
                                                        touched.tempKeterangan
                                                            ? errors.tempKeterangan
                                                            : ''
                                                    }
                                                    invalid={
                                                        !!(
                                                            errors.tempKeterangan &&
                                                            touched.tempKeterangan
                                                        )
                                                    }
                                                >
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name="tempKeterangan"
                                                        placeholder="Masukkan keterangan BASTP"
                                                        component={Input}
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
                                {bastpsByProyekData &&
                                bastpsByProyekData.length > 0 ? (
                                    <div className="rounded-lg border border-gray-200 dark:border-gray-600">
                                        {bastpsByProyekData.map(
                                            (data: Bastp, index: number) => {
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
                                                                bastpsByProyekData,
                                                                index
                                                            ) &&
                                                                'border-b border-gray-200 dark:border-gray-600'
                                                        )}
                                                    >
                                                        <div className="flex items-center flex-grow">
                                                            <div className="text-3xl">
                                                                <LuFilePlus2 className="text-indigo-500" />
                                                            </div>
                                                            <div className="ml-3 rtl:mr-3">
                                                                <div className="flex items-center">
                                                                    <div className="text-gray-900 dark:text-gray-100 font-semibold">
                                                                        BASTP{' '}
                                                                        {index +
                                                                            1}
                                                                    </div>
                                                                </div>
                                                                <div className="text-gray-500 text-sm mt-1">
                                                                    <div>
                                                                        Tanggal:{' '}
                                                                        {formatDate(
                                                                            data.tanggal
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        Keterangan:{' '}
                                                                        {
                                                                            data.keterangan
                                                                        }
                                                                    </div>
                                                                </div>
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
                                                                    handleEdit(
                                                                        index
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
        </Loading>
    )
}
