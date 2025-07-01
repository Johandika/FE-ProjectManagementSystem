import React, { useState, useEffect } from 'react'
import { Field, FieldProps, Form, Formik } from 'formik'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { HiOutlineTrash, HiOutlinePencil, HiPlusCircle } from 'react-icons/hi'
import AdaptableCard from '@/components/shared/AdaptableCard'
import { ConfirmDialog, Loading } from '@/components/shared'
import * as Yup from 'yup'
import {
    apiCreatePurchaseOrder,
    apiPutPurchaseOrder,
    apiCreateDetailPurchase,
    apiUpdateDetailPurchase,
    apiDeleteDetailPurchaseOrder,
    apiUpdateStatusKirimPurchase,
    apiUpdateStatusLunasPurchase,
    apiUpdateStatusSampaiPurchase,
} from '@/services/PurchaseOrderService'
import {
    deletePurchase,
    getPurchaseByProyek,
    useAppDispatch,
    useAppSelector,
} from '../../ProyekEdit/store'
import { formatDate } from '@/utils/formatDate'
import {
    DatePicker,
    Notification,
    Select,
    Switcher,
    toast,
} from '@/components/ui'
import dayjs from 'dayjs'
import { NumericFormat } from 'react-number-format'
import { extractNumberFromString } from '@/utils/extractNumberFromString'
import DescriptionSection from './DesriptionSection'

// Added a comment to force refresh

// Define types for your PO data structure according to the new API response
type DetailPurchase = {
    id: string
    nama_barang: string
    harga: number
    estimasi_delivery: number
    idPurchase: string
    createdAt: string
    updatedAt: string
}

type PurchaseOrder = {
    id: string
    nomor_po: string
    tanggal_po: string
    pabrik: string
    status: string
    idProject: string
    createdAt: string
    updatedAt: string
    DetailPurchases: DetailPurchase[]
    // tambah
    tanggal_uang_muka: string
    uang_muka: string
    status_lunas: boolean
    status_dikirim: boolean
    status_sampai: boolean
    keterangan_barang: string
}

// Type for detail item in the form
type DetailItem = {
    id?: string
    nama_barang: string
    harga: number | string
    estimasi_delivery: number | string
}

// Form values type
type FormValues = {
    purchases: PurchaseOrder[]
    tempPabrik: string
    tempIdProject: string
    tempTanggalPo: string
    tempStatus: string
    tempNomorPo: string
    tempDetails: DetailItem[]
    //tmbh
    tempTanggalUangMuka: string
    tempUangMuka: number
    tempStatusLunas: boolean
    tempStatusDikirim: boolean
    tempStatusSampai: boolean
    tempKeteranganBarang: string
}

