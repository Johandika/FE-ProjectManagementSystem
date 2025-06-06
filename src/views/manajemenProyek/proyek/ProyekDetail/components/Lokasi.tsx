import React, { useState, useEffect } from 'react'
import { IoLocationSharp } from 'react-icons/io5'
import { HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi'
import classNames from 'classnames'
import isLastChild from '@/utils/isLastChild'
import DescriptionSection from './DesriptionSection'
import reducer, {
    getLokasisByProyek,
    useAppDispatch,
    useAppSelector,
} from '../store'
import { injectReducer } from '@/store'
import { Field, FieldProps, Form, Formik } from 'formik'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import AdaptableCard from '@/components/shared/AdaptableCard'
import { ConfirmDialog, Loading } from '@/components/shared'
import * as Yup from 'yup'
import { Dialog, Notification, toast } from '@/components/ui'
import {
    apiCreateLokasi,
    apiDeleteLokasi,
    apiEditLokasi,
} from '@/services/LokasiService'
import { apiCreateAdendumLokasi } from '@/services/AdendumService'

export interface SetSubmitting {
    (isSubmitting: boolean): void
}

type Lokasi = {
    id: string
    lokasi: string
    latitude: number
    longitude: number
    idProject: string
}

// Form values type
type FormValues = {
    tempLokasi: string
    tempLatitude: string | number
    tempLongitude: string | number
    tempIdProject: string
}

interface AdendumLokasiFormValues {
    idProject?: string
    lokasi_sebelum: string
    lokasi_adendum: string
    latitude_sebelum: string
    latitude_adendum: string
    longitude_sebelum: string
    longitude_adendum: string
}

const AdendumLokasiSchema = Yup.object().shape({
    lokasi_adendum: Yup.string().required('Lokasi adendum wajib diisi'),
    latitude_adendum: Yup.string().required('Latitude adendum wajib diisi'),
    longitude_adendum: Yup.string().required('Longitude adendum wajib diisi'),
})

// Validation schema for the form fields
const validationSchema = Yup.object().shape({
    tempLokasi: Yup.string().required('Nama lokasi harus diisi'),
    tempLatitude: Yup.number()
        .required('Latitude harus diisi')
        .typeError('Latitude harus berupa angka'),
    tempLongitude: Yup.number()
        .required('Longitude harus diisi')
        .typeError('Longitude harus berupa angka'),
})

injectReducer('proyekDetail', reducer)

export default function Lokasi() {
    const [showForm, setShowForm] = useState(false)
    const [editIndex, setEditIndex] = useState<number | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
    const [dialogAdendumLokasiOpen, setDialogAdendumLokasiOpen] =
        useState(false)
    const [adendumLokasiFormInitialValues, setAdendumLokasiFormInitialValues] =
        useState<AdendumLokasiFormValues>({
            lokasi_sebelum: '',
            lokasi_adendum: '',
            latitude_sebelum: '',
            latitude_adendum: '',
            longitude_sebelum: '',
            longitude_adendum: '',
        })

    const dispatch = useAppDispatch()
    const projectId = location.pathname.substring(
        location.pathname.lastIndexOf('/') + 1
    )

    // Get lokasi data from state
    const lokasiData = useAppSelector(
        (state) => state.proyekDetail.data.lokasisByProyekData?.data
    )

    const loading = useAppSelector(
        (state) => state.proyekDetail.data.loadingLokasiProyeks
    )

    // Fetch locations when component mounts
    useEffect(() => {
        const rquestParam = { id: projectId }
        dispatch(getLokasisByProyek(rquestParam))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, projectId])

    // Initialize form values
    const initialValues: FormValues = {
        tempLokasi: '',
        tempLatitude: '',
        tempLongitude: '',
        tempIdProject: projectId || '',
    }

    // Success notification helper
    const popNotification = (keyword: string, adendum?: string) => {
        toast.push(
            <Notification
                title={`Berhasil ${keyword}`}
                type="success"
                duration={2500}
            >
                {adendum
                    ? `${adendum} lokasi berhasil ${keyword}`
                    : `Data  lokasi berhasil ${keyword}`}
            </Notification>,
            {
                placement: 'top-center',
            }
        )
    }

    const handleCloseAdendum = () => {
        setDialogAdendumLokasiOpen(false)
        setAdendumLokasiFormInitialValues({
            lokasi_sebelum: '',
            lokasi_adendum: '',
            latitude_sebelum: '',
            latitude_adendum: '',
            longitude_sebelum: '',
            longitude_adendum: '',
        })
    }

    const handleAdendumLokasiSubmit = async (
        values: AdendumLokasiFormValues,
        { setSubmitting }: { setSubmitting: SetSubmitting }
    ) => {
        setSubmitting(true)

        const processedData = {
            ...values,
            idProject: projectId,
        }

        try {
            let result = await apiCreateAdendumLokasi(processedData)

            if (result && result.data?.statusCode === 201) {
                popNotification('berhasil ditambahkan', 'Adendum')

                setAdendumLokasiFormInitialValues({
                    lokasi_sebelum: '',
                    lokasi_adendum: '',
                    latitude_sebelum: '',
                    latitude_adendum: '',
                    longitude_sebelum: '',
                    longitude_adendum: '',
                })

                setDialogAdendumLokasiOpen(false)

                // Refresh
                dispatch(getLokasisByProyek({ id: projectId }))
            }
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger" duration={2500}>
                    {error
                        ? error.response.data?.message
                        : 'Gagal membuat adendum lokasi'}
                </Notification>,
                { placement: 'top-center' }
            )
        } finally {
            setIsSubmitting(false)
        }
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

                    const handleAddLokasi = () => {
                        setShowForm(true)
                        setEditIndex(null)

                        // Reset temp values
                        setFieldValue('tempLokasi', '')
                        setFieldValue('tempLatitude', '')
                        setFieldValue('tempLongitude', '')
                    }

                    const handleSave = async () => {
                        // Validate fields
                        if (
                            !errors.tempLokasi &&
                            !errors.tempLatitude &&
                            !errors.tempLongitude
                        ) {
                            setIsSubmitting(true)

                            const requestData = {
                                lokasi: values.tempLokasi,
                                latitude: values.tempLatitude,
                                longitude: values.tempLongitude,
                                idProject: values.tempIdProject,
                            }

                            try {
                                let result

                                if (editIndex !== null && lokasiData) {
                                    // Handle edit with API call
                                    const lokasiId = lokasiData[editIndex].id
                                    result = await apiEditLokasi({
                                        id: lokasiId,
                                        ...requestData,
                                    })
                                } else {
                                    // Handle create with API call
                                    result = await apiCreateLokasi(requestData)
                                }

                                setIsSubmitting(false)

                                if (
                                    result &&
                                    result.data?.statusCode >= 200 &&
                                    result.data?.statusCode < 300
                                ) {
                                    // Refresh data
                                    dispatch(
                                        getLokasisByProyek({ id: projectId })
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
                                                ? result.data.message
                                                : 'Gagal menambahkan lokasi'}
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
                                        Terjadi kesalahan saat memproses
                                        permintaan
                                    </Notification>,
                                    { placement: 'top-center' }
                                )
                            }
                        }
                    }

                    // Helper function to reset form fields
                    const resetFormFields = () => {
                        setFieldValue('tempLokasi', '')
                        setFieldValue('tempLatitude', '')
                        setFieldValue('tempLongitude', '')
                    }

                    const handleCancel = () => {
                        setShowForm(false)
                        setEditIndex(null)
                        resetFormFields()
                    }

                    const handleAdendum = (index: number) => {
                        if (lokasiData) {
                            const lokasi = lokasiData[index]
                            setDialogAdendumLokasiOpen(true)

                            setAdendumLokasiFormInitialValues({
                                ...adendumLokasiFormInitialValues,
                                lokasi_sebelum: lokasi.lokasi,
                                latitude_sebelum: lokasi.latitude,
                                longitude_sebelum: lokasi.longitude,
                            })
                            setDialogAdendumLokasiOpen(true)
                        }
                    }

                    // Function to close confirmation dialog
                    const handleCancelDelete = () => {
                        setDialogOpen(false)
                        setDeleteIndex(null)
                    }

                    const handleDelete = async () => {
                        if (deleteIndex !== null && lokasiData) {
                            const lokasiId = lokasiData[deleteIndex]

                            setIsSubmitting(true)
                            try {
                                // Call delete API with location ID
                                const success = await apiDeleteLokasi(lokasiId)

                                if (success) {
                                    // Refresh data after successful delete
                                    dispatch(
                                        getLokasisByProyek({ id: projectId })
                                    )
                                    popNotification('dihapus')
                                }
                            } catch (error) {
                                console.error('Error deleting location:', error)

                                // Show error notification
                                toast.push(
                                    <Notification
                                        title="Error"
                                        type="danger"
                                        duration={2500}
                                    >
                                        Gagal menghapus lokasi
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
                                        title="Informasi Lokasi"
                                        desc="Informasi lokasi proyek"
                                    />
                                    {!showForm && (
                                        <Button
                                            size="sm"
                                            variant="twoTone"
                                            onClick={handleAddLokasi}
                                            className="w-fit text-xs"
                                            type="button"
                                        >
                                            Tambah Lokasi
                                        </Button>
                                    )}
                                </div>

                                {/* Form untuk input lokasi */}
                                {showForm && (
                                    <div className="mb-4 border bg-slate-50 rounded-md p-4">
                                        <h6 className="mb-3">
                                            {editIndex !== null
                                                ? 'Edit Lokasi'
                                                : 'Tambah Lokasi Baru'}
                                        </h6>

                                        <div className="flex flex-col gap-4">
                                            {/* Input Nama Lokasi */}
                                            <FormItem
                                                className="mb-3"
                                                label="Nama Lokasi"
                                                errorMessage={
                                                    errors.tempLokasi &&
                                                    touched.tempLokasi
                                                        ? errors.tempLokasi
                                                        : ''
                                                }
                                                invalid={
                                                    !!(
                                                        errors.tempLokasi &&
                                                        touched.tempLokasi
                                                    )
                                                }
                                            >
                                                <Field
                                                    type="text"
                                                    autoComplete="off"
                                                    name="tempLokasi"
                                                    placeholder="Nama lokasi"
                                                    component={Input}
                                                />
                                            </FormItem>

                                            <div className="grid sm:grid-cols-2 gap-4">
                                                {/* Latitude */}
                                                <FormItem
                                                    className="mb-3"
                                                    label="Latitude"
                                                    errorMessage={
                                                        errors.tempLatitude &&
                                                        touched.tempLatitude
                                                            ? errors.tempLatitude
                                                            : ''
                                                    }
                                                    invalid={
                                                        !!(
                                                            errors.tempLatitude &&
                                                            touched.tempLatitude
                                                        )
                                                    }
                                                >
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name="tempLatitude"
                                                        placeholder="Contoh: -6.2088"
                                                        component={Input}
                                                    />
                                                </FormItem>

                                                {/* Longitude */}
                                                <FormItem
                                                    className="mb-3"
                                                    label="Longitude"
                                                    errorMessage={
                                                        errors.tempLongitude &&
                                                        touched.tempLongitude
                                                            ? errors.tempLongitude
                                                            : ''
                                                    }
                                                    invalid={
                                                        !!(
                                                            errors.tempLongitude &&
                                                            touched.tempLongitude
                                                        )
                                                    }
                                                >
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name="tempLongitude"
                                                        placeholder="Contoh: 106.8456"
                                                        component={Input}
                                                    />
                                                </FormItem>
                                            </div>
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
                                    </div>
                                )}

                                {/* Daftar lokasi */}
                                {lokasiData && lokasiData.length > 0 ? (
                                    <div className="rounded-lg border border-gray-200 dark:border-gray-600">
                                        {lokasiData.map(
                                            (data: any, index: number) => {
                                                // If currently editing this item, don't show it in the list
                                                if (editIndex === index) {
                                                    return null
                                                }

                                                return (
                                                    <div
                                                        key={data.id}
                                                        className={classNames(
                                                            'flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-6 gap-4 sm:gap-0',
                                                            !isLastChild(
                                                                lokasiData,
                                                                index
                                                            ) &&
                                                                'border-b border-gray-200 dark:border-gray-600'
                                                        )}
                                                    >
                                                        <a
                                                            href={`https://www.google.com/maps?q=${data.latitude},${data.longitude}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center group flex-grow"
                                                        >
                                                            <div className="text-3xl">
                                                                <IoLocationSharp className="group-hover:text-blue-600 transition" />
                                                            </div>
                                                            <div className="ml-3 rtl:mr-3">
                                                                <div className="flex items-center">
                                                                    <div className="text-gray-900 dark:text-gray-100 font-semibold">
                                                                        {
                                                                            data.lokasi
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <span>
                                                                    lat:{' '}
                                                                    {
                                                                        data.latitude
                                                                    }
                                                                    , long:{' '}
                                                                    {
                                                                        data.longitude
                                                                    }
                                                                </span>
                                                            </div>
                                                        </a>

                                                        <div className="flex space-x-2">
                                                            <Button
                                                                type="button"
                                                                shape="circle"
                                                                variant="twoTone"
                                                                size="sm"
                                                                className="text-indigo-500"
                                                                onClick={() =>
                                                                    handleAdendum(
                                                                        index
                                                                    )
                                                                }
                                                            >
                                                                Adendum Lokasi
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        Belum ada data lokasi. Klik 'Tambah
                                        Lokasi' untuk menambahkan.
                                    </div>
                                )}
                            </AdaptableCard>

                            {/* Dialog Konfirmasi Hapus */}
                            <ConfirmDialog
                                isOpen={dialogOpen}
                                type="danger"
                                title="Hapus Lokasi"
                                confirmButtonColor="red-600"
                                onClose={handleCancelDelete}
                                onRequestClose={handleCancelDelete}
                                onCancel={handleCancelDelete}
                                onConfirm={handleDelete}
                            >
                                <p>
                                    Apakah kamu yakin ingin menghapus lokasi
                                    ini?
                                </p>
                            </ConfirmDialog>
                        </Form>
                    )
                }}
            </Formik>
            {/* Form Adendum Nilai Kontrak*/}
            <Formik
                initialValues={adendumLokasiFormInitialValues}
                validationSchema={AdendumLokasiSchema}
                enableReinitialize={true}
                onSubmit={handleAdendumLokasiSubmit}
            >
                {({ errors, touched, isSubmitting, values, setFieldValue }) => (
                    <>
                        <Dialog
                            isOpen={dialogAdendumLokasiOpen}
                            onClose={handleCloseAdendum}
                            onRequestClose={handleCloseAdendum}
                        >
                            <Form>
                                <h5 className="mb-4">Adendum Lokasi</h5>
                                <div className="overflow-auto ">
                                    <div className="max-h-[400px] ">
                                        {/* Lokasi Sebelum dan Sesudah*/}
                                        <div className="flex flex-col sm:flex-row gap0 sm:gap-4 ">
                                            <FormItem
                                                label="Lokasi Sebelum"
                                                invalid={
                                                    (errors.lokasi_sebelum &&
                                                        touched.lokasi_sebelum) as boolean
                                                }
                                                errorMessage={
                                                    errors.lokasi_sebelum
                                                }
                                                className="w-full"
                                            >
                                                <Field
                                                    disabled
                                                    type="text"
                                                    autoComplete="off"
                                                    name="lokasi_sebelum"
                                                    placeholder="Nama Lokasi"
                                                    component={Input}
                                                />
                                            </FormItem>
                                            <FormItem
                                                label="Lokasi Adendum"
                                                invalid={
                                                    (errors.lokasi_adendum &&
                                                        touched.lokasi_adendum) as boolean
                                                }
                                                errorMessage={
                                                    errors.lokasi_adendum
                                                }
                                                className="w-full"
                                            >
                                                <Field
                                                    type="text"
                                                    autoComplete="off"
                                                    name="lokasi_adendum"
                                                    placeholder="Nama Lokasi"
                                                    component={Input}
                                                />
                                            </FormItem>
                                        </div>

                                        {/* Longitude Sebelum dan Sesudah*/}
                                        <div className="flex flex-col sm:flex-row gap0 sm:gap-4 ">
                                            <FormItem
                                                label="Longitude Sebelum"
                                                invalid={
                                                    (errors.lokasi_sebelum &&
                                                        touched.lokasi_sebelum) as boolean
                                                }
                                                errorMessage={
                                                    errors.lokasi_sebelum
                                                }
                                                className="w-full"
                                            >
                                                <Field
                                                    disabled
                                                    type="text"
                                                    autoComplete="off"
                                                    name="longitude_sebelum"
                                                    placeholder="Contoh: -6.2088"
                                                    component={Input}
                                                />
                                            </FormItem>
                                            <FormItem
                                                label="Longitude Adendum"
                                                invalid={
                                                    (errors.longitude_adendum &&
                                                        touched.longitude_adendum) as boolean
                                                }
                                                errorMessage={
                                                    errors.longitude_adendum
                                                }
                                                className="w-full"
                                            >
                                                <Field
                                                    type="text"
                                                    autoComplete="off"
                                                    name="longitude_adendum"
                                                    placeholder="Contoh: 106.8456"
                                                    component={Input}
                                                />
                                            </FormItem>
                                        </div>

                                        {/* Latitude Sebelum dan Sesudah*/}
                                        <div className="flex flex-col sm:flex-row  gap0 sm:gap-4 ">
                                            <FormItem
                                                label="Latitude Sebelum"
                                                invalid={
                                                    (errors.latitude_sebelum &&
                                                        touched.latitude_sebelum) as boolean
                                                }
                                                errorMessage={
                                                    errors.latitude_sebelum
                                                }
                                                className="w-full"
                                            >
                                                <Field
                                                    disabled
                                                    type="text"
                                                    autoComplete="off"
                                                    name="latitude_sebelum"
                                                    placeholder="Contoh: -6.2088"
                                                    component={Input}
                                                />
                                            </FormItem>
                                            <FormItem
                                                label="Latitude Adendum"
                                                invalid={
                                                    (errors.latitude_adendum &&
                                                        touched.latitude_adendum) as boolean
                                                }
                                                errorMessage={
                                                    errors.latitude_adendum
                                                }
                                                className="w-full"
                                            >
                                                <Field
                                                    type="text"
                                                    autoComplete="off"
                                                    name="latitude_adendum"
                                                    placeholder="Contoh: 106.8456"
                                                    component={Input}
                                                />
                                            </FormItem>
                                        </div>
                                    </div>
                                </div>

                                {/* Button Dialog Option */}
                                <div className="text-right mt-6">
                                    <Button
                                        className="ltr:mr-2 rtl:ml-2"
                                        variant="plain"
                                        type="button"
                                        disabled={isSubmitting}
                                        onClick={handleCloseAdendum}
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
        </Loading>
    )
}
