import React, { useState, useEffect } from 'react'
import {
    HiOutlineTrash,
    HiOutlinePencil,
    HiOutlineDocument,
} from 'react-icons/hi'
import { LuFilePlus2 } from 'react-icons/lu'
import classNames from 'classnames'
import isLastChild from '@/utils/isLastChild'
import DescriptionSection from './DesriptionSection'
import reducer, {
    getAdendumsByProyek,
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
import { NumericFormat } from 'react-number-format'
import { extractNumberFromString } from '@/utils/extractNumberFromString'
import {
    apiCreateAdendum,
    apiDeleteAdendum,
    apiEditAdendum,
    apiUpdateStatusAdendum,
} from '@/services/AdendumService'

type Adendum = {
    id: string
    dasar_adendum: string
    nilai_sebelum_adendum: number
    nilai_adendum: number
    tanggal: string
    idProject: string
    status: string
}

// Form values type
type FormValues = {
    tempDasarAdendum: string
    tempNilaiSebelumAdendum: number | string
    tempNilaiAdendum: number | string
    tempTanggal: Date | null
    tempIdProject: string
}

// Validation schema for the form fields
const validationSchema = Yup.object().shape({
    tempDasarAdendum: Yup.string().required('Dasar adendum harus diisi'),
    tempNilaiSebelumAdendum: Yup.string().required(
        'Nilai sebelum adendum harus diisi'
    ),
    tempNilaiAdendum: Yup.string().required('Nilai adendum harus diisi'),
    tempTanggal: Yup.date()
        .required('Tanggal harus diisi')
        .typeError('Format tanggal tidak valid'),
})

injectReducer('proyekDetail', reducer)

export default function Adendum() {
    const [showForm, setShowForm] = useState(false)
    const [editIndex, setEditIndex] = useState<number | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
    // New state for status confirmation dialog
    const [statusDialogOpen, setStatusDialogOpen] = useState(false)
    const [adendumToUpdateStatus, setAdendumToUpdateStatus] =
        useState<Adendum | null>(null)

    const dispatch = useAppDispatch()
    const projectId = location.pathname.substring(
        location.pathname.lastIndexOf('/') + 1
    )

    const adendumByProyekData = useAppSelector(
        (state) => state.proyekDetail.data.adendumsByProyekData
    )

    const loading = useAppSelector(
        (state) => state.proyekDetail.data.loadingAdendumsByProyek
    )

    // Fetch adendums when component mounts
    useEffect(() => {
        const requestParam = { id: projectId }
        dispatch(getAdendumsByProyek(requestParam))
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

    // Format currency for display
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount)
    }

    // Initialize form values
    const initialValues: FormValues = {
        tempDasarAdendum: '',
        tempNilaiSebelumAdendum: '',
        tempNilaiAdendum: '',
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
                Data adendum berhasil {keyword}
            </Notification>,
            {
                placement: 'top-center',
            }
        )
    }

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

                    const handleAddAdendum = () => {
                        setShowForm(true)
                        setEditIndex(null)

                        // Reset temp values
                        setFieldValue('tempDasarAdendum', '')
                        setFieldValue('tempNilaiSebelumAdendum', '')
                        setFieldValue('tempNilaiAdendum', '')
                        setFieldValue('tempTanggal', null)
                    }

                    const handleSave = async () => {
                        // Validate fields
                        if (
                            !errors.tempDasarAdendum &&
                            !errors.tempNilaiSebelumAdendum &&
                            !errors.tempNilaiAdendum &&
                            !errors.tempTanggal
                        ) {
                            setIsSubmitting(true)

                            const requestData = {
                                dasar_adendum: values.tempDasarAdendum,
                                nilai_sebelum_adendum: extractNumberFromString(
                                    values.tempNilaiSebelumAdendum
                                ),
                                nilai_adendum: extractNumberFromString(
                                    values.tempNilaiAdendum
                                ),
                                tanggal: values.tempTanggal?.toISOString(),
                                idProject: values.tempIdProject,
                            }

                            try {
                                let result

                                if (editIndex !== null && adendumByProyekData) {
                                    // Handle edit with API call
                                    const adendumId =
                                        adendumByProyekData[editIndex].id
                                    result = await apiEditAdendum({
                                        id: adendumId,
                                        ...requestData,
                                    })
                                } else {
                                    // Handle create with API call
                                    result = await apiCreateAdendum(requestData)
                                }

                                setIsSubmitting(false)

                                if (
                                    result &&
                                    result.data?.statusCode >= 200 &&
                                    result.data?.statusCode < 300
                                ) {
                                    // Refresh data
                                    dispatch(
                                        getAdendumsByProyek({ id: projectId })
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
                                                : 'Gagal menambahkan adendum'}
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
                                            : 'Gagal menambahkan adendum'}
                                    </Notification>,
                                    { placement: 'top-center' }
                                )
                            }
                        }
                    }

                    // Helper function to reset form fields
                    const resetFormFields = () => {
                        setFieldValue('tempDasarAdendum', '')
                        setFieldValue('tempNilaiSebelumAdendum', '')
                        setFieldValue('tempNilaiAdendum', '')
                        setFieldValue('tempTanggal', null)
                    }

                    const handleCancel = () => {
                        setShowForm(false)
                        setEditIndex(null)
                        resetFormFields()
                    }

                    const handleEdit = (index: number) => {
                        if (adendumByProyekData) {
                            const adendum = adendumByProyekData[index]

                            // Set temporary values for editing
                            setFieldValue(
                                'tempDasarAdendum',
                                adendum.dasar_adendum
                            )
                            setFieldValue(
                                'tempNilaiSebelumAdendum',
                                adendum.nilai_sebelum_adendum
                            )
                            setFieldValue(
                                'tempNilaiAdendum',
                                adendum.nilai_adendum
                            )
                            setFieldValue(
                                'tempTanggal',
                                new Date(adendum.tanggal)
                            )
                            setFieldValue('tempIdProject', adendum.idProject)

                            setEditIndex(index)
                            setShowForm(true)
                        }
                    }

                    // Modified to open confirmation dialog first
                    const handleOpenStatusConfirmation = (data: Adendum) => {
                        setAdendumToUpdateStatus(data)
                        setStatusDialogOpen(true)
                    }

                    // This function is now called only after confirmation
                    const handleUpdateStatusAdendum = async () => {
                        if (!adendumToUpdateStatus) return

                        setIsSubmitting(true)
                        try {
                            let newStatus = ''
                            let statusMessage = ''

                            if (
                                adendumToUpdateStatus.status ===
                                'BELUM_DISETUJUI'
                            ) {
                                newStatus = 'SUDAH_DISETUJUI'
                                statusMessage = 'disetujui'
                            } else if (
                                adendumToUpdateStatus.status ===
                                'SUDAH_DISETUJUI'
                            ) {
                                newStatus = 'BELUM_DISETUJUI'
                                statusMessage = 'dibatalkan persetujuannya'
                            }

                            const res = await apiUpdateStatusAdendum({
                                id: adendumToUpdateStatus.id,
                                status: newStatus,
                            })

                            // Success notification
                            toast.push(
                                <Notification
                                    title="Status berhasil diperbarui"
                                    type="success"
                                    duration={2500}
                                >
                                    Adendum berhasil {statusMessage}
                                </Notification>,
                                {
                                    placement: 'top-center',
                                }
                            )

                            // Refresh data after successful update
                            dispatch(getAdendumsByProyek({ id: projectId }))
                        } catch (error) {
                            console.error(
                                'Error updating status adendum:',
                                error
                            )

                            // Error notification
                            toast.push(
                                <Notification
                                    title="Gagal memperbarui status"
                                    type="danger"
                                    duration={2500}
                                >
                                    {error?.response?.data?.message ||
                                        'Terjadi kesalahan saat memperbarui status adendum'}
                                </Notification>,
                                {
                                    placement: 'top-center',
                                }
                            )
                        } finally {
                            setIsSubmitting(false)
                            setStatusDialogOpen(false)
                            setAdendumToUpdateStatus(null)
                        }
                    }

                    // Function to cancel status update
                    const handleCancelStatusUpdate = () => {
                        setStatusDialogOpen(false)
                        setAdendumToUpdateStatus(null)
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
                        if (deleteIndex !== null && adendumByProyekData) {
                            const adendumId = adendumByProyekData[deleteIndex]

                            setIsSubmitting(true)
                            try {
                                // Call delete API with adendum ID
                                const success = await apiDeleteAdendum(
                                    adendumId
                                )

                                if (success) {
                                    // Refresh data after successful delete
                                    dispatch(
                                        getAdendumsByProyek({ id: projectId })
                                    )
                                    popNotification('dihapus')
                                }
                            } catch (error) {
                                console.error('Error deleting adendum:', error)

                                // Show error notification
                                toast.push(
                                    <Notification
                                        title="Error"
                                        type="danger"
                                        duration={2500}
                                    >
                                        Gagal menghapus adendum
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
                                        title="Informasi Adendum"
                                        desc="Informasi adendum proyek"
                                    />
                                    {!showForm && (
                                        <Button
                                            size="sm"
                                            variant="twoTone"
                                            onClick={handleAddAdendum}
                                            className="w-fit text-xs"
                                            type="button"
                                        >
                                            Tambah Adendum
                                        </Button>
                                    )}
                                </div>

                                {/* Form untuk input adendum */}
                                {showForm && (
                                    <div className="mb-4 border bg-slate-50 rounded-md p-4">
                                        <h6 className="mb-3">
                                            {editIndex !== null
                                                ? 'Edit Adendum'
                                                : 'Tambah Adendum Baru'}
                                        </h6>

                                        <FormContainer>
                                            <div className="grid grid-cols-2 gap-4">
                                                {/* Dasar Adendum */}
                                                <FormItem
                                                    label="Dasar Adendum"
                                                    errorMessage={
                                                        errors.tempDasarAdendum &&
                                                        touched.tempDasarAdendum
                                                            ? errors.tempDasarAdendum
                                                            : ''
                                                    }
                                                    invalid={
                                                        !!(
                                                            errors.tempDasarAdendum &&
                                                            touched.tempDasarAdendum
                                                        )
                                                    }
                                                >
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name="tempDasarAdendum"
                                                        placeholder="Contoh: Perubahan Spesifikasi Teknis"
                                                        component={Input}
                                                    />
                                                </FormItem>

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

                                                {/* Nilai Sebelum Adendum */}
                                                <FormItem
                                                    label="Nilai Sebelum Adendum"
                                                    className="mb-3"
                                                    errorMessage={
                                                        errors.tempNilaiSebelumAdendum &&
                                                        touched.tempNilaiSebelumAdendum
                                                            ? errors.tempNilaiSebelumAdendum
                                                            : ''
                                                    }
                                                    invalid={
                                                        !!(
                                                            errors.tempNilaiSebelumAdendum &&
                                                            touched.tempNilaiSebelumAdendum
                                                        )
                                                    }
                                                >
                                                    <Field name="tempNilaiSebelumAdendum">
                                                        {({
                                                            field,
                                                            form,
                                                        }: FieldProps) => (
                                                            <NumericFormat
                                                                {...field}
                                                                placeholder="Nilai dalam Rupiah"
                                                                customInput={
                                                                    Input
                                                                }
                                                                thousandSeparator="."
                                                                decimalSeparator=","
                                                                onValueChange={(
                                                                    val
                                                                ) =>
                                                                    form.setFieldValue(
                                                                        field.name,
                                                                        val.value
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                    </Field>
                                                </FormItem>

                                                {/* Nilai Adendum */}
                                                <FormItem
                                                    label="Nilai Adendum"
                                                    className="mb-3"
                                                    errorMessage={
                                                        errors.tempNilaiAdendum &&
                                                        touched.tempNilaiAdendum
                                                            ? errors.tempNilaiAdendum
                                                            : ''
                                                    }
                                                    invalid={
                                                        !!(
                                                            errors.tempNilaiAdendum &&
                                                            touched.tempNilaiAdendum
                                                        )
                                                    }
                                                >
                                                    <Field name="tempNilaiAdendum">
                                                        {({
                                                            field,
                                                            form,
                                                        }: FieldProps) => (
                                                            <NumericFormat
                                                                {...field}
                                                                placeholder="Nilai dalam Rupiah"
                                                                customInput={
                                                                    Input
                                                                }
                                                                thousandSeparator="."
                                                                decimalSeparator=","
                                                                onValueChange={(
                                                                    val
                                                                ) =>
                                                                    form.setFieldValue(
                                                                        field.name,
                                                                        val.value
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                    </Field>
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

                                {/* Daftar adendum */}
                                {adendumByProyekData &&
                                adendumByProyekData.length > 0 ? (
                                    <div className="rounded-lg border border-gray-200 dark:border-gray-600">
                                        {adendumByProyekData.map(
                                            (data: Adendum, index: number) => {
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
                                                                adendumByProyekData,
                                                                index
                                                            ) &&
                                                                'border-b border-gray-200 dark:border-gray-600'
                                                        )}
                                                    >
                                                        <div className="flex items-center flex-grow ">
                                                            <div className="text-3xl">
                                                                <HiOutlineDocument className="text-indigo-500" />
                                                            </div>
                                                            <div className="ml-3 rtl:mr-3">
                                                                <div className="flex items-center">
                                                                    <div className="text-gray-900 dark:text-gray-100 font-semibold">
                                                                        {
                                                                            data.dasar_adendum
                                                                        }
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
                                                                        Nilai
                                                                        Sebelum:{' '}
                                                                        {formatCurrency(
                                                                            data.nilai_sebelum_adendum
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        Nilai
                                                                        Adendum:{' '}
                                                                        {formatCurrency(
                                                                            data.nilai_adendum
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        Selisih:{' '}
                                                                        {formatCurrency(
                                                                            data.nilai_adendum -
                                                                                data.nilai_sebelum_adendum
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex space-x-2 ">
                                                            <Button
                                                                size="sm"
                                                                variant="solid"
                                                                color={
                                                                    data?.status ===
                                                                    'SUDAH_DISETUJUI'
                                                                        ? 'red'
                                                                        : ''
                                                                }
                                                                onClick={() =>
                                                                    handleOpenStatusConfirmation(
                                                                        data
                                                                    )
                                                                }
                                                                className="w-fit text-xs "
                                                                type="button"
                                                            >
                                                                {data?.status ===
                                                                'SUDAH_DISETUJUI'
                                                                    ? 'Batalkan Persetujuan'
                                                                    : 'Setujui Adendum'}
                                                            </Button>
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
                                        Belum ada data adendum. Klik 'Tambah
                                        Adendum' untuk menambahkan.
                                    </div>
                                )}
                            </AdaptableCard>

                            {/* Dialog Konfirmasi Hapus */}
                            <ConfirmDialog
                                isOpen={dialogOpen}
                                type="danger"
                                title="Hapus Adendum"
                                confirmButtonColor="red-600"
                                onClose={handleCancelDelete}
                                onRequestClose={handleCancelDelete}
                                onCancel={handleCancelDelete}
                                onConfirm={handleDelete}
                            >
                                <p>
                                    Apakah kamu yakin ingin menghapus adendum
                                    ini?
                                </p>
                            </ConfirmDialog>

                            {/* Dialog Konfirmasi Perubahan Status */}
                            <ConfirmDialog
                                isOpen={statusDialogOpen}
                                type={
                                    adendumToUpdateStatus?.status ===
                                    'SUDAH_DISETUJUI'
                                        ? 'danger'
                                        : 'success'
                                }
                                title={
                                    adendumToUpdateStatus?.status ===
                                    'SUDAH_DISETUJUI'
                                        ? 'Batalkan Persetujuan Adendum'
                                        : 'Setujui Adendum'
                                }
                                confirmButtonColor={
                                    adendumToUpdateStatus?.status ===
                                    'SUDAH_DISETUJUI'
                                        ? 'red-600'
                                        : 'emerald-600'
                                }
                                onClose={handleCancelStatusUpdate}
                                onRequestClose={handleCancelStatusUpdate}
                                onCancel={handleCancelStatusUpdate}
                                onConfirm={handleUpdateStatusAdendum}
                            >
                                <p>
                                    {adendumToUpdateStatus?.status ===
                                    'SUDAH_DISETUJUI'
                                        ? 'Apakah kamu yakin ingin membatalkan persetujuan adendum ini?'
                                        : 'Apakah kamu yakin ingin menyetujui adendum ini?'}
                                </p>
                            </ConfirmDialog>
                        </Form>
                    )
                }}
            </Formik>
        </Loading>
    )
}
