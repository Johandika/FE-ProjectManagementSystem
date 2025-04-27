import React, { useState, useEffect } from 'react'
import { Field, FieldProps, Form, Formik } from 'formik'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi'
import AdaptableCard from '@/components/shared/AdaptableCard'
import { ConfirmDialog, Loading } from '@/components/shared'
import * as Yup from 'yup'
import {
    apiCreatePurchaseOrder,
    apiPutPurchaseOrder,
} from '@/services/PurchaseOrderService'
import {
    deletePurchase,
    getPurchaseByProyek,
    useAppDispatch,
    useAppSelector,
} from '../../ProyekEdit/store'
import { formatDate } from '@/utils/formatDate'
import { DatePicker, Notification, toast } from '@/components/ui'
import dayjs from 'dayjs'

// Import the utility function for number extraction
export const extractNumberFromString = (
    value: string | number | undefined
): number => {
    // Jika undefined atau null, kembalikan 0
    if (value === undefined || value === null) {
        return 0
    }

    // Jika sudah number, langsung kembalikan
    if (typeof value === 'number') {
        return value
    }

    // Konversi ke string untuk memastikan
    const strValue = String(value)

    // Hapus semua karakter non-numerik kecuali titik dan koma
    // Ganti koma dengan titik untuk format desimal standar
    const cleanedValue = strValue
        .replace(/[^\d.,]/g, '') // Hapus semua kecuali angka, titik, dan koma
        .replace(/\./g, '') // Hapus titik (pemisah ribuan)
        .replace(/,/g, '.') // Ganti koma dengan titik (untuk desimal)

    // Konversi ke number
    const result = parseFloat(cleanedValue)

    // Jika NaN, kembalikan 0
    return isNaN(result) ? 0 : result
}

// Utility function to format numbers to Indonesia locale
const formatCurrency = (value: number | string): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(numValue)) return ''
    return numValue.toLocaleString('id-ID')
}

// Define types for your PO data
type PurchaseOrder = {
    id: string
    nomor_po: string
    nama: string
    tanggal_po: string
    pabrik: string
    harga: number
    status: string
    estimasi_pengerjaan: number
    idProject: string
    createdAt: string
    updatedAt: string
}

// Create request format
type CreatePurchaseOrderRequest = {
    pabrik: string
    harga: number
    estimasi_pengerjaan: number
    idProject: string
}

// Update request format
type UpdatePurchaseOrderRequest = {
    id: string
    pabrik: string
    harga: number
    estimasi_pengerjaan: number
}

// Form values type
type FormValues = {
    purchases: PurchaseOrder[]
    tempPabrik: string
    tempHarga: number | string
    tempEstimasi: number | string
    tempIdProject: string
    tempTanggalPo: string
    tempStatus: string
    tempNomorPo: string
    tempNama: string
}

// Validation schema for the form fields
const validationSchema = Yup.object().shape({
    tempPabrik: Yup.string().required('Pabrik harus diisi'),
    tempNama: Yup.string().required('Nama harus diisi'),
    tempNomorPo: Yup.string().required('Nomor PO harus diisi'),
    tempHarga: Yup.string()
        .required('Harga harus diisi')
        .test('min-value', 'Harga minimal 1', function (value) {
            const numValue = extractNumberFromString(value)
            return numValue >= 1
        }),
    tempEstimasi: Yup.number()
        .required('Estimasi pengerjaan harus diisi')
        .min(1, 'Estimasi minimal 1 hari'),
    tempIdProject: Yup.string().required('ID Project harus diisi'),
    tempTanggalPo: Yup.string().required('Tanggal PO harus diisi'),
})

