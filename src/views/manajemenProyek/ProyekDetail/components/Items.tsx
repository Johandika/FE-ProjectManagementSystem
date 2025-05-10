import React, { useState, useEffect } from 'react'
import {
    HiOutlineTrash,
    HiOutlinePencil,
    HiOutlineClipboardList,
    HiOutlinePlus,
    HiChevronDown,
    HiChevronUp,
} from 'react-icons/hi'
import classNames from 'classnames'
import isLastChild from '@/utils/isLastChild'
import DescriptionSection from './DesriptionSection'
import reducer, {
    getItemsByProyek,
    getSatuans,
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
import { Checkbox, Notification, Select, toast } from '@/components/ui'
import { NumericFormat } from 'react-number-format'
import { extractNumberFromString } from '@/utils/extractNumberFromString'
import {
    apiCreateDetailItem,
    apiCreateItem,
    apiDeleteDetailItem,
    apiDeleteItem,
    apiEditItem,
    apiUpdateDetailItem,
    apiUpdateStatusItemProyek,
} from '@/services/ItemService'

// Type definitions for item data
type DetailItem = {
    id: string
    uraian: string
    satuan: string
    volume: number
    harga_satuan_material: number
    harga_satuan_jasa: number
    jumlah_harga_material: number
    jumlah_harga_jasa: number
    jumlah: number
    status: boolean | null
}

type Item = {
    id: string
    nama: string
    keterangan: string | null
    status: boolean
    DetailItemProjects: DetailItem[]
}

// Form values type for Item
type ItemFormValues = {
    tempItem: string
    tempIdProject: string
}

// Form values type for DetailItem
type DetailItemFormValues = {
    tempUraian: string
    tempSatuan: string
    tempVolume: string | number
    tempHargaSatuanMaterial: string | number
    tempHargaSatuanJasa: string | number
    tempJumlahHargaMaterial: string | number
    tempJumlahHargaJasa: string | number
    tempJumlah: string | number
    tempIdItem: string
}

// Validation schema for the item form fields
const itemValidationSchema = Yup.object().shape({
    tempItem: Yup.string().required('Nama item harus diisi'),
})

// Validation schema for the detail item form fields
const detailItemValidationSchema = Yup.object().shape({
    tempUraian: Yup.string().required('Uraian harus diisi'),
    tempSatuan: Yup.string().required('Satuan harus diisi'),
    tempVolume: Yup.string().required('Volume harus diisi'),
    tempHargaSatuanMaterial: Yup.string().required(
        'Harga satuan material harus diisi'
    ),
    tempHargaSatuanJasa: Yup.string().required('Harga satuan jasa harus diisi'),
})

injectReducer('proyekDetail', reducer)

export default function Items() {
    const [showItemForm, setShowItemForm] = useState(false)
    const [showDetailForm, setShowDetailForm] = useState(false)
    const [editItemIndex, setEditItemIndex] = useState<number | null>(null)
    const [editDetailIndex, setEditDetailIndex] = useState<number | null>(null)
    const [currentItemIndex, setCurrentItemIndex] = useState<number | null>(
        null
    )
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [itemDialogOpen, setItemDialogOpen] = useState(false)
    const [detailDialogOpen, setDetailDialogOpen] = useState(false)
    const [deleteItemIndex, setDeleteItemIndex] = useState<number | null>(null)
    const [deleteDetailIndex, setDeleteDetailIndex] = useState<number | null>(
        null
    )
    const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(
        {}
    )

    const dispatch = useAppDispatch()
    const projectId = location.pathname.substring(
        location.pathname.lastIndexOf('/') + 1
    )

    const {
        loadingItemsByProyek,
        itemsByProyekData,
        satuansData,
        loadingSatuan,
    } = useAppSelector((state) => state.proyekDetail.data)

    const test = useAppSelector((state) => state.proyekDetail.data)

    // Fetch items when component mounts
    useEffect(() => {
        const requestParam = { id: projectId }
        dispatch(getItemsByProyek(requestParam))
        dispatch(getSatuans())
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

    // Initialize form values for item
    const initialItemValues: ItemFormValues = {
        tempItem: '',
        tempIdProject: projectId || '',
    }

    // Initialize form values for detail item
    const initialDetailValues: DetailItemFormValues = {
        tempUraian: '',
        tempSatuan: '',
        tempVolume: '',
        tempHargaSatuanMaterial: '',
        tempHargaSatuanJasa: '',
        tempJumlahHargaMaterial: '',
        tempJumlahHargaJasa: '',
        tempJumlah: '',
        tempIdItem: '',
    }

    // Success notification helper
    const popNotification = (keyword: string) => {
        toast.push(
            <Notification
                title={`Berhasil ${keyword}`}
                type="success"
                duration={2500}
            >
                Data berhasil {keyword}
            </Notification>,
            {
                placement: 'top-center',
            }
        )
    }

    // Fungsi handler untuk checkbox
    const onCheck =
        (item: any) =>
        async (checked: boolean, e: ChangeEvent<HTMLInputElement>) => {
            const updatedItem = {
                ...item,
                status: checked,
            }

            const data = { id: updatedItem.id, status: updatedItem.status }

            // Dispatch action untuk update
            try {
                // Dispatch action untuk update
                const result = await apiUpdateStatusItemProyek(data)
                // Show success notification if update was successful
                if (result.data?.statusCode === 200) {
                    popNotification('updated')
                } else {
                    toast.push(
                        <Notification
                            title="Error updating BASTP"
                            type="danger"
                            duration={2500}
                        >
                            {result.data?.message}
                        </Notification>,
                        {
                            placement: 'top-center',
                        }
                    )
                }
            } catch (error) {
                console.error('Error updating BASTP status:', error)

                // Show error notification
                toast.push(
                    <Notification
                        title="Error updating BASTP"
                        type="danger"
                        duration={2500}
                    >
                        An error occurred while updating the BASTP status
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
            }
        }

    // Toggle item expansion
    const toggleItemExpand = (index: number) => {
        setExpandedItems((prev) => ({
            ...prev,
            [index]: !prev[index],
        }))
    }

    // Calculate total sums for an item
    const calculateItemTotals = (details: DetailItem[]) => {
        return details.reduce(
            (acc, detail) => {
                acc.totalMaterial += detail.jumlah_harga_material
                acc.totalJasa += detail.jumlah_harga_jasa
                acc.grandTotal += detail.jumlah
                return acc
            },
            { totalMaterial: 0, totalJasa: 0, grandTotal: 0 }
        )
    }

    // Calculate total for all items
    const calculateGrandTotal = (items: Item[]) => {
        return items.reduce(
            (acc, item) => {
                const itemTotals = calculateItemTotals(item.DetailItemProjects)
                acc.totalMaterial += itemTotals.totalMaterial
                acc.totalJasa += itemTotals.totalJasa
                acc.grandTotal += itemTotals.grandTotal
                return acc
            },
            { totalMaterial: 0, totalJasa: 0, grandTotal: 0 }
        )
    }

    return (
        <Loading
            loading={loadingItemsByProyek || loadingSatuan || isSubmitting}
        >
            <Formik
                enableReinitialize
                initialValues={initialItemValues}
                validationSchema={itemValidationSchema}
                onSubmit={() => {
                    // Form submission is handled by save button
                }}
            >
                {(itemFormikProps) => {
                    const {
                        values: itemValues,
                        errors: itemErrors,
                        touched: itemTouched,
                        setFieldValue: setItemField,
                    } = itemFormikProps

                    const handleAddItem = () => {
                        setShowItemForm(true)
                        setEditItemIndex(null)
                        setShowDetailForm(false)
                        setEditDetailIndex(null)

                        // Reset temp values
                        setItemField('tempItem', '')
                    }

                    const handleSaveItem = async () => {
                        // Validate fields
                        if (!itemErrors.tempItem) {
                            setIsSubmitting(true)

                            const requestData = {
                                item: itemValues.tempItem,
                                idProject: itemValues.tempIdProject,
                                detail: [], // Empty for new items
                            }

                            try {
                                let result

                                if (
                                    editItemIndex !== null &&
                                    itemsByProyekData
                                ) {
                                    // Handle edit with API call
                                    const itemId =
                                        itemsByProyekData[editItemIndex].id
                                    result = await apiEditItem({
                                        id: itemId,
                                        item: itemValues.tempItem,
                                    })
                                } else {
                                    // Handle create with API call
                                    result = await apiCreateItem(requestData)
                                }

                                setIsSubmitting(false)

                                if (
                                    result &&
                                    result.data?.statusCode >= 200 &&
                                    result.data?.statusCode < 300
                                ) {
                                    // Refresh data
                                    dispatch(
                                        getItemsByProyek({ id: projectId })
                                    )

                                    // Show success notification
                                    popNotification(
                                        editItemIndex !== null
                                            ? 'diperbarui'
                                            : 'ditambahkan'
                                    )

                                    // Reset form and close
                                    setItemField('tempItem', '')
                                    setShowItemForm(false)
                                    setEditItemIndex(null)
                                } else {
                                    // Show error notification
                                    toast.push(
                                        <Notification
                                            title="Error"
                                            type="danger"
                                            duration={2500}
                                        >
                                            {result
                                                ? result.data?.message
                                                : 'Gagal menambahkan item'}
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

                    const handleCancelItem = () => {
                        setShowItemForm(false)
                        setEditItemIndex(null)
                        setItemField('tempItem', '')
                    }

                    const handleEditItem = (index: number) => {
                        if (itemsByProyekData) {
                            const item = itemsByProyekData[index]

                            // Set temporary values for editing
                            setItemField('tempItem', item.nama)

                            setEditItemIndex(index)
                            setShowItemForm(true)
                            setShowDetailForm(false)
                            setEditDetailIndex(null)
                        }
                    }

                    // Function to open item confirmation dialog
                    const handleConfirmDeleteItem = (index: number) => {
                        setDeleteItemIndex(index)
                        setItemDialogOpen(true)
                    }

                    // Function to close item confirmation dialog
                    const handleCancelDeleteItem = () => {
                        setItemDialogOpen(false)
                        setDeleteItemIndex(null)
                    }

                    const handleDeleteItem = async () => {
                        if (deleteItemIndex !== null && itemsByProyekData) {
                            const itemId = itemsByProyekData[deleteItemIndex]

                            setIsSubmitting(true)
                            try {
                                // Call delete API with item ID
                                const success = await apiDeleteItem(itemId)

                                if (success) {
                                    // Refresh data after successful delete
                                    dispatch(
                                        getItemsByProyek({ id: projectId })
                                    )
                                    popNotification('dihapus')
                                }
                            } catch (error) {
                                console.error('Error deleting item:', error)

                                // Show error notification
                                toast.push(
                                    <Notification
                                        title="Error"
                                        type="danger"
                                        duration={2500}
                                    >
                                        Gagal menghapus item
                                    </Notification>,
                                    { placement: 'top-center' }
                                )
                            } finally {
                                setIsSubmitting(false)
                                setItemDialogOpen(false)
                                setDeleteItemIndex(null)
                            }
                        }
                    }

                    return (
                        <Form>
                            <AdaptableCard divider>
                                <div className="flex justify-between items-center mb-4">
                                    <DescriptionSection
                                        title="Informasi RAB"
                                        desc="Daftar RAB dan detail RAB proyek"
                                    />
                                    {!showItemForm && (
                                        <Button
                                            size="sm"
                                            variant="twoTone"
                                            onClick={handleAddItem}
                                            className="w-fit text-xs"
                                            type="button"
                                        >
                                            Tambah Item
                                        </Button>
                                    )}
                                </div>

                                {/* Form untuk input item */}
                                {showItemForm && (
                                    <div className="mb-4 border bg-slate-50 rounded-md p-4">
                                        <h6 className="mb-3">
                                            {editItemIndex !== null
                                                ? 'Edit Item'
                                                : 'Tambah Item Baru'}
                                        </h6>

                                        <FormContainer>
                                            <div className="grid grid-cols-1 gap-4">
                                                {/* Nama Item */}
                                                <FormItem
                                                    label="Nama Item"
                                                    errorMessage={
                                                        itemErrors.tempItem &&
                                                        itemTouched.tempItem
                                                            ? itemErrors.tempItem
                                                            : ''
                                                    }
                                                    invalid={
                                                        !!(
                                                            itemErrors.tempItem &&
                                                            itemTouched.tempItem
                                                        )
                                                    }
                                                >
                                                    <Field
                                                        type="text"
                                                        autoComplete="off"
                                                        name="tempItem"
                                                        placeholder="Masukkan nama item"
                                                        component={Input}
                                                    />
                                                </FormItem>
                                            </div>

                                            <div className="flex justify-end space-x-2 mt-4">
                                                <Button
                                                    size="sm"
                                                    variant="plain"
                                                    onClick={handleCancelItem}
                                                    type="button"
                                                >
                                                    Batal
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="solid"
                                                    onClick={handleSaveItem}
                                                    type="button"
                                                    loading={isSubmitting}
                                                >
                                                    Simpan
                                                </Button>
                                            </div>
                                        </FormContainer>
                                    </div>
                                )}

                                {/* Nested Formik for Detail Items */}
                                <Formik
                                    enableReinitialize
                                    initialValues={initialDetailValues}
                                    validationSchema={
                                        detailItemValidationSchema
                                    }
                                    onSubmit={() => {
                                        // Form submission is handled by save button
                                    }}
                                >
                                    {(detailFormikProps) => {
                                        const {
                                            values: detailValues,
                                            errors: detailErrors,
                                            touched: detailTouched,
                                            setFieldValue: setDetailField,
                                        } = detailFormikProps

                                        const calculateJumlahHargaMaterial =
                                            () => {
                                                const volume =
                                                    extractNumberFromString(
                                                        detailValues.tempVolume
                                                    )
                                                const hargaSatuanMaterial =
                                                    extractNumberFromString(
                                                        detailValues.tempHargaSatuanMaterial
                                                    )
                                                const jumlah =
                                                    volume * hargaSatuanMaterial
                                                setDetailField(
                                                    'tempJumlahHargaMaterial',
                                                    jumlah
                                                )
                                                calculateTotal()
                                            }

                                        const calculateJumlahHargaJasa = () => {
                                            const volume =
                                                extractNumberFromString(
                                                    detailValues.tempVolume
                                                )
                                            const hargaSatuanJasa =
                                                extractNumberFromString(
                                                    detailValues.tempHargaSatuanJasa
                                                )
                                            const jumlah =
                                                volume * hargaSatuanJasa
                                            setDetailField(
                                                'tempJumlahHargaJasa',
                                                jumlah
                                            )
                                            calculateTotal()
                                        }

                                        const calculateTotal = () => {
                                            const jumlahMaterial =
                                                extractNumberFromString(
                                                    detailValues.tempJumlahHargaMaterial
                                                )
                                            const jumlahJasa =
                                                extractNumberFromString(
                                                    detailValues.tempJumlahHargaJasa
                                                )
                                            const total =
                                                jumlahMaterial + jumlahJasa
                                            setDetailField('tempJumlah', total)
                                        }

                                        const handleAddDetail = (
                                            itemIndex: number
                                        ) => {
                                            if (itemsByProyekData) {
                                                setCurrentItemIndex(itemIndex)
                                                setShowDetailForm(true)
                                                setEditDetailIndex(null)
                                                setShowItemForm(false)

                                                // Set the item ID for the detail
                                                setDetailField(
                                                    'tempIdItem',
                                                    itemsByProyekData[itemIndex]
                                                        .id
                                                )

                                                // Reset other temp values
                                                setDetailField('tempUraian', '')
                                                setDetailField('tempSatuan', '')
                                                setDetailField('tempVolume', '')
                                                setDetailField(
                                                    'tempHargaSatuanMaterial',
                                                    ''
                                                )
                                                setDetailField(
                                                    'tempHargaSatuanJasa',
                                                    ''
                                                )
                                                setDetailField(
                                                    'tempJumlahHargaMaterial',
                                                    ''
                                                )
                                                setDetailField(
                                                    'tempJumlahHargaJasa',
                                                    ''
                                                )
                                                setDetailField('tempJumlah', '')
                                            }
                                        }

                                        const handleSaveDetail = async () => {
                                            // Validate fields
                                            if (
                                                !detailErrors.tempUraian &&
                                                !detailErrors.tempSatuan &&
                                                !detailErrors.tempVolume &&
                                                !detailErrors.tempHargaSatuanMaterial &&
                                                !detailErrors.tempHargaSatuanJasa
                                            ) {
                                                setIsSubmitting(true)

                                                const requestData = {
                                                    uraian: detailValues.tempUraian,
                                                    idSatuan:
                                                        detailValues.tempSatuan,
                                                    volume: extractNumberFromString(
                                                        detailValues.tempVolume
                                                    ),
                                                    harga_satuan_material:
                                                        extractNumberFromString(
                                                            detailValues.tempHargaSatuanMaterial
                                                        ),
                                                    harga_satuan_jasa:
                                                        extractNumberFromString(
                                                            detailValues.tempHargaSatuanJasa
                                                        ),
                                                    jumlah_harga_material:
                                                        extractNumberFromString(
                                                            detailValues.tempJumlahHargaMaterial
                                                        ),
                                                    jumlah_harga_jasa:
                                                        extractNumberFromString(
                                                            detailValues.tempJumlahHargaJasa
                                                        ),
                                                    jumlah: extractNumberFromString(
                                                        detailValues.tempJumlah
                                                    ),
                                                    idItemProject:
                                                        detailValues.tempIdItem,
                                                }

                                                try {
                                                    let result

                                                    if (
                                                        editDetailIndex !==
                                                            null &&
                                                        currentItemIndex !==
                                                            null &&
                                                        itemsByProyekData
                                                    ) {
                                                        // Handle edit with API call
                                                        const detailId =
                                                            itemsByProyekData[
                                                                currentItemIndex
                                                            ]
                                                                .DetailItemProjects[
                                                                editDetailIndex
                                                            ].id

                                                        result =
                                                            await apiUpdateDetailItem(
                                                                {
                                                                    id: detailId,
                                                                    ...requestData,
                                                                }
                                                            )
                                                    } else {
                                                        result =
                                                            await apiCreateDetailItem(
                                                                requestData
                                                            )
                                                    }

                                                    setIsSubmitting(false)

                                                    if (
                                                        result &&
                                                        result.data
                                                            ?.statusCode >=
                                                            200 &&
                                                        result.data
                                                            ?.statusCode < 300
                                                    ) {
                                                        // Refresh data
                                                        dispatch(
                                                            getItemsByProyek({
                                                                id: projectId,
                                                            })
                                                        )

                                                        // Show success notification
                                                        popNotification(
                                                            editDetailIndex !==
                                                                null
                                                                ? 'diperbarui'
                                                                : 'ditambahkan'
                                                        )

                                                        // Reset form and close
                                                        setDetailField(
                                                            'tempUraian',
                                                            ''
                                                        )
                                                        setDetailField(
                                                            'tempSatuan',
                                                            ''
                                                        )
                                                        setDetailField(
                                                            'tempVolume',
                                                            ''
                                                        )
                                                        setDetailField(
                                                            'tempHargaSatuanMaterial',
                                                            ''
                                                        )
                                                        setDetailField(
                                                            'tempHargaSatuanJasa',
                                                            ''
                                                        )
                                                        setDetailField(
                                                            'tempJumlahHargaMaterial',
                                                            ''
                                                        )
                                                        setDetailField(
                                                            'tempJumlahHargaJasa',
                                                            ''
                                                        )
                                                        setDetailField(
                                                            'tempJumlah',
                                                            ''
                                                        )
                                                        setShowDetailForm(false)
                                                        setEditDetailIndex(null)
                                                    } else {
                                                        // Show error notification
                                                        toast.push(
                                                            <Notification
                                                                title="Error"
                                                                type="danger"
                                                                duration={2500}
                                                            >
                                                                {result
                                                                    ? result
                                                                          .data
                                                                          ?.message
                                                                    : 'Gagal menambahkan detail item'}
                                                            </Notification>,
                                                            {
                                                                placement:
                                                                    'top-center',
                                                            }
                                                        )
                                                    }
                                                } catch (error) {
                                                    setIsSubmitting(false)
                                                    console.error(
                                                        'Error:',
                                                        error
                                                    )

                                                    // Show generic error notification
                                                    toast.push(
                                                        <Notification
                                                            title="Error"
                                                            type="danger"
                                                            duration={2500}
                                                        >
                                                            Terjadi kesalahan
                                                            saat memproses
                                                            permintaan
                                                        </Notification>,
                                                        {
                                                            placement:
                                                                'top-center',
                                                        }
                                                    )
                                                }
                                            }
                                        }

                                        const handleCancelDetail = () => {
                                            setShowDetailForm(false)
                                            setEditDetailIndex(null)
                                            setCurrentItemIndex(null)
                                            setDetailField('tempUraian', '')
                                            setDetailField('tempSatuan', '')
                                            setDetailField('tempVolume', '')
                                            setDetailField(
                                                'tempHargaSatuanMaterial',
                                                ''
                                            )
                                            setDetailField(
                                                'tempHargaSatuanJasa',
                                                ''
                                            )
                                            setDetailField(
                                                'tempJumlahHargaMaterial',
                                                ''
                                            )
                                            setDetailField(
                                                'tempJumlahHargaJasa',
                                                ''
                                            )
                                            setDetailField('tempJumlah', '')
                                        }

                                        const handleEditDetail = (
                                            itemIndex: number,
                                            detailIndex: number
                                        ) => {
                                            if (itemsByProyekData) {
                                                const item =
                                                    itemsByProyekData[itemIndex]
                                                const detail =
                                                    item.DetailItemProjects[
                                                        detailIndex
                                                    ]

                                                // Set current item index
                                                setCurrentItemIndex(itemIndex)

                                                // Set temporary values for editing
                                                setDetailField(
                                                    'tempUraian',
                                                    detail.uraian
                                                )
                                                setDetailField(
                                                    'tempSatuan',
                                                    detail.idSatuan
                                                )
                                                setDetailField(
                                                    'tempVolume',
                                                    detail.volume
                                                )
                                                setDetailField(
                                                    'tempHargaSatuanMaterial',
                                                    detail.harga_satuan_material
                                                )
                                                setDetailField(
                                                    'tempHargaSatuanJasa',
                                                    detail.harga_satuan_jasa
                                                )
                                                setDetailField(
                                                    'tempJumlahHargaMaterial',
                                                    detail.jumlah_harga_material
                                                )
                                                setDetailField(
                                                    'tempJumlahHargaJasa',
                                                    detail.jumlah_harga_jasa
                                                )
                                                setDetailField(
                                                    'tempJumlah',
                                                    detail.jumlah
                                                )
                                                setDetailField(
                                                    'tempIdItem',
                                                    item.id
                                                )

                                                setEditDetailIndex(detailIndex)
                                                setShowDetailForm(true)
                                                setShowItemForm(false)
                                            }
                                        }

                                        // Function to open detail confirmation dialog
                                        const handleConfirmDeleteDetail = (
                                            itemIndex: number,
                                            detailIndex: number
                                        ) => {
                                            setCurrentItemIndex(itemIndex)
                                            setDeleteDetailIndex(detailIndex)
                                            setDetailDialogOpen(true)
                                        }

                                        // Function to close detail confirmation dialog
                                        const handleCancelDeleteDetail = () => {
                                            setDetailDialogOpen(false)
                                            setDeleteDetailIndex(null)
                                            setCurrentItemIndex(null)
                                        }

                                        const handleDeleteDetail = async () => {
                                            if (
                                                deleteDetailIndex !== null &&
                                                currentItemIndex !== null &&
                                                itemsByProyekData
                                            ) {
                                                const detailId =
                                                    itemsByProyekData[
                                                        currentItemIndex
                                                    ].DetailItemProjects[
                                                        deleteDetailIndex
                                                    ]

                                                setIsSubmitting(true)
                                                try {
                                                    // Call delete API with detail ID
                                                    const success =
                                                        await apiDeleteDetailItem(
                                                            detailId
                                                        )

                                                    if (success) {
                                                        // Refresh data after successful delete
                                                        dispatch(
                                                            getItemsByProyek({
                                                                id: projectId,
                                                            })
                                                        )
                                                        popNotification(
                                                            'dihapus'
                                                        )
                                                    }
                                                } catch (error) {
                                                    console.error(
                                                        'Error deleting detail item:',
                                                        error
                                                    )

                                                    // Show error notification
                                                    toast.push(
                                                        <Notification
                                                            title="Error"
                                                            type="danger"
                                                            duration={2500}
                                                        >
                                                            Gagal menghapus
                                                            detail item
                                                        </Notification>,
                                                        {
                                                            placement:
                                                                'top-center',
                                                        }
                                                    )
                                                } finally {
                                                    setIsSubmitting(false)
                                                    setDetailDialogOpen(false)
                                                    setDeleteDetailIndex(null)
                                                    setCurrentItemIndex(null)
                                                }
                                            }
                                        }

                                        return (
                                            <>
                                                {/* Form untuk input detail item */}
                                                {showDetailForm && (
                                                    <div className="mb-4 border bg-slate-50 rounded-md p-4">
                                                        <h6 className="mb-3">
                                                            {editDetailIndex !==
                                                            null
                                                                ? 'Edit Detail Item'
                                                                : 'Tambah Detail Item Baru'}
                                                        </h6>

                                                        <FormContainer>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                {/* Uraian */}
                                                                <FormItem
                                                                    label="Uraian"
                                                                    errorMessage={
                                                                        detailErrors.tempUraian &&
                                                                        detailTouched.tempUraian
                                                                            ? detailErrors.tempUraian
                                                                            : ''
                                                                    }
                                                                    invalid={
                                                                        !!(
                                                                            detailErrors.tempUraian &&
                                                                            detailTouched.tempUraian
                                                                        )
                                                                    }
                                                                >
                                                                    <Field
                                                                        type="text"
                                                                        autoComplete="off"
                                                                        name="tempUraian"
                                                                        placeholder="Masukkan uraian"
                                                                        component={
                                                                            Input
                                                                        }
                                                                    />
                                                                </FormItem>

                                                                {/* Satuan */}
                                                                <FormItem
                                                                    label="Satuan"
                                                                    errorMessage={
                                                                        detailErrors.tempSatuan &&
                                                                        detailTouched.tempSatuan
                                                                            ? detailErrors.tempSatuan
                                                                            : ''
                                                                    }
                                                                    invalid={
                                                                        !!(
                                                                            detailErrors.tempSatuan &&
                                                                            detailTouched.tempSatuan
                                                                        )
                                                                    }
                                                                >
                                                                    <Field name="tempSatuan">
                                                                        {({
                                                                            field,
                                                                            form,
                                                                        }: FieldProps) => {
                                                                            // Find the selected client based on current idClient value
                                                                            const selectedSatuan =
                                                                                field.value
                                                                                    ? satuansData.data?.find(
                                                                                          (
                                                                                              satuan
                                                                                          ) =>
                                                                                              // field.value = kg
                                                                                              satuan.id ===
                                                                                              field.value
                                                                                      )
                                                                                    : null

                                                                            const satuanOptions =
                                                                                satuansData.data?.map(
                                                                                    (
                                                                                        satuan
                                                                                    ) => ({
                                                                                        value: satuan.id,
                                                                                        label: `${satuan.satuan}`,
                                                                                    })
                                                                                )
                                                                            console.log(
                                                                                'field',
                                                                                field
                                                                            )
                                                                            console.log(
                                                                                'satuansData.data?',
                                                                                satuansData.data
                                                                            )
                                                                            return (
                                                                                <Select
                                                                                    field={
                                                                                        field
                                                                                    }
                                                                                    form={
                                                                                        form
                                                                                    }
                                                                                    options={
                                                                                        satuanOptions
                                                                                    }
                                                                                    value={
                                                                                        selectedSatuan
                                                                                            ? {
                                                                                                  value: selectedSatuan.id,
                                                                                                  label: `${selectedSatuan.satuan}`,
                                                                                              }
                                                                                            : null
                                                                                    }
                                                                                    placeholder="Pilih satuan"
                                                                                    onChange={(
                                                                                        option
                                                                                    ) => {
                                                                                        form.setFieldValue(
                                                                                            field.name,
                                                                                            option?.value
                                                                                        )
                                                                                    }}
                                                                                />
                                                                            )
                                                                        }}
                                                                    </Field>
                                                                </FormItem>

                                                                {/* Volume */}
                                                                <FormItem
                                                                    label="Volume"
                                                                    errorMessage={
                                                                        detailErrors.tempVolume &&
                                                                        detailTouched.tempVolume
                                                                            ? detailErrors.tempVolume
                                                                            : ''
                                                                    }
                                                                    invalid={
                                                                        !!(
                                                                            detailErrors.tempVolume &&
                                                                            detailTouched.tempVolume
                                                                        )
                                                                    }
                                                                >
                                                                    <Field name="tempVolume">
                                                                        {({
                                                                            field,
                                                                            form,
                                                                        }: FieldProps) => (
                                                                            <NumericFormat
                                                                                thousandSeparator="."
                                                                                decimalSeparator=","
                                                                                placeholder="Masukkan volume"
                                                                                customInput={
                                                                                    Input
                                                                                }
                                                                                {...field}
                                                                                onValueChange={(
                                                                                    values
                                                                                ) => {
                                                                                    const {
                                                                                        value,
                                                                                    } =
                                                                                        values
                                                                                    form.setFieldValue(
                                                                                        field.name,
                                                                                        value
                                                                                    )
                                                                                    calculateJumlahHargaMaterial()
                                                                                    calculateJumlahHargaJasa()
                                                                                }}
                                                                            />
                                                                        )}
                                                                    </Field>
                                                                </FormItem>

                                                                {/* Harga Satuan Material */}
                                                                <FormItem
                                                                    label="Harga Satuan Material"
                                                                    errorMessage={
                                                                        detailErrors.tempHargaSatuanMaterial &&
                                                                        detailTouched.tempHargaSatuanMaterial
                                                                            ? detailErrors.tempHargaSatuanMaterial
                                                                            : ''
                                                                    }
                                                                    invalid={
                                                                        !!(
                                                                            detailErrors.tempHargaSatuanMaterial &&
                                                                            detailTouched.tempHargaSatuanMaterial
                                                                        )
                                                                    }
                                                                >
                                                                    <Field name="tempHargaSatuanMaterial">
                                                                        {({
                                                                            field,
                                                                            form,
                                                                        }: FieldProps) => (
                                                                            <NumericFormat
                                                                                thousandSeparator="."
                                                                                decimalSeparator=","
                                                                                prefix="Rp "
                                                                                placeholder="Masukkan harga satuan material"
                                                                                customInput={
                                                                                    Input
                                                                                }
                                                                                {...field}
                                                                                onValueChange={(
                                                                                    values
                                                                                ) => {
                                                                                    const {
                                                                                        value,
                                                                                    } =
                                                                                        values
                                                                                    form.setFieldValue(
                                                                                        field.name,
                                                                                        value
                                                                                    )
                                                                                    calculateJumlahHargaMaterial()
                                                                                }}
                                                                            />
                                                                        )}
                                                                    </Field>
                                                                </FormItem>

                                                                {/* Harga Satuan Jasa */}
                                                                <FormItem
                                                                    label="Harga Satuan Jasa"
                                                                    errorMessage={
                                                                        detailErrors.tempHargaSatuanJasa &&
                                                                        detailTouched.tempHargaSatuanJasa
                                                                            ? detailErrors.tempHargaSatuanJasa
                                                                            : ''
                                                                    }
                                                                    invalid={
                                                                        !!(
                                                                            detailErrors.tempHargaSatuanJasa &&
                                                                            detailTouched.tempHargaSatuanJasa
                                                                        )
                                                                    }
                                                                >
                                                                    <Field name="tempHargaSatuanJasa">
                                                                        {({
                                                                            field,
                                                                            form,
                                                                        }: FieldProps) => (
                                                                            <NumericFormat
                                                                                thousandSeparator="."
                                                                                decimalSeparator=","
                                                                                prefix="Rp "
                                                                                placeholder="Masukkan harga satuan jasa"
                                                                                customInput={
                                                                                    Input
                                                                                }
                                                                                {...field}
                                                                                onValueChange={(
                                                                                    values
                                                                                ) => {
                                                                                    const {
                                                                                        value,
                                                                                    } =
                                                                                        values
                                                                                    form.setFieldValue(
                                                                                        field.name,
                                                                                        value
                                                                                    )
                                                                                    calculateJumlahHargaJasa()
                                                                                }}
                                                                            />
                                                                        )}
                                                                    </Field>
                                                                </FormItem>

                                                                {/* Jumlah Harga Material */}
                                                                <FormItem label="Jumlah Harga Material">
                                                                    <Field name="tempJumlahHargaMaterial">
                                                                        {({
                                                                            field,
                                                                        }: FieldProps) => (
                                                                            <NumericFormat
                                                                                disabled
                                                                                thousandSeparator="."
                                                                                decimalSeparator=","
                                                                                prefix="Rp "
                                                                                placeholder="Jumlah harga material"
                                                                                customInput={
                                                                                    Input
                                                                                }
                                                                                {...field}
                                                                                readOnly
                                                                                value={
                                                                                    field.value ||
                                                                                    '0'
                                                                                }
                                                                            />
                                                                        )}
                                                                    </Field>
                                                                </FormItem>

                                                                {/* Jumlah Harga Jasa */}
                                                                <FormItem label="Jumlah Harga Jasa">
                                                                    <Field name="tempJumlahHargaJasa">
                                                                        {({
                                                                            field,
                                                                        }: FieldProps) => (
                                                                            <NumericFormat
                                                                                disabled
                                                                                thousandSeparator="."
                                                                                decimalSeparator=","
                                                                                prefix="Rp "
                                                                                placeholder="Jumlah harga jasa"
                                                                                customInput={
                                                                                    Input
                                                                                }
                                                                                {...field}
                                                                                readOnly
                                                                                value={
                                                                                    field.value ||
                                                                                    '0'
                                                                                }
                                                                            />
                                                                        )}
                                                                    </Field>
                                                                </FormItem>

                                                                {/* Total */}
                                                                <FormItem label="Total">
                                                                    <Field name="tempJumlah">
                                                                        {({
                                                                            field,
                                                                        }: FieldProps) => (
                                                                            <NumericFormat
                                                                                disabled
                                                                                thousandSeparator="."
                                                                                decimalSeparator=","
                                                                                prefix="Rp "
                                                                                placeholder="Total"
                                                                                customInput={
                                                                                    Input
                                                                                }
                                                                                {...field}
                                                                                readOnly
                                                                                value={
                                                                                    field.value ||
                                                                                    '0'
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
                                                                    onClick={
                                                                        handleCancelDetail
                                                                    }
                                                                    type="button"
                                                                >
                                                                    Batal
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="solid"
                                                                    onClick={
                                                                        handleSaveDetail
                                                                    }
                                                                    type="button"
                                                                    loading={
                                                                        isSubmitting
                                                                    }
                                                                >
                                                                    Simpan
                                                                </Button>
                                                            </div>
                                                        </FormContainer>
                                                    </div>
                                                )}

                                                {/* Daftar Item dan Detail Item */}
                                                {itemsByProyekData &&
                                                itemsByProyekData.length > 0 ? (
                                                    <div className="overflow-auto sm:overflow-auto">
                                                        <div className="mb-4 bg-red min-w-[1000px] sm:w-full">
                                                            {/* Header */}
                                                            <div className="grid grid-cols-5  px-4 gap-4 font-semibold bg-gray-100 py-5 rounded-t-md">
                                                                <div className="col-span-1">
                                                                    Item
                                                                </div>
                                                                <div className="col-span-1">
                                                                    Total
                                                                    Material
                                                                </div>
                                                                <div className="col-span-1">
                                                                    Total Jasa
                                                                </div>
                                                                <div className="col-span-1">
                                                                    Grand Total
                                                                </div>
                                                                <div className="col-span-1 text-right">
                                                                    Aksi
                                                                </div>
                                                            </div>

                                                            {/* Body */}
                                                            {itemsByProyekData.map(
                                                                (
                                                                    item,
                                                                    index
                                                                ) => {
                                                                    const totals =
                                                                        calculateItemTotals(
                                                                            item.DetailItemProjects
                                                                        )
                                                                    return (
                                                                        <div
                                                                            key={
                                                                                item.id
                                                                            }
                                                                            className={classNames(
                                                                                'border-b',
                                                                                {
                                                                                    'border-b-0':
                                                                                        isLastChild(
                                                                                            itemsByProyekData,
                                                                                            index
                                                                                        ),
                                                                                }
                                                                            )}
                                                                        >
                                                                            {/* Item Row */}
                                                                            <div
                                                                                className={`grid grid-cols-5 gap-4 px-4 py-4
                                                                            ${
                                                                                expandedItems[
                                                                                    index
                                                                                ]
                                                                                    ? 'bg-gray-50'
                                                                                    : 'bg-white'
                                                                            } hover:bg-gray-50`}
                                                                            >
                                                                                <div className="col-span-1 flex items-center">
                                                                                    <button
                                                                                        onClick={() =>
                                                                                            toggleItemExpand(
                                                                                                index
                                                                                            )
                                                                                        }
                                                                                        className="mr-2"
                                                                                        type="button"
                                                                                    >
                                                                                        {expandedItems[
                                                                                            index
                                                                                        ] ? (
                                                                                            <HiChevronUp />
                                                                                        ) : (
                                                                                            <HiChevronDown />
                                                                                        )}
                                                                                    </button>
                                                                                    <span className="font-semibold">
                                                                                        <Checkbox
                                                                                            defaultChecked={
                                                                                                item.status
                                                                                            }
                                                                                            onChange={(
                                                                                                checked,
                                                                                                e
                                                                                            ) =>
                                                                                                onCheck(
                                                                                                    item
                                                                                                )(
                                                                                                    checked,
                                                                                                    e
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            {
                                                                                                item.nama
                                                                                            }
                                                                                        </Checkbox>
                                                                                        {/* {
                                                                                            item.nama
                                                                                        } */}
                                                                                    </span>
                                                                                </div>
                                                                                <div className="col-span-1">
                                                                                    {formatCurrency(
                                                                                        totals.totalMaterial
                                                                                    )}
                                                                                </div>
                                                                                <div className="col-span-1">
                                                                                    {formatCurrency(
                                                                                        totals.totalJasa
                                                                                    )}
                                                                                </div>
                                                                                <div className="col-span-1">
                                                                                    {formatCurrency(
                                                                                        totals.grandTotal
                                                                                    )}
                                                                                </div>
                                                                                <div className="col-span-1 flex justify-end space-x-2">
                                                                                    <Button
                                                                                        size="xs"
                                                                                        variant="twoTone"
                                                                                        onClick={() =>
                                                                                            handleAddDetail(
                                                                                                index
                                                                                            )
                                                                                        }
                                                                                        icon={
                                                                                            <HiOutlinePlus />
                                                                                        }
                                                                                    >
                                                                                        Detail
                                                                                    </Button>
                                                                                    <Button
                                                                                        size="xs"
                                                                                        variant="twoTone"
                                                                                        onClick={() =>
                                                                                            handleEditItem(
                                                                                                index
                                                                                            )
                                                                                        }
                                                                                        icon={
                                                                                            <HiOutlinePencil />
                                                                                        }
                                                                                    />
                                                                                    <Button
                                                                                        size="xs"
                                                                                        variant="twoTone"
                                                                                        color="red"
                                                                                        onClick={() =>
                                                                                            handleConfirmDeleteItem(
                                                                                                index
                                                                                            )
                                                                                        }
                                                                                        icon={
                                                                                            <HiOutlineTrash />
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                            </div>

                                                                            {/* Detail Items Collapsible */}
                                                                            {expandedItems[
                                                                                index
                                                                            ] &&
                                                                                item
                                                                                    .DetailItemProjects
                                                                                    .length >
                                                                                    0 && (
                                                                                    <div className="bg-gray-50 p-2">
                                                                                        {/* Detail Header */}
                                                                                        <div className="grid grid-cols-10 gap-4  px-4 font-semibold items-center text-sm py-2 bg-gray-100 rounded-md">
                                                                                            <div className="col-span-2">
                                                                                                Uraian
                                                                                            </div>
                                                                                            <div className="col-span-1">
                                                                                                Satuan
                                                                                            </div>
                                                                                            <div className="col-span-1">
                                                                                                Volume
                                                                                            </div>
                                                                                            <div className="col-span-1">
                                                                                                Harga
                                                                                                Material
                                                                                            </div>
                                                                                            <div className="col-span-1">
                                                                                                Harga
                                                                                                Jasa
                                                                                            </div>
                                                                                            <div className="col-span-1">
                                                                                                Jumlah
                                                                                                Material
                                                                                            </div>
                                                                                            <div className="col-span-1">
                                                                                                Jumlah
                                                                                                Jasa
                                                                                            </div>
                                                                                            <div className="col-span-1">
                                                                                                Total
                                                                                            </div>
                                                                                            <div className="col-span-1 text-right">
                                                                                                Aksi
                                                                                            </div>
                                                                                        </div>

                                                                                        {/* Detail Rows */}
                                                                                        {item.DetailItemProjects.map(
                                                                                            (
                                                                                                detail,
                                                                                                detailIndex
                                                                                            ) => {
                                                                                                console.log(
                                                                                                    'detail',
                                                                                                    detail
                                                                                                )
                                                                                                return (
                                                                                                    <div
                                                                                                        key={
                                                                                                            detail.id
                                                                                                        }
                                                                                                        className={classNames(
                                                                                                            'grid grid-cols-10 gap-4 px-4 py-4 text-sm bg-white border-b',
                                                                                                            {
                                                                                                                'rounded-b-md border-b-0':
                                                                                                                    isLastChild(
                                                                                                                        item.DetailItemProjects,
                                                                                                                        detailIndex
                                                                                                                    ),
                                                                                                            }
                                                                                                        )}
                                                                                                    >
                                                                                                        <div className="col-span-2 truncate">
                                                                                                            {
                                                                                                                detail.uraian
                                                                                                            }
                                                                                                        </div>
                                                                                                        {/* satuan */}
                                                                                                        <div className="col-span-1">
                                                                                                            {
                                                                                                                detail.satuan
                                                                                                            }
                                                                                                        </div>
                                                                                                        <div className="col-span-1">
                                                                                                            {detail.volume.toLocaleString(
                                                                                                                'id-ID'
                                                                                                            )}
                                                                                                        </div>
                                                                                                        <div className="col-span-1">
                                                                                                            {formatCurrency(
                                                                                                                detail.harga_satuan_material
                                                                                                            )}
                                                                                                        </div>
                                                                                                        <div className="col-span-1">
                                                                                                            {formatCurrency(
                                                                                                                detail.harga_satuan_jasa
                                                                                                            )}
                                                                                                        </div>
                                                                                                        <div className="col-span-1">
                                                                                                            {formatCurrency(
                                                                                                                detail.jumlah_harga_material
                                                                                                            )}
                                                                                                        </div>
                                                                                                        <div className="col-span-1">
                                                                                                            {formatCurrency(
                                                                                                                detail.jumlah_harga_jasa
                                                                                                            )}
                                                                                                        </div>
                                                                                                        <div className="col-span-1">
                                                                                                            {formatCurrency(
                                                                                                                detail.jumlah
                                                                                                            )}
                                                                                                        </div>
                                                                                                        <div className="col-span-1 flex justify-end space-x-2">
                                                                                                            <Button
                                                                                                                size="xs"
                                                                                                                variant="twoTone"
                                                                                                                onClick={() =>
                                                                                                                    handleEditDetail(
                                                                                                                        index,
                                                                                                                        detailIndex
                                                                                                                    )
                                                                                                                }
                                                                                                                icon={
                                                                                                                    <HiOutlinePencil />
                                                                                                                }
                                                                                                            />
                                                                                                            <Button
                                                                                                                size="xs"
                                                                                                                variant="twoTone"
                                                                                                                color="red"
                                                                                                                onClick={() =>
                                                                                                                    handleConfirmDeleteDetail(
                                                                                                                        index,
                                                                                                                        detailIndex
                                                                                                                    )
                                                                                                                }
                                                                                                                icon={
                                                                                                                    <HiOutlineTrash />
                                                                                                                }
                                                                                                            />
                                                                                                        </div>
                                                                                                    </div>
                                                                                                )
                                                                                            }
                                                                                        )}
                                                                                    </div>
                                                                                )}
                                                                        </div>
                                                                    )
                                                                }
                                                            )}

                                                            {/* Grand Total Row */}
                                                            {itemsByProyekData.length >
                                                                0 && (
                                                                <div className="grid grid-cols-5 gap-4 px-4 py-5 bg-gray-100 font-semibold rounded-b-md">
                                                                    <div className="col-span-1">
                                                                        Total
                                                                        Keseluruhan
                                                                    </div>
                                                                    {(() => {
                                                                        const totals =
                                                                            calculateGrandTotal(
                                                                                itemsByProyekData
                                                                            )
                                                                        return (
                                                                            <>
                                                                                <div className="col-span-1">
                                                                                    {formatCurrency(
                                                                                        totals.totalMaterial
                                                                                    )}
                                                                                </div>
                                                                                <div className="col-span-1">
                                                                                    {formatCurrency(
                                                                                        totals.totalJasa
                                                                                    )}
                                                                                </div>
                                                                                <div className="col-span-1">
                                                                                    {formatCurrency(
                                                                                        totals.grandTotal
                                                                                    )}
                                                                                </div>
                                                                                <div className="col-span-1"></div>
                                                                            </>
                                                                        )
                                                                    })()}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-5 bg-gray-50 rounded-lg">
                                                        <HiOutlineClipboardList className="mx-auto text-4xl text-gray-400 mb-2" />
                                                        <p className="text-gray-500">
                                                            Belum ada item yang
                                                            ditambahkan
                                                        </p>
                                                        <Button
                                                            size="sm"
                                                            variant="twoTone"
                                                            onClick={
                                                                handleAddItem
                                                            }
                                                            className="w-fit mt-3"
                                                            type="button"
                                                        >
                                                            Tambah Item
                                                        </Button>
                                                    </div>
                                                )}

                                                {/* Confirmation Dialogs */}
                                                <ConfirmDialog
                                                    isOpen={itemDialogOpen}
                                                    onClose={
                                                        handleCancelDeleteItem
                                                    }
                                                    onConfirm={handleDeleteItem}
                                                    title="Hapus Item"
                                                    confirmButtonColor="red-600"
                                                >
                                                    <p>
                                                        Apakah Anda yakin ingin
                                                        menghapus item ini dan
                                                        semua detail di
                                                        dalamnya?
                                                        <br />
                                                        Tindakan ini tidak dapat
                                                        dibatalkan.
                                                    </p>
                                                </ConfirmDialog>

                                                <ConfirmDialog
                                                    isOpen={detailDialogOpen}
                                                    onClose={
                                                        handleCancelDeleteDetail
                                                    }
                                                    onConfirm={
                                                        handleDeleteDetail
                                                    }
                                                    title="Hapus Detail Item"
                                                    confirmButtonColor="red-600"
                                                >
                                                    <p>
                                                        Apakah Anda yakin ingin
                                                        menghapus detail item
                                                        ini?
                                                        <br />
                                                        Tindakan ini tidak dapat
                                                        dibatalkan.
                                                    </p>
                                                </ConfirmDialog>
                                            </>
                                        )
                                    }}
                                </Formik>
                            </AdaptableCard>
                        </Form>
                    )
                }}
            </Formik>
        </Loading>
    )
}