// Validation schema for the form fields
const validationSchema = Yup.object().shape({
    tempPabrik: Yup.string().required('Pabrik harus diisi'),
    tempNomorPo: Yup.string().required('Nomor PO harus diisi'),
    tempTanggalPo: Yup.string().required('Tanggal PO harus diisi'),
    tempDetails: Yup.array()
        .of(
            Yup.object().shape({
                nama_barang: Yup.string().required('Nama barang harus diisi'),
                harga: Yup.string().required('Harga harus diisi'),
                estimasi_delivery: Yup.string().required(
                    'Estimasi pengerjaan harus diisi'
                ),
            })
        )
        .min(1, 'Minimal satu detail barang harus diisi'),
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
    const [detailDialogOpen, setDetailDialogOpen] = useState(false)
    const [deleteDetailId, setDeleteDetailId] = useState<
        string | number | null
    >(null)
    // ... state lainnya
    const [statusChangeInfo, setStatusChangeInfo] = useState<{
        purchaseId: string
        statusKey: 'status_lunas' | 'status_dikirim' | 'status_sampai'
        newStatus: boolean
        label: string // Untuk menampilkan di dialog
    } | null>(null)

    const [isStatusChangeDialogOpen, setIsStatusChangeDialogOpen] =
        useState(false)

    const popNotification = (keyword: string) => {
        toast.push(
            <Notification
                title={`Successfully ${keyword}`}
                type="success"
                duration={2500}
            >
                Purchase Order successfully {keyword}
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

    // const handleStatusChange = (
    //     purchase: PurchaseOrder,
    //     statusKey: 'status_sampai' | 'status_lunas' | 'status_dikirim'
    // ) => {
    //     console.log(!purchase[statusKey])
    //     // Abaikan nilai dari Switcher, kita hitung sendiri nilai barunya
    //     const newStatus = !purchase[statusKey]

    //     // Membuat teks yang lebih deskriptif untuk dialog
    //     let statusLabel = ''
    //     if (statusKey === 'status_lunas') statusLabel = 'Lunas'
    //     if (statusKey === 'status_dikirim') statusLabel = 'Dikirim'
    //     if (statusKey === 'status_sampai') statusLabel = 'Sampai'

    //     // console.log('puurchase', {
    //     //     purchaseId: purchase.id,
    //     //     statusKey: statusKey,
    //     //     newStatus: newStatus,
    //     //     label: `status ${statusLabel} untuk PO "${purchase.nomor_po}"`,
    //     // })

    //     // Simpan semua info yang dibutuhkan untuk konfirmasi
    //     setStatusChangeInfo({
    //         purchaseId: purchase.id,
    //         statusKey: statusKey,
    //         newStatus: newStatus,
    //         label: `status ${statusLabel} untuk PO "${purchase.nomor_po}"`,
    //     })
    //     setIsStatusChangeDialogOpen(true)
    // }

    // Fungsi ini akan dipanggil saat pengguna klik "Confirm"
    // const confirmStatusChange = async () => {
    //     if (!statusChangeInfo) return

    //     const { purchaseId, statusKey, newStatus } = statusChangeInfo
    //     let apiCall
    //     // Tentukan API mana yang akan dipanggil berdasarkan statusKey
    //     switch (statusKey) {
    //         case 'status_lunas':
    //             apiCall = apiUpdateStatusLunasPurchase
    //             break
    //         case 'status_dikirim':
    //             apiCall = apiUpdateStatusKirimPurchase
    //             break
    //         case 'status_sampai':
    //             apiCall = apiUpdateStatusSampaiPurchase
    //             break
    //         default:
    //             return
    //     }

    //     setIsSubmitting(true)
    //     try {
    //         await apiCall({ id: purchaseId, [statusKey]: newStatus })
    //         popNotification(`Status berhasil diubah`)
    //         dispatch(getPurchaseByProyek({ id: projectId }))
    //     } catch (error) {
    //         console.error(`Error updating ${statusKey}:`, error)
    //         toast.push(
    //             <Notification title="Error" type="danger">
    //                 Gagal memperbarui status.
    //             </Notification>
    //         )
    //     } finally {
    //         setIsSubmitting(false)
    //         setIsStatusChangeDialogOpen(false)
    //         setStatusChangeInfo(null)
    //     }
    // }

    // Fungsi untuk menutup dialog jika dibatalkan
    const cancelStatusChange = () => {
        setIsStatusChangeDialogOpen(false)
        setStatusChangeInfo(null)
    }

    // Initialize form values with empty details array
    const initialValues: FormValues = {
        purchases: purchaseOrdersData || [],
        tempPabrik: '',
        tempNomorPo: '',
        tempTanggalPo: '',
        tempIdProject: projectId || '',
        tempStatus: '',
        tempDetails: [{ nama_barang: '', harga: '', estimasi_delivery: '' }],
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
                        setFieldValue('tempNomorPo', '')
                        setFieldValue('tempTanggalPo', '')
                        setFieldValue('tempUangMuka', '')
                        setFieldValue('tempTanggalUangMuka', '')
                        setFieldValue('tempStatusLunas', false)
                        setFieldValue('tempStatusDikirim', false)
                        setFieldValue('tempStatusSampai', false)
                        setFieldValue('tempKeteranganBarang', '')
                        setFieldValue('tempDetails', [
                            {
                                nama_barang: '',
                                harga: '',
                                estimasi_delivery: '',
                            },
                        ])
                    }

                    // Add a new detail item to the form
                    const handleAddDetail = () => {
                        const currentDetails = [...values.tempDetails]
                        currentDetails.push({
                            nama_barang: '',
                            harga: '',
                            estimasi_delivery: '',
                        })
                        setFieldValue('tempDetails', currentDetails)
                    }

                    // confirmasi
                    const handleRemoveDetail = (
                        idDetailPurchase: string | number
                    ) => {
                        setDeleteDetailId(idDetailPurchase)
                        setDetailDialogOpen(true)
                    }

                    // Remove a detail item from the form
                    const handleConfirmDeleteDetail = async () => {
                        if (deleteDetailId !== null) {
                            setIsSubmitting(true)
                            const data = { id: deleteDetailId }
                            try {
                                const success =
                                    await apiDeleteDetailPurchaseOrder(data)

                                if (success) {
                                    // Refresh data setelah delete berhasil
                                    dispatch(
                                        getPurchaseByProyek({ id: projectId })
                                    )
                                    popNotification('deleted')
                                }
                            } catch (error) {
                                console.error(
                                    'Error deleting detail purchase:',
                                    error
                                )

                                // Show error notification
                                toast.push(
                                    <Notification
                                        title="Error"
                                        type="danger"
                                        duration={2500}
                                    >
                                        {error.response?.data?.message ||
                                            'Gagal menghapus detail purchase'}
                                    </Notification>,
                                    { placement: 'top-center' }
                                )
                            } finally {
                                setIsSubmitting(false)
                                setDetailDialogOpen(false)
                                setDeleteDetailId(null)
                            }
                        }
                    }

                    const handleSave = async () => {
                        // Validate all fields first
                        try {
                            await validateField('tempPabrik')
                            await validateField('tempNomorPo')
                            await validateField('tempTanggalPo')
                            await validateField('tempDetails')

                            if (
                                !errors.tempPabrik &&
                                !errors.tempNomorPo &&
                                !errors.tempTanggalPo &&
                                !errors.tempDetails
                            ) {
                                setIsSubmitting(true)

                                // Process detail items
                                const detailItems = values.tempDetails.map(
                                    (item) => ({
                                        nama_barang: item.nama_barang,
                                        harga: extractNumberFromString(
                                            item.harga
                                        ),
                                        estimasi_delivery:
                                            extractNumberFromString(
                                                item.estimasi_delivery
                                            ),
                                    })
                                )

                                try {
                                    let result

                                    if (
                                        editIndex !== null &&
                                        purchaseOrdersData
                                    ) {
                                        // Handle edit with API call
                                        const purchaseId =
                                            purchaseOrdersData[editIndex].id
                                        console.log(
                                            'tanggalPO',
                                            values.tempTanggalPo
                                        )
                                        console.log(
                                            'tempTanggalUangMuka',
                                            values.tempTanggalUangMuka
                                        )
                                        // Update main purchase order
                                        result = await apiPutPurchaseOrder({
                                            id: purchaseId,
                                            nomor_po: values.tempNomorPo,
                                            tanggal_po: values.tempTanggalPo,
                                            uang_muka: extractNumberFromString(
                                                values.tempUangMuka
                                            ),
                                            tanggal_uang_muka:
                                                values.tempTanggalUangMuka,
                                            pabrik: values.tempPabrik,
                                            keterangan_barang:
                                                values.tempKeteranganBarang,
                                            status: purchaseOrdersData[
                                                editIndex
                                            ].status, // keep existing status
                                        })

                                        // Handle detail items (would need additional logic for updating existing details)
                                        // This is simplified - you may need more complex logic to determine which to update/create
                                        for (const detail of values.tempDetails) {
                                            if (detail.id) {
                                                // Update existing detail
                                                await apiUpdateDetailPurchase({
                                                    id: detail.id,
                                                    nama_barang:
                                                        detail.nama_barang,
                                                    harga: extractNumberFromString(
                                                        detail.harga
                                                    ),
                                                    estimasi_delivery:
                                                        extractNumberFromString(
                                                            detail.estimasi_delivery
                                                        ),
                                                })
                                            } else {
                                                // Create new detail
                                                await apiCreateDetailPurchase({
                                                    idPurchase: purchaseId,
                                                    nama_barang:
                                                        detail.nama_barang,
                                                    harga: extractNumberFromString(
                                                        detail.harga
                                                    ),
                                                    estimasi_delivery:
                                                        extractNumberFromString(
                                                            detail.estimasi_delivery
                                                        ),
                                                })
                                            }
                                        }
                                    } else {
                                        // Handle create with API call

                                        const requestData = {
                                            idProject: values.tempIdProject,
                                            nomor_po: values.tempNomorPo,
                                            pabrik: values.tempPabrik,
                                            tanggal_po: values.tempTanggalPo,
                                            detail: detailItems,
                                            tanggal_uang_muka:
                                                values.tempTanggalUangMuka,
                                            uang_muka: extractNumberFromString(
                                                values.tempUangMuka
                                            ),
                                            status_lunas:
                                                values.tempStatusLunas,
                                            status_dikirim:
                                                values.tempStatusDikirim,
                                            status_sampai:
                                                values.tempStatusSampai,
                                            keterangan_barang:
                                                values.tempKeteranganBarang,
                                        }

                                        console.log('requestData', requestData)
                                        result = await apiCreatePurchaseOrder(
                                            requestData
                                        )
                                    }

                                    setIsSubmitting(false)

                                    if (
                                        result &&
                                        result.data.statusCode >= 200 &&
                                        result.data.statusCode < 300
                                    ) {
                                        // Refresh data
                                        dispatch(
                                            getPurchaseByProyek({
                                                id: projectId,
                                            })
                                        )

                                        // Show success notification
                                        toast.push(
                                            <Notification
                                                title="Purchase Order saved"
                                                type="success"
                                                duration={2500}
                                            >
                                                Purchase Order berhasil disimpan
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
                                                    : 'Failed to save purchase order'}
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
                        } catch (validationError) {
                            console.error('Validation error:', validationError)
                        }
                    }

                    // Helper function to reset form fields
                    const resetFormFields = () => {
                        setFieldValue('tempPabrik', '')
                        setFieldValue('tempNomorPo', '')
                        setFieldValue('tempTanggalPo', '')

                        setFieldValue('tempTanggalUangMuka', '')
                        setFieldValue('tempUangMuka', 0)
                        setFieldValue('tempStatusLunas', false)
                        setFieldValue('tempStatusDikirim', false)
                        setFieldValue('tempStatusSampai', false)
                        setFieldValue('tempKeteranganBarang', '')

                        setFieldValue('tempDetails', [
                            {
                                nama_barang: '',
                                harga: '',
                                estimasi_delivery: '',
                            },
                        ])
                    }

                    const handleCancel = () => {
                        setShowForm(false)
                        setEditIndex(null)
                        resetFormFields()
                    }

                    const handleEdit = (index: number) => {
                        if (purchaseOrdersData) {
                            const purchase = purchaseOrdersData[index]

                            console.log(
                                'tempTanggalUangMuka',
                                purchase.tanggal_uang_muka
                            )
                            // Set temporary values for editing
                            setFieldValue('tempPabrik', purchase.pabrik)
                            setFieldValue('tempNomorPo', purchase.nomor_po)
                            setFieldValue('tempTanggalPo', purchase.tanggal_po)
                            setFieldValue('tempIdProject', purchase.idProject)
                            setFieldValue('tempUangMuka', purchase.uang_muka)
                            setFieldValue(
                                'tempTanggalUangMuka',
                                purchase.tanggal_uang_muka
                            )
                            setFieldValue(
                                'tempKeteranganBarang',
                                purchase.keterangan_barang
                            )

                            // Map the detail purchases to form format
                            const details =
                                purchase.DetailPurchases.length > 0
                                    ? purchase.DetailPurchases.map(
                                          (detail) => ({
                                              id: detail.id,
                                              nama_barang: detail.nama_barang,
                                              harga: detail.harga,
                                              estimasi_delivery:
                                                  detail.estimasi_delivery,
                                          })
                                      )
                                    : [
                                          {
                                              nama_barang: '',
                                              harga: '',
                                              estimasi_delivery: '',
                                          },
                                      ]

                            setFieldValue('tempDetails', details)
                            setEditIndex(index)
                            setShowForm(true)
                        }
                    }

                    // Fungsi untuk membuka dialog konfirmasi delete purchase
                    const handleConfirmDelete = (index: number) => {
                        setDeleteIndex(index)
                        setDialogOpen(true)
                    }

                    // Fungsi untuk menutup dialog konfirmasi
                    const handleCancelDelete = () => {
                        setDialogOpen(false)
                        setDeleteIndex(null)
                    }

                    const handleCancelDeleteDetail = () => {
                        setDetailDialogOpen(false)
                        // setDeleteDetailInfo(null)
                        setDeleteDetailId(null)
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
                                toast.push(
                                    <Notification
                                        title="Error"
                                        type="danger"
                                        duration={2500}
                                    >
                                        Gagal menghapus purchase order
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
                                        title="Purchase Order"
                                        desc="Tambahkan data purchase order"
                                    />
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

                                        <div className="grid grid-cols-1 sm:grid-cols-2 mb-4 gap-x-4">
                                            {/* Edit Nomor PO */}
                                            <FormItem
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

                                            {/* Edit Tanggal PO */}
                                            <FormItem
                                                label="Tanggal PO"
                                                invalid={
                                                    !!(
                                                        errors.tempTanggalPo &&
                                                        touched.tempTanggalPo
                                                    )
                                                }
                                                errorMessage={
                                                    errors.tempTanggalPo as string
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

                                            {/* Harga */}
                                            <FormItem
                                                label="Uang Muka"
                                                errorMessage={
                                                    errors.tempUangMuka &&
                                                    touched.tempUangMuka
                                                        ? errors.tempUangMuka
                                                        : ''
                                                }
                                                invalid={
                                                    !!(
                                                        errors.tempUangMuka &&
                                                        touched.tempUangMuka
                                                    )
                                                }
                                            >
                                                <Field name={`tempUangMuka`}>
                                                    {({
                                                        field,
                                                        form,
                                                    }: FieldProps) => (
                                                        <NumericFormat
                                                            {...field}
                                                            customInput={Input}
                                                            placeholder="Harga"
                                                            thousandSeparator="."
                                                            decimalSeparator=","
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                form.setFieldValue(
                                                                    field.name,
                                                                    values.value
                                                                )
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </FormItem>

                                            {/* Edit Tanggal Uang Muka*/}
                                            <FormItem
                                                label="Tanggal Uang Muka"
                                                invalid={
                                                    !!(
                                                        errors.tempTanggalUangMuka &&
                                                        touched.tempTanggalUangMuka
                                                    )
                                                }
                                                errorMessage={
                                                    errors.tempTanggalUangMuka as string
                                                }
                                            >
                                                <Field name="tempTanggalUangMuka">
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

                                            {/* Edit Pabrik*/}
                                            <FormItem
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

                                            {/* Status Lunas */}
                                            {editIndex === null && (
                                                <FormItem
                                                    label="Status Lunas"
                                                    invalid={
                                                        errors.tempStatusLunas &&
                                                        touched.tempStatusLunas
                                                    }
                                                    errorMessage={
                                                        errors.tempStatusLunas
                                                    }
                                                >
                                                    <div className="flex flex-row items-center gap-3">
                                                        <Field
                                                            name={`tempStatusLunas`}
                                                            component={Switcher}
                                                        />
                                                        <span>
                                                            {values.tempStatusLunas ===
                                                            true
                                                                ? 'Sudah Lunas'
                                                                : 'Belum Lunas'}
                                                        </span>
                                                    </div>
                                                </FormItem>
                                            )}

                                            {/* Status Sampai */}
                                            {editIndex === null && (
                                                <FormItem
                                                    label="Status Sampai"
                                                    invalid={
                                                        errors.tempStatusSampai &&
                                                        touched.tempStatusSampai
                                                    }
                                                    errorMessage={
                                                        errors.tempStatusSampai
                                                    }
                                                >
                                                    <div className="flex flex-row items-center gap-3">
                                                        <Field
                                                            name={`tempStatusSampai`}
                                                            component={Switcher}
                                                        />
                                                        <span>
                                                            {values.tempStatusSampai ===
                                                            true
                                                                ? 'Sudah Sampai'
                                                                : 'Belum Sampai'}
                                                        </span>
                                                    </div>
                                                </FormItem>
                                            )}

                                            {/* Status Dikirim */}
                                            {editIndex === null && (
                                                <FormItem
                                                    label="Status Dikirim"
                                                    invalid={
                                                        errors.tempStatusDikirim &&
                                                        touched.tempStatusDikirim
                                                    }
                                                    errorMessage={
                                                        errors.tempStatusDikirim
                                                    }
                                                >
                                                    <div>
                                                        <div className="flex flex-row items-center gap-3">
                                                            <Field
                                                                name={`tempStatusDikirim`}
                                                                component={
                                                                    Switcher
                                                                }
                                                            />
                                                            <span>
                                                                {values.tempStatusDikirim ===
                                                                true
                                                                    ? 'Sudah Dikirim'
                                                                    : 'Belum Dikirim'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </FormItem>
                                            )}

                                            {/* Keterangan Barang*/}
                                            <FormItem
                                                label="Keterangan Barang"
                                                errorMessage={
                                                    errors.tempKeteranganBarang &&
                                                    touched.tempKeteranganBarang
                                                        ? errors.tempKeteranganBarang
                                                        : ''
                                                }
                                                invalid={
                                                    !!(
                                                        errors.tempKeteranganBarang &&
                                                        touched.tempKeteranganBarang
                                                    )
                                                }
                                            >
                                                <Field
                                                    textArea
                                                    autoComplete="off"
                                                    name="tempKeteranganBarang"
                                                    placeholder="Keterangan Barang"
                                                    component={Input}
                                                />
                                            </FormItem>
                                        </div>

                                        {/* Detail Barang Section */}
                                        <div className="mt-6">
                                            <div className="flex justify-between items-center mb-2">
                                                <h6>Detail Barang</h6>
                                                <Button
                                                    size="sm"
                                                    variant="twoTone"
                                                    onClick={handleAddDetail}
                                                    className="w-fit text-xs"
                                                    type="button"
                                                    icon={<HiPlusCircle />}
                                                >
                                                    Tambah Detail
                                                </Button>
                                            </div>

                                            {values.tempDetails.map(
                                                (detail, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="border rounded-md p-3 mb-3 bg-white"
                                                    >
                                                        <div className="flex justify-between items-center mb-2">
                                                            <h6>
                                                                Item {idx + 1}
                                                            </h6>
                                                        </div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 sm:gap-4">
                                                            {/* Nama Barang */}
                                                            <FormItem
                                                                label="Nama Barang"
                                                                errorMessage={
                                                                    errors
                                                                        .tempDetails?.[
                                                                        idx
                                                                    ]
                                                                        ?.nama_barang &&
                                                                    touched
                                                                        .tempDetails?.[
                                                                        idx
                                                                    ]
                                                                        ?.nama_barang
                                                                        ? errors
                                                                              .tempDetails[
                                                                              idx
                                                                          ]
                                                                              .nama_barang
                                                                        : ''
                                                                }
                                                                invalid={
                                                                    !!(
                                                                        errors
                                                                            .tempDetails?.[
                                                                            idx
                                                                        ]
                                                                            ?.nama_barang &&
                                                                        touched
                                                                            .tempDetails?.[
                                                                            idx
                                                                        ]
                                                                            ?.nama_barang
                                                                    )
                                                                }
                                                            >
                                                                <Field
                                                                    type="text"
                                                                    autoComplete="off"
                                                                    name={`tempDetails.${idx}.nama_barang`}
                                                                    placeholder="Nama barang"
                                                                    component={
                                                                        Input
                                                                    }
                                                                />
                                                            </FormItem>

                                                            {/* Harga */}
                                                            <FormItem
                                                                label="Harga"
                                                                errorMessage={
                                                                    errors
                                                                        .tempDetails?.[
                                                                        idx
                                                                    ]?.harga &&
                                                                    touched
                                                                        .tempDetails?.[
                                                                        idx
                                                                    ]?.harga
                                                                        ? errors
                                                                              .tempDetails[
                                                                              idx
                                                                          ]
                                                                              .harga
                                                                        : ''
                                                                }
                                                                invalid={
                                                                    !!(
                                                                        errors
                                                                            .tempDetails?.[
                                                                            idx
                                                                        ]
                                                                            ?.harga &&
                                                                        touched
                                                                            .tempDetails?.[
                                                                            idx
                                                                        ]?.harga
                                                                    )
                                                                }
                                                            >
                                                                <Field
                                                                    name={`tempDetails.${idx}.harga`}
                                                                >
                                                                    {({
                                                                        field,
                                                                        form,
                                                                    }: FieldProps) => (
                                                                        <NumericFormat
                                                                            {...field}
                                                                            customInput={
                                                                                Input
                                                                            }
                                                                            placeholder="Harga"
                                                                            thousandSeparator="."
                                                                            decimalSeparator=","
                                                                            onValueChange={(
                                                                                values
                                                                            ) => {
                                                                                form.setFieldValue(
                                                                                    field.name,
                                                                                    values.value
                                                                                )
                                                                            }}
                                                                        />
                                                                    )}
                                                                </Field>
                                                            </FormItem>

                                                            {/* Estimasi Delivery */}
                                                            <FormItem
                                                                label="Estimasi Delivery (hari)"
                                                                errorMessage={
                                                                    errors
                                                                        .tempDetails?.[
                                                                        idx
                                                                    ]
                                                                        ?.estimasi_delivery &&
                                                                    touched
                                                                        .tempDetails?.[
                                                                        idx
                                                                    ]
                                                                        ?.estimasi_delivery
                                                                        ? errors
                                                                              .tempDetails[
                                                                              idx
                                                                          ]
                                                                              .estimasi_delivery
                                                                        : ''
                                                                }
                                                                invalid={
                                                                    !!(
                                                                        errors
                                                                            .tempDetails?.[
                                                                            idx
                                                                        ]
                                                                            ?.estimasi_delivery &&
                                                                        touched
                                                                            .tempDetails?.[
                                                                            idx
                                                                        ]
                                                                            ?.estimasi_delivery
                                                                    )
                                                                }
                                                            >
                                                                <Field
                                                                    type="number"
                                                                    autoComplete="off"
                                                                    name={`tempDetails.${idx}.estimasi_delivery`}
                                                                    placeholder="Estimasi dalam hari"
                                                                    component={
                                                                        Input
                                                                    }
                                                                />
                                                            </FormItem>
                                                        </div>
                                                    </div>
                                                )
                                            )}

                                            {Array.isArray(
                                                errors.tempDetails
                                            ) &&
                                                typeof errors.tempDetails ===
                                                    'string' && (
                                                    <div className="text-red-500 text-xs mt-1">
                                                        {errors.tempDetails}
                                                    </div>
                                                )}
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
                                                    className="overflow-x-scroll sm:overflow-auto"
                                                >
                                                    <div className="mb-4 border bg-slate-50 rounded-md p-4 min-w-[500px]">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <h6>
                                                                {
                                                                    purchase.pabrik
                                                                }
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
                                                        <div className="grid grid-cols-3 gap-4 mb-4">
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
                                                                    Tanggal PO:
                                                                </span>
                                                                <p>
                                                                    {formatDate(
                                                                        purchase.tanggal_po
                                                                    )}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <span className="text-xs font-bold text-gray-500">
                                                                    Uang Muka:
                                                                </span>
                                                                <p>
                                                                    Rp{' '}
                                                                    {purchase.uang_muka?.toLocaleString(
                                                                        'id-ID'
                                                                    )}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <span className="text-xs font-bold text-gray-500">
                                                                    Tanggal Uang
                                                                    Muka:
                                                                </span>
                                                                <p>
                                                                    {formatDate(
                                                                        purchase.tanggal_uang_muka
                                                                    )}
                                                                </p>
                                                            </div>

                                                            {/* <div>
                                                                <span className="text-xs font-bold text-gray-500">
                                                                    Status Lunas
                                                                </span>
                                                                <div className="flex items-center gap-2">
                                                                    <Switcher
                                                                        checked={
                                                                            purchase.status_lunas
                                                                        }
                                                                        // Panggil handler tanpa menangkap nilai dari event
                                                                        onChange={() =>
                                                                            handleStatusChange(
                                                                                purchase,
                                                                                'status_lunas'
                                                                            )
                                                                        }
                                                                    />
                                                                    <p>
                                                                        {purchase.status_lunas
                                                                            ? 'Lunas'
                                                                            : 'Belum Lunas'}
                                                                    </p>
                                                                </div>
                                                            </div> */}
                                                            {/* <div>
                                                                <span className="text-xs font-bold text-gray-500">
                                                                    Status
                                                                    Dikirim
                                                                </span>
                                                                <div className="flex items-center gap-2">
                                                                    <Switcher
                                                                        checked={
                                                                            purchase.status_dikirim
                                                                        }
                                                                        onChange={() =>
                                                                            handleStatusChange(
                                                                                purchase,
                                                                                'status_dikirim'
                                                                            )
                                                                        }
                                                                    />
                                                                    <p>
                                                                        {purchase.status_dikirim
                                                                            ? 'Dikirim'
                                                                            : 'Belum Dikirim'}
                                                                    </p>
                                                                </div>
                                                            </div> */}
                                                            {/* Status Sampai */}
                                                            {/* <div>
                                                                <span className="text-xs font-bold text-gray-500">
                                                                    Status
                                                                    Sampai
                                                                </span>
                                                                <div className="flex items-center gap-2">
                                                                    <Switcher
                                                                        checked={
                                                                            purchase.status_sampai
                                                                        }
                                                                        onChange={() =>
                                                                            handleStatusChange(
                                                                                purchase,
                                                                                'status_sampai'
                                                                            )
                                                                        }
                                                                    />
                                                                    <p>
                                                                        {purchase.status_sampai
                                                                            ? 'true'
                                                                            : 'false'}
                                                                    </p>
                                                                </div>
                                                            </div> */}
                                                            {/* Status Lunas */}
                                                            {/* <div>
                                                                <span className="text-xs font-bold text-gray-500">
                                                                    Status Lunas
                                                                </span>
                                                                <div className="flex items-center gap-2">
                                                                    <Switcher
                                                                        checked={
                                                                            purchase.status_lunas
                                                                        }
                                                                        onChange={() =>
                                                                            handleStatusChange(
                                                                                purchase,
                                                                                'status_lunas'
                                                                            )
                                                                        }
                                                                    />
                                                                    <p>
                                                                        {purchase.status_lunas
                                                                            ? 'true'
                                                                            : 'galse'}
                                                                    </p>
                                                                </div>
                                                            </div> */}
                                                            <div>
                                                                <span className="text-xs font-bold text-gray-500">
                                                                    Keterangan
                                                                    Barang:
                                                                </span>
                                                                <p>
                                                                    {
                                                                        purchase.keterangan_barang
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Detail Items */}
                                                        {purchase.DetailPurchases &&
                                                            purchase
                                                                .DetailPurchases
                                                                .length > 0 && (
                                                                <div className="mt-3">
                                                                    <h6 className="text-sm font-semibold mb-2">
                                                                        Detail
                                                                        Barang:
                                                                    </h6>
                                                                    <div>
                                                                        {purchase.DetailPurchases?.map(
                                                                            (
                                                                                detail,
                                                                                detailIdx
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        detail.id
                                                                                    }
                                                                                    className={`${
                                                                                        detailIdx ===
                                                                                        purchase
                                                                                            .DetailPurchases
                                                                                            .length -
                                                                                            1
                                                                                            ? 'border-y rounded-b'
                                                                                            : 'border-t rounded-t'
                                                                                    } border-x  bg-white p-3`}
                                                                                >
                                                                                    <div className="flex gap-2">
                                                                                        <div className="flex items-center mr-5">
                                                                                            {detailIdx +
                                                                                                1}
                                                                                            {
                                                                                                ' .'
                                                                                            }
                                                                                        </div>
                                                                                        <div className="flex-auto">
                                                                                            <span className="text-xs font-bold text-gray-500">
                                                                                                Nama
                                                                                                Barang:
                                                                                            </span>
                                                                                            <p className="text-sm">
                                                                                                {
                                                                                                    detail.nama_barang
                                                                                                }
                                                                                            </p>
                                                                                        </div>
                                                                                        <div className="flex-auto">
                                                                                            <span className="text-xs font-bold text-gray-500">
                                                                                                Harga:
                                                                                            </span>
                                                                                            <p className="text-sm">
                                                                                                Rp{' '}
                                                                                                {detail.harga?.toLocaleString(
                                                                                                    'id-ID'
                                                                                                )}
                                                                                            </p>
                                                                                        </div>
                                                                                        <div className="flex-auto">
                                                                                            <span className="text-xs font-bold text-gray-500">
                                                                                                Estimasi
                                                                                                Delivery:
                                                                                            </span>
                                                                                            <p className="text-sm">
                                                                                                {
                                                                                                    detail.estimasi_delivery
                                                                                                }{' '}
                                                                                                hari
                                                                                            </p>
                                                                                        </div>
                                                                                        <div className="flex">
                                                                                            <Button
                                                                                                type="button"
                                                                                                shape="circle"
                                                                                                variant="plain"
                                                                                                size="sm"
                                                                                                className="text-red-500"
                                                                                                icon={
                                                                                                    <HiOutlineTrash />
                                                                                                }
                                                                                                onClick={() => {
                                                                                                    handleRemoveDetail(
                                                                                                        detail?.id
                                                                                                    )
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                    </div>
                                                </div>
                                            )
                                        }
                                    )}

                                {/* Display message if no purchase orders exist */}
                                {purchaseOrdersData &&
                                    purchaseOrdersData.length === 0 &&
                                    !showForm && (
                                        <div className="text-center py-5">
                                            <p className="text-gray-500">
                                                Belum ada data purchase order.
                                                Silahkan tambahkan data.
                                            </p>
                                        </div>
                                    )}
                            </AdaptableCard>

                            {/* <ConfirmDialog
                                isOpen={isStatusChangeDialogOpen}
                                type="warning"
                                title="Konfirmasi Perubahan Status"
                                confirmButtonColor="amber-600"
                                onClose={cancelStatusChange}
                                onCancel={cancelStatusChange}
                                onRequestClose={cancelStatusChange}
                                onConfirm={confirmStatusChange}
                            >
                                <p>
                                    Apakah Anda yakin ingin mengubah{' '}
                                    <span className="font-semibold">
                                        {statusChangeInfo?.label}
                                    </span>{' '}
                                    menjadi{' '}
                                    <strong>
                                        {statusChangeInfo?.newStatus
                                            ? 'IYA'
                                            : 'TIDAK'}
                                    </strong>
                                    ?
                                </p>
                            </ConfirmDialog> */}

                            {/* Confirmation dialog for deleting purchase order */}
                            <ConfirmDialog
                                isOpen={dialogOpen}
                                onClose={handleCancelDelete}
                                onRequestClose={handleCancelDelete}
                                type="danger"
                                title="Hapus Purchase Order"
                                onCancel={handleCancelDelete}
                                onConfirm={handleDelete}
                                confirmButtonColor="red-600"
                            >
                                <p>
                                    Apakah Anda yakin ingin menghapus purchase
                                    order ini? Tindakan ini tidak dapat
                                    dibatalkan.
                                </p>
                            </ConfirmDialog>

                            <ConfirmDialog
                                isOpen={detailDialogOpen}
                                onClose={handleCancelDeleteDetail}
                                onRequestClose={handleCancelDeleteDetail}
                                type="danger"
                                title="Hapus Detail Barang"
                                onCancel={handleCancelDeleteDetail}
                                onConfirm={handleConfirmDeleteDetail}
                                confirmButtonColor="red-600"
                            >
                                <p>
                                    Apakah Anda yakin ingin menghapus detail
                                    barang ini? Tindakan ini tidak dapat
                                    dibatalkan.
                                </p>
                            </ConfirmDialog>
                        </Form>
                    )
                }}
            </Formik>
        </Loading>
    )
}

export default PurchaseOrder