const PurchaseOrder = () => {
    const [showForm, setShowForm] = useState(false)
    const [editIndex, setEditIndex] = useState<number | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const projectId = location.pathname.substring(
        location.pathname.lastIndexOf('/') + 1
    )
    const dispatch = useAppDispatch()
    const { purchaseOrdersData, loadingPurchaseOrders } = useAppSelector(
        (state) => state.proyekEdit.data
    )
    const [dialogOpen, setDialogOpen] = useState(false)
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null)

    const popNotification = (keyword: string) => {
        toast.push(
            <Notification
                title={`Successfuly ${keyword}`}
                type="success"
                duration={2500}
            >
                Faktur successfuly {keyword}
            </Notification>,
            {
                placement: 'top-center',
            }
        )
    }

    // Fetch purchase orders when component mounts
    useEffect(() => {
        if (projectId) {
            dispatch(getPurchaseByProyek({ id: projectId }))
        }
    }, [dispatch, projectId])

    // Function to create a new purchase order
    const createPurchaseOrder = async (data: CreatePurchaseOrderRequest) => {
        setIsSubmitting(true)

        try {
            await apiCreatePurchaseOrder({
                ...data,
                // Ensure numeric values
                harga: Number(data.harga),
                estimasi_pengerjaan: Number(data.estimasi_pengerjaan),
            })

            // Refresh the purchase orders data
            if (projectId) {
                dispatch(getPurchaseByProyek({ id: projectId }))
            }
            return true
        } catch (error) {
            console.error('Error creating purchase order:', error)
            return false
        } finally {
            setIsSubmitting(false)
        }
    }

    // Function to update an existing purchase order
    const updatePurchaseOrder = async (data: UpdatePurchaseOrderRequest) => {
        setIsSubmitting(true)

        try {
            await apiPutPurchaseOrder({
                ...data,
                // Ensure numeric values
                harga: Number(data.harga),
                estimasi_pengerjaan: Number(data.estimasi_pengerjaan),
            })

            // Refresh the purchase orders data
            if (projectId) {
                dispatch(getPurchaseByProyek({ id: projectId }))
            }
            return true
        } catch (error) {
            console.error('Error updating purchase order:', error)
            return false
        } finally {
            setIsSubmitting(false)
        }
    }

    // Initialize form values
    const initialValues: FormValues = {
        purchases: purchaseOrdersData || [],
        tempPabrik: '',
        tempNomorPo: '',
        tempNama: '',
        tempHarga: '',
        tempEstimasi: '',
        tempIdProject: projectId || '',
        tempTanggalPo: '',
        tempStatus: '',
    }

    return (
        <Loading loading={loadingPurchaseOrders || isSubmitting}>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={() => {
                    // Form submission is handled by save button
                }}
            >
                {(formikProps) => {
                    const {
                        values,
                        errors,
                        touched,
                        setFieldValue,
                        validateField,
                    } = formikProps

                    const handleAddPurchase = () => {
                        setShowForm(true)
                        setEditIndex(null)

                        // Reset temp values
                        setFieldValue('tempPabrik', '')
                        setFieldValue('tempHarga', '')
                        setFieldValue('tempEstimasi', '')
                        setFieldValue('tempNomorPo', '')
                        setFieldValue('tempTanggalPo', '')
                        setFieldValue('tempNama', '')
                    }

                    const handleSave = async () => {
                        // Validate fields first
                        await validateField('tempPabrik')
                        await validateField('tempHarga')
                        await validateField('tempEstimasi')
                        await validateField('tempNomorPo')
                        await validateField('tempNama')
                        await validateField('tempTanggalPo')

                        if (
                            !errors.tempPabrik &&
                            !errors.tempHarga &&
                            !errors.tempNomorPo &&
                            !errors.tempNama &&
                            !errors.tempTanggalPo &&
                            !errors.tempEstimasi
                        ) {
                            setIsSubmitting(true)

                            const requestData = {
                                pabrik: values.tempPabrik,
                                // Extract actual numeric value from formatted string
                                harga: extractNumberFromString(
                                    values.tempHarga
                                ),
                                estimasi_pengerjaan: Number(
                                    values.tempEstimasi
                                ),
                                idProject: values.tempIdProject,
                                nomor_po: values.tempNomorPo,
                                nama: values.tempNama,
                                tanggal_po: values.tempTanggalPo,
                            }

                            try {
                                let result

                                if (editIndex !== null && purchaseOrdersData) {
                                    // Handle edit with API call
                                    const purchaseId =
                                        purchaseOrdersData[editIndex].id
                                    // Your existing update code
                                    result = await apiPutPurchaseOrder({
                                        id: purchaseId,
                                        ...requestData,
                                    })
                                } else {
                                    // Handle create with API call
                                    result = await apiCreatePurchaseOrder(
                                        requestData
                                    )
                                }

                                setIsSubmitting(false)

                                console.log('result1', result)
                                if (
                                    result &&
                                    result.data.statusCode >= 200 &&
                                    result.data.statusCode < 300
                                ) {
                                    console.log('result2', result)
                                    // Refresh data
                                    dispatch(
                                        getPurchaseByProyek({ id: projectId })
                                    )

                                    // Show success notification
                                    toast.push(
                                        <Notification
                                            title="Purchase Order added"
                                            type="success"
                                            duration={2500}
                                        >
                                            Purchase Order berhasil ditambahkan
                                        </Notification>,
                                        { placement: 'top-center' }
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
                                                ? result.message
                                                : 'Failed to add purchase order'}
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
                        setFieldValue('tempPabrik', '')
                        setFieldValue('tempHarga', '')
                        setFieldValue('tempEstimasi', '')
                        setFieldValue('tempNomorPo', '')
                        setFieldValue('tempNama', '')
                        setFieldValue('tempTanggalPo', '')
                    }

                    const handleCancel = () => {
                        setShowForm(false)
                        setEditIndex(null)

                        // Reset temp values
                        setFieldValue('tempPabrik', '')
                        setFieldValue('tempHarga', '')
                        setFieldValue('tempEstimasi', '')
                        setFieldValue('tempNomorPo', '')
                        setFieldValue('tempNama', '')
                        setFieldValue('tempTanggalPo', '')
                    }

                    const handleEdit = (index: number) => {
                        if (purchaseOrdersData) {
                            const purchase = purchaseOrdersData[index]

                            // Set temporary values for editing
                            setFieldValue('tempPabrik', purchase.pabrik)
                            // Format the price number for display
                            setFieldValue(
                                'tempHarga',
                                formatCurrency(purchase.harga)
                            )
                            setFieldValue(
                                'tempEstimasi',
                                purchase.estimasi_pengerjaan
                            )
                            setFieldValue('tempIdProject', purchase.idProject)
                            setFieldValue('tempNomorPo', purchase.nomor_po)
                            setFieldValue('tempNama', purchase.nama)
                            setFieldValue('tempTanggalPo', purchase.tanggal_po)

                            setEditIndex(index)
                            setShowForm(true)
                        }
                    }

                    // Handle price input formatting
                    const handlePriceChange = (
                        e: React.ChangeEvent<HTMLInputElement>
                    ) => {
                        const value = e.target.value

                        // Extract numeric value
                        const numericValue = extractNumberFromString(value)

                        // Format the value
                        const formattedValue = formatCurrency(numericValue)

                        // Update the field with the formatted value
                        setFieldValue('tempHarga', formattedValue)
                    }

                    // Fungsi untuk membuka dialog konfirmasi
                    const handleConfirmDelete = (index: number) => {
                        setDeleteIndex(index)
                        setDialogOpen(true)
                    }

                    // Fungsi untuk menutup dialog konfirmasi
                    const handleCancelDelete = () => {
                        setDialogOpen(false)
                        setDeleteIndex(null)
                    }

                    const handleDelete = async () => {
                        if (deleteIndex !== null && purchaseOrdersData) {
                            const purchaseId =
                                purchaseOrdersData[deleteIndex].id

                            setIsSubmitting(true)
                            try {
                                // Memanggil API delete dengan ID PO
                                const success = await deletePurchase({
                                    id: purchaseId,
                                })

                                if (success) {
                                    // Refresh data setelah delete berhasil
                                    dispatch(
                                        getPurchaseByProyek({ id: projectId })
                                    )
                                    popNotification('deleted')
                                }
                            } catch (error) {
                                console.error(
                                    'Error deleting purchase order:',
                                    error
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
                            <AdaptableCard divider className="mb-4">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h5>Purchase Order</h5>
                                        <p className="mb-0">
                                            Tambahkan data purchase order
                                        </p>
                                    </div>
                                    {!showForm && (
                                        <Button
                                            size="sm"
                                            variant="twoTone"
                                            onClick={handleAddPurchase}
                                            className="w-fit text-xs"
                                            type="button"
                                        >
                                            Tambah Purchase Order
                                        </Button>
                                    )}
                                </div>

                                {/* Form untuk input purchase order */}
                                {showForm && (
                                    <div className="mb-4 border bg-slate-50 rounded-md p-4">
                                        <h6 className="mb-3">
                                            {editIndex !== null
                                                ? 'Edit Purchase Order'
                                                : 'Tambah Purchase Order Baru'}
                                        </h6>

                                        <div className="grid grid-cols-2 gap-4">
                                            {/* Edit Nomor PO */}
                                            <FormItem
                                                className="mb-3"
                                                label="Nomor PO"
                                                errorMessage={
                                                    errors.tempNomorPo &&
                                                    touched.tempNomorPo
                                                        ? errors.tempNomorPo
                                                        : ''
                                                }
                                                invalid={
                                                    !!(
                                                        errors.tempNomorPo &&
                                                        touched.tempNomorPo
                                                    )
                                                }
                                            >
                                                <Field
                                                    type="text"
                                                    autoComplete="off"
                                                    name="tempNomorPo"
                                                    placeholder="Nomor PO"
                                                    component={Input}
                                                />
                                            </FormItem>

                                            {/* Edit Nama*/}
                                            <FormItem
                                                className="mb-3"
                                                label="Nama"
                                                errorMessage={
                                                    errors.tempNama &&
                                                    touched.tempNama
                                                        ? errors.tempNama
                                                        : ''
                                                }
                                                invalid={
                                                    !!(
                                                        errors.tempNama &&
                                                        touched.tempNama
                                                    )
                                                }
                                            >
                                                <Field
                                                    type="text"
                                                    autoComplete="off"
                                                    name="tempNama"
                                                    placeholder="Nama"
                                                    component={Input}
                                                />
                                            </FormItem>

                                            {/* Edit Pabrik*/}
                                            <FormItem
                                                className="mb-3"
                                                label="Pabrik"
                                                errorMessage={
                                                    errors.tempPabrik &&
                                                    touched.tempPabrik
                                                        ? errors.tempPabrik
                                                        : ''
                                                }
                                                invalid={
                                                    !!(
                                                        errors.tempPabrik &&
                                                        touched.tempPabrik
                                                    )
                                                }
                                            >
                                                <Field
                                                    type="text"
                                                    autoComplete="off"
                                                    name="tempPabrik"
                                                    placeholder="Nama pabrik"
                                                    component={Input}
                                                />
                                            </FormItem>

                                            {/* Edit Tanggal PO */}
                                            <FormItem
                                                label="Tanggal PO"
                                                invalid={
                                                    (errors.tempTanggalPo &&
                                                        touched.tempTanggalPo) as boolean
                                                }
                                                errorMessage={
                                                    errors.tempTanggalPo
                                                }
                                            >
                                                <Field name="tempTanggalPo">
                                                    {({
                                                        field,
                                                        form,
                                                    }: FieldProps) => (
                                                        <DatePicker
                                                            placeholder="Pilih Tanggal"
                                                            value={
                                                                field.value
                                                                    ? new Date(
                                                                          field.value
                                                                      )
                                                                    : null
                                                            }
                                                            inputFormat="DD-MM-YYYY"
                                                            onChange={(
                                                                date
                                                            ) => {
                                                                const formattedDate =
                                                                    date
                                                                        ? dayjs(
                                                                              date
                                                                          ).format(
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

                                            {/* Edit Harga - Modified for formatting */}
                                            <FormItem
                                                className="mb-3"
                                                label="Harga"
                                                errorMessage={
                                                    errors.tempHarga &&
                                                    touched.tempHarga
                                                        ? errors.tempHarga
                                                        : ''
                                                }
                                                invalid={
                                                    !!(
                                                        errors.tempHarga &&
                                                        touched.tempHarga
                                                    )
                                                }
                                            >
                                                <Field name="tempHarga">
                                                    {({
                                                        field,
                                                    }: FieldProps) => (
                                                        <Input
                                                            type="text"
                                                            autoComplete="off"
                                                            placeholder="Harga"
                                                            {...field}
                                                            value={field.value}
                                                            onChange={(e) =>
                                                                handlePriceChange(
                                                                    e
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </Field>
                                            </FormItem>

                                            {/* Edit Estimasi Pengerjaan*/}
                                            <FormItem
                                                className="mb-3"
                                                label="Estimasi Pengerjaan (hari)"
                                                errorMessage={
                                                    errors.tempEstimasi &&
                                                    touched.tempEstimasi
                                                        ? errors.tempEstimasi
                                                        : ''
                                                }
                                                invalid={
                                                    !!(
                                                        errors.tempEstimasi &&
                                                        touched.tempEstimasi
                                                    )
                                                }
                                            >
                                                <Field
                                                    type="number"
                                                    autoComplete="off"
                                                    name="tempEstimasi"
                                                    placeholder="Estimasi dalam hari"
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
                                    </div>
                                )}

                                {/* Daftar purchase order */}
                                {purchaseOrdersData &&
                                    purchaseOrdersData.map(
                                        (purchase, index) => {
                                            // If currently editing this item, don't show it in the list
                                            if (editIndex === index) {
                                                return null
                                            }

                                            return (
                                                <div
                                                    key={purchase.id}
                                                    className="mb-4 border bg-slate-50 rounded-md p-4"
                                                >
                                                    <div className="flex justify-between items-center mb-2">
                                                        <h6>
                                                            {purchase.pabrik}
                                                        </h6>
                                                        <div className="flex space-x-2">
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
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <span className="text-xs font-bold text-gray-500">
                                                                Nomor PO:
                                                            </span>
                                                            <p>
                                                                {
                                                                    purchase.nomor_po
                                                                }
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs font-bold text-gray-500">
                                                                Nama:
                                                            </span>
                                                            <p>
                                                                {purchase.nama}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs font-bold text-gray-500">
                                                                Harga:
                                                            </span>
                                                            <p>
                                                                Rp{' '}
                                                                {purchase.harga.toLocaleString(
                                                                    'id-ID'
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs font-bold text-gray-500">
                                                                Estimasi
                                                                Pengerjaan:
                                                            </span>
                                                            <p>
                                                                {
                                                                    purchase.estimasi_pengerjaan
                                                                }{' '}
                                                                hari
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs font-bold text-gray-500">
                                                                Status:
                                                            </span>
                                                            <p>
                                                                {
                                                                    purchase.status
                                                                }
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs font-bold text-gray-500">
                                                                Tanggal PO:
                                                            </span>
                                                            <p>
                                                                {formatDate(
                                                                    purchase.tanggal_po
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    )}

                                {(!purchaseOrdersData ||
                                    purchaseOrdersData.length === 0) &&
                                    !showForm && (
                                        <div className="text-center py-8 text-gray-500">
                                            Belum ada data purchase order. Klik
                                            'Tambah Purchase Order' untuk
                                            menambahkan.
                                        </div>
                                    )}
                            </AdaptableCard>
                            {/* Dialog Konfirmasi Hapus */}
                            <ConfirmDialog
                                isOpen={dialogOpen}
                                type="danger"
                                title="Hapus Purchase Order"
                                confirmButtonColor="red-600"
                                onClose={handleCancelDelete}
                                onRequestClose={handleCancelDelete}
                                onCancel={handleCancelDelete}
                                onConfirm={handleDelete}
                            >
                                Apakah Anda yakin ingin menghapus purchase order
                                ini?
                            </ConfirmDialog>
                        </Form>
                    )
                }}
            </Formik>
        </Loading>
    )
}

export default PurchaseOrder
