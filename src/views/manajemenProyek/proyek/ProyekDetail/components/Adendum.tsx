import React, { useState, useEffect } from 'react'
import { HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi'
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
    // apiCreateAdendum,
    apiDeleteAdendum,
    apiEditAdendum,
    apiGetAdendum,
    apiUpdateStatusAdendum,
} from '@/services/AdendumService'
import { formatDate } from '@/utils/formatDate'
import { apiGetProyek } from '@/services/ProyekService'

type Adendum = {
    id: string
    dasar_adendum: string
    nilai_sebelum_adendum: number
    nilai_adendum: number
    tanggal: string
    idProject: string
    status: string
    timeline_akhir_sebelum?: string
    timeline_akhir_sesudah?: string
}

// Validation schema for the form fields
const validationSchema = Yup.object().shape({
    tempDasarAdendum: Yup.string().required('Dasar adendum harus diisi'),
    // tempNilaiSebelumAdendum: Yup.string().required(
    //     'Nilai sebelum adendum harus diisi'
    // ),
    // tempNilaiAdendum: Yup.string().required('Nilai adendum harus diisi'),
    // tempTanggal: Yup.date()
    //     .required('Tanggal harus diisi')
    //     .typeError('Format tanggal tidak valid'),
    // tempTimelineAkhirSesudah: Yup.string().required(
    //     'Timeline akhir sesudah harus diisi'
    // ),
})

injectReducer('proyekDetail', reducer)

export default function Adendum() {
    const projectId = location.pathname.substring(
        location.pathname.lastIndexOf('/') + 1
    )

    const [showForm, setShowForm] = useState(false)
    const [editIndex, setEditIndex] = useState<number | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [proyekData, setProyekData] = useState({})
    const [dialogOpen, setDialogOpen] = useState(false)
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
    // New state for status confirmation dialog
    const [statusDialogOpen, setStatusDialogOpen] = useState(false)
    const [lastAdendum, setLastAdendum] = useState({})
    const [formInitialValues, setFormInitialValues] = useState({
        tempDasarAdendum: '',
        tempNilaiAdendum: 0,
        tempTanggal: new Date(),
        tempIdProject: '',
        tempNilaiSebelumAdendum: 0,
        tempTimelineAkhirSebelum: '',
        tempTimelineAkhirSesudah: '',
    })
    const [adendumToUpdateStatus, setAdendumToUpdateStatus] =
        useState<Adendum | null>(null)

    const dispatch = useAppDispatch()

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

        // Create an async function inside useEffect
        const fetchProyek = async () => {
            try {
                setProyekData(await apiGetProyek(requestParam))
                setFormInitialValues({
                    tempDasarAdendum: '',
                    tempNilaiAdendum: proyekData.data?.nilai_kontrak,
                    tempTanggal: new Date(),
                    tempIdProject: projectId || '',
                    tempNilaiSebelumAdendum: proyekData.data?.nilai_kontrak,
                    tempTimelineAkhirSebelum: '',
                    tempTimelineAkhirSesudah: '',
                })
            } catch (error) {
                // Show error notification
                toast.push(
                    <Notification title="Error" type="danger" duration={2500}>
                        {'Gagal mendapatkan data proyekId'}
                    </Notification>,
                    { placement: 'top-center' }
                )
            }
        }

        fetchProyek()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, projectId])

    // Format currency for display
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount)
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
                initialValues={formInitialValues}
                validationSchema={validationSchema}
                onSubmit={() => {
                    // Form submission is handled by save button
                }}
            >
                {(formikProps) => {
                    const { values, errors, touched, setFieldValue } =
                        formikProps

                    // Modifikasi handleAddAdendum
                    const handleAddAdendum = () => {
                        setShowForm(true)
                        setEditIndex(null)

                        // Update nilai form berdasarkan adendum terakhir
                        if (
                            adendumByProyekData &&
                            adendumByProyekData.length > 0
                        ) {
                            const lastAdendum =
                                adendumByProyekData[
                                    adendumByProyekData.length - 1
                                ]
                            setLastAdendum(lastAdendum)

                            setFormInitialValues({
                                tempDasarAdendum: '',
                                tempNilaiSebelumAdendum:
                                    lastAdendum.nilai_adendum,
                                tempNilaiAdendum: lastAdendum.nilai_adendum,
                                tempTanggal: new Date(),
                                tempIdProject: projectId || '',
                                tempTimelineAkhirSebelum:
                                    lastAdendum.timeline_akhir_sesudah,
                                tempTimelineAkhirSesudah: '',
                            })
                        } else {
                            setFormInitialValues({
                                tempDasarAdendum: '',
                                tempNilaiSebelumAdendum:
                                    proyekData.data?.nilai_kontrak,
                                tempNilaiAdendum: 0,
                                tempTanggal: new Date(),
                                tempIdProject: projectId || '',
                                tempTimelineAkhirSebelum:
                                    proyekData.data?.timeline_akhir,
                                tempTimelineAkhirSesudah: '',
                            })
                        }
                    }

                    const handleSave = async () => {
                        // Validate fields
                        if (
                            !errors.tempDasarAdendum &&
                            !errors.tempNilaiSebelumAdendum &&
                            !errors.tempNilaiAdendum &&
                            !errors.tempTanggal &&
                            !errors.tempTimelineAkhirSesudah
                        ) {
                            setIsSubmitting(true)

                            const requestData = {
                                dasar_adendum: values.tempDasarAdendum,
                                nilai_sebelum_adendum:
                                    values.tempNilaiSebelumAdendum,
                                nilai_adendum: extractNumberFromString(
                                    values.tempNilaiAdendum
                                ),
                                tanggal: values.tempTanggal?.toISOString(),
                                idProject: values.tempIdProject,
                                timeline_akhir_sebelum:
                                    values.tempTimelineAkhirSebelum,
                                timeline_akhir_sesudah:
                                    values.tempTimelineAkhirSesudah,
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
                                    // result = await apiCreateAdendum(requestData)
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
                        setFieldValue(
                            'tempNilaiSebelumAdendum',
                            proyekData.data?.nilai_kontrak
                        )
                        setFieldValue('tempNilaiAdendum', '')
                        setFieldValue('tempTanggal', new Date())
                        setFieldValue(
                            'tempTimelineAkhirSebelum',
                            proyekData.data?.timeline_akhir
                        )
                        setFieldValue('tempTimelineAkhirSesudah', '')
                    }

                    const handleCancel = () => {
                        setShowForm(false)
                        setEditIndex(null)
                        resetFormFields()
                    }

                    const handleEdit = (index: number) => {
                        if (adendumByProyekData) {
                            const adendum = adendumByProyekData[index]

                            // Coba fetch data adendum detail jika tersedia
                            const fetchDetailAdendum = async () => {
                                try {
                                    // Gunakan API get one adendum jika tersedia
                                    const detailAdendum = await apiGetAdendum(
                                        adendum
                                    )

                                    if (detailAdendum && detailAdendum.data) {
                                        const data = detailAdendum.data

                                        // Set temporary values dari detail API
                                        setFieldValue(
                                            'tempDasarAdendum',
                                            data.dasar_adendum
                                        )
                                        setFieldValue(
                                            'tempNilaiSebelumAdendum',
                                            data.nilai_sebelum_adendum
                                        )
                                        setFieldValue(
                                            'tempNilaiAdendum',
                                            data.nilai_adendum
                                        )
                                        setFieldValue(
                                            'tempTanggal',
                                            new Date(data.tanggal)
                                        )
                                        setFieldValue(
                                            'tempIdProject',
                                            data.idProject
                                        )

                                        // Handle timeline_akhir_sebelum
                                        if (data.timeline_akhir_sebelum) {
                                            setFieldValue(
                                                'tempTimelineAkhirSebelum',
                                                data.timeline_akhir_sebelum
                                            )
                                        } else {
                                            setFieldValue(
                                                'tempTimelineAkhirSebelum',
                                                proyekData.data
                                                    ?.timeline_akhir || ''
                                            )
                                        }

                                        // Handle timeline_akhir_sesudah
                                        if (data.timeline_akhir_sesudah) {
                                            setFieldValue(
                                                'tempTimelineAkhirSesudah',
                                                new Date(
                                                    data.timeline_akhir_sesudah
                                                )
                                            )
                                        } else {
                                            setFieldValue(
                                                'tempTimelineAkhirSesudah',
                                                ''
                                            )
                                        }
                                    }
                                } catch (error) {
                                    console.error(
                                        'Error fetching detail adendum:',
                                        error
                                    )
                                }
                            }

                            // Panggil fungsi untuk fetch detail
                            fetchDetailAdendum()

                            setEditIndex(index)
                            setShowForm(true)
                        }
                    }

                    // Modified to open confirmation dialog first
                    const handleOpenStatusConfirmation = (data: Adendum) => {
                        setAdendumToUpdateStatus(data)
                        setStatusDialogOpen(true)
                        // Refresh data after update
                        dispatch(getAdendumsByProyek({ id: projectId }))
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
                                        {error.response.data?.message ||
                                            'Gagal menghapus adendum'}
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

                                                {/* Nilai Sebelum Adendum (Disabled) */}
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
                                                                disabled={true} // Make this field disabled
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

                                                {/* Timeline Akhir Sebelum (Disabled) */}
                                                <FormItem
                                                    label="Timeline Akhir Sebelum"
                                                    className="mb-3"
                                                >
                                                    <DatePicker
                                                        disabled
                                                        placeholder="Pilih Tanggal"
                                                        value={
                                                            lastAdendum.timeline_akhir_sesudah
                                                                ? new Date(
                                                                      lastAdendum.timeline_akhir_sesudah
                                                                  )
                                                                : new Date(
                                                                      proyekData.data.timeline_akhir
                                                                  )
                                                        }
                                                        inputFormat="DD-MM-YYYY"
                                                        onChange={(date) => {
                                                            setFieldValue(
                                                                'tempTimelineAkhirSebelum',
                                                                date
                                                            )
                                                        }}
                                                    />
                                                </FormItem>

                                                {/* Timeline Akhir Sesudah */}
                                                <FormItem
                                                    label="Timeline Akhir Sesudah"
                                                    errorMessage={
                                                        errors.tempTimelineAkhirSesudah &&
                                                        touched.tempTimelineAkhirSesudah
                                                            ? errors.tempTimelineAkhirSesudah
                                                            : ''
                                                    }
                                                    invalid={
                                                        !!(
                                                            errors.tempTimelineAkhirSesudah &&
                                                            touched.tempTimelineAkhirSesudah
                                                        )
                                                    }
                                                >
                                                    <DatePicker
                                                        placeholder="Pilih tanggal"
                                                        value={
                                                            values.tempTimelineAkhirSesudah
                                                        }
                                                        inputFormat="DD-MM-YYYY"
                                                        onChange={(date) => {
                                                            setFieldValue(
                                                                'tempTimelineAkhirSesudah',
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
                                                                <LuFilePlus2 className="text-indigo-500" />
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
                                                                    {data.timeline_akhir_sebelum && (
                                                                        <div>
                                                                            Timeline
                                                                            Akhir
                                                                            Sebelum:{' '}
                                                                            {formatDate(
                                                                                data.timeline_akhir_sebelum
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                    {data.timeline_akhir_sesudah && (
                                                                        <div>
                                                                            Timeline
                                                                            Akhir
                                                                            Sesudah:{' '}
                                                                            {formatDate(
                                                                                data.timeline_akhir_sesudah
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col gap-4 items-end space-x-2 ">
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
                                                            <div>
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
                                                    </div>
                                                )
                                            }
                                        )}
                                    </div>
                                ) : (
                                    !loading && (
                                        <div className="text-center py-5">
                                            <p className="text-gray-500 dark:text-gray-400">
                                                Belum ada adendum untuk proyek
                                                ini
                                            </p>
                                        </div>
                                    )
                                )}

                                {/* Confirmation dialog for deletion */}
                                <ConfirmDialog
                                    isOpen={dialogOpen}
                                    type="danger"
                                    title="Konfirmasi Hapus"
                                    confirmButtonColor="red-600"
                                    confirmText="Hapus"
                                    cancelText="Batal"
                                    onClose={handleCancelDelete}
                                    onRequestClose={handleCancelDelete}
                                    onCancel={handleCancelDelete}
                                    onConfirm={handleDelete}
                                >
                                    <p>
                                        Apakah Anda yakin ingin menghapus
                                        adendum ini? Tindakan ini tidak dapat
                                        dibatalkan.
                                    </p>
                                </ConfirmDialog>

                                {/* Confirmation dialog for status update */}
                                <ConfirmDialog
                                    isOpen={statusDialogOpen}
                                    type={
                                        adendumToUpdateStatus?.status ===
                                        'BELUM_DISETUJUI'
                                            ? 'info'
                                            : 'danger'
                                    }
                                    title={
                                        adendumToUpdateStatus?.status ===
                                        'BELUM_DISETUJUI'
                                            ? 'Konfirmasi Persetujuan'
                                            : 'Konfirmasi Pembatalan'
                                    }
                                    confirmButtonColor={
                                        adendumToUpdateStatus?.status ===
                                        'BELUM_DISETUJUI'
                                            ? 'blue-600'
                                            : 'red-600'
                                    }
                                    confirmText={
                                        adendumToUpdateStatus?.status ===
                                        'BELUM_DISETUJUI'
                                            ? 'Setujui'
                                            : 'Batalkan'
                                    }
                                    cancelText="Batal"
                                    onClose={handleCancelStatusUpdate}
                                    onRequestClose={handleCancelStatusUpdate}
                                    onCancel={handleCancelStatusUpdate}
                                    onConfirm={handleUpdateStatusAdendum}
                                >
                                    {adendumToUpdateStatus?.status ===
                                    'BELUM_DISETUJUI' ? (
                                        <p>
                                            Apakah Anda yakin ingin menyetujui
                                            adendum ini? Nilai proyek akan
                                            diperbarui sesuai dengan adendum.
                                        </p>
                                    ) : (
                                        <p>
                                            Apakah Anda yakin ingin membatalkan
                                            persetujuan adendum ini? Nilai
                                            proyek akan dikembalikan ke nilai
                                            sebelumnya.
                                        </p>
                                    )}
                                </ConfirmDialog>
                            </AdaptableCard>
                        </Form>
                    )
                }}
            </Formik>
        </Loading>
    )
}
