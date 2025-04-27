import React, { useState, useEffect } from 'react'
import { Field, FieldArray, Form, Formik } from 'formik'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { HiMinus, HiPencilAlt } from 'react-icons/hi'
import AdaptableCard from '@/components/shared/AdaptableCard'
import { Loading } from '@/components/shared'
import * as Yup from 'yup'

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

// Form values type
type FormValues = {
    purchases: PurchaseOrder[]
    tempPabrik: string
    tempHarga: number | string
    tempEstimasi: number | string
    tempIdProject: string
}

// Dummy data matching your API response format
const DUMMY_DATA: PurchaseOrder[] = [
    {
        id: 'e35e4ac6-bf44-4bd3-8fdd-a203398e6bb2',
        nomor_po: '1000',
        nama: 'PO PERTAMA',
        tanggal_po: '2025-10-10T00:00:00.000Z',
        pabrik: 'PABRIK PERTAMA',
        harga: 10000,
        status: 'SELESAI',
        estimasi_pengerjaan: 100,
        idProject: 'd1f61398-f0fa-4d01-9613-cf284ef35b8b',
        createdAt: '2025-04-26T15:09:40.213Z',
        updatedAt: '2025-04-26T15:09:40.213Z',
    },
]

// Validation schema for the form fields
const validationSchema = Yup.object().shape({
    tempPabrik: Yup.string().required('Pabrik harus diisi'),
    tempHarga: Yup.number()
        .required('Harga harus diisi')
        .min(1, 'Harga minimal 1'),
    tempEstimasi: Yup.number()
        .required('Estimasi pengerjaan harus diisi')
        .min(1, 'Estimasi minimal 1 hari'),
    tempIdProject: Yup.string().required('ID Project harus diisi'),
})

const PurchaseOrder = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
    const [showForm, setShowForm] = useState(false)
    const [editIndex, setEditIndex] = useState<number | null>(null)

    // Simulate API fetch
    useEffect(() => {
        const fetchData = async () => {
            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 500))
            setPurchaseOrders(DUMMY_DATA)
            setIsLoading(false)
        }

        fetchData()
    }, [])

    // Function to create a new purchase order (simulated API call)
    const createPurchaseOrder = async (data: CreatePurchaseOrderRequest) => {
        setIsLoading(true)

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Create a new PO with dummy data + the form data
        const newPO: PurchaseOrder = {
            id: `po-${Math.random().toString(36).substring(2, 9)}`,
            nomor_po: `${1000 + purchaseOrders.length}`,
            nama: `PO ${purchaseOrders.length + 1}`,
            tanggal_po: new Date().toISOString(),
            pabrik: data.pabrik,
            harga: data.harga,
            status: 'PROSES',
            estimasi_pengerjaan: data.estimasi_pengerjaan,
            idProject: data.idProject,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        // Update state with the new PO
        setPurchaseOrders([...purchaseOrders, newPO])
        setIsLoading(false)

        return newPO
    }

    // Initialize form values
    const initialValues: FormValues = {
        purchases: purchaseOrders,
        tempPabrik: '',
        tempHarga: '',
        tempEstimasi: '',
        // Using a default project ID until you implement a way to get it
        tempIdProject: 'd1f61398-f0fa-4d01-9613-cf284ef35b8b',
    }

    return (
        <Loading loading={isLoading}>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) => {
                    // Do nothing on form submit - we handle save button separately
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
                    }

                    const handleSave = async () => {
                        // Validate the fields first
                        await validateField('tempPabrik')
                        await validateField('tempHarga')
                        await validateField('tempEstimasi')

                        if (
                            !errors.tempPabrik &&
                            !errors.tempHarga &&
                            !errors.tempEstimasi
                        ) {
                            const requestData: CreatePurchaseOrderRequest = {
                                pabrik: values.tempPabrik,
                                harga: Number(values.tempHarga),
                                estimasi_pengerjaan: Number(
                                    values.tempEstimasi
                                ),
                                idProject: values.tempIdProject,
                            }

                            if (editIndex !== null) {
                                // Handle edit (in a real scenario, you'd call an update API)
                                const updatedPurchases = [...purchaseOrders]
                                updatedPurchases[editIndex] = {
                                    ...updatedPurchases[editIndex],
                                    pabrik: requestData.pabrik,
                                    harga: requestData.harga,
                                    estimasi_pengerjaan:
                                        requestData.estimasi_pengerjaan,
                                    updatedAt: new Date().toISOString(),
                                }
                                setPurchaseOrders(updatedPurchases)
                            } else {
                                // Handle create
                                await createPurchaseOrder(requestData)
                            }

                            // Reset form and close
                            setFieldValue('tempPabrik', '')
                            setFieldValue('tempHarga', '')
                            setFieldValue('tempEstimasi', '')
                            setShowForm(false)
                            setEditIndex(null)
                        }
                    }

                    const handleCancel = () => {
                        setShowForm(false)
                        setEditIndex(null)

                        // Reset temp values
                        setFieldValue('tempPabrik', '')
                        setFieldValue('tempHarga', '')
                        setFieldValue('tempEstimasi', '')
                    }

                    const handleEdit = (index: number) => {
                        const purchase = purchaseOrders[index]

                        // Set temporary values for editing
                        setFieldValue('tempPabrik', purchase.pabrik)
                        setFieldValue('tempHarga', purchase.harga)
                        setFieldValue(
                            'tempEstimasi',
                            purchase.estimasi_pengerjaan
                        )
                        setFieldValue('tempIdProject', purchase.idProject)

                        setEditIndex(index)
                        setShowForm(true)
                    }

                    const handleDelete = async (index: number) => {
                        // In a real scenario, you'd call a delete API
                        const updatedPurchases = [...purchaseOrders]
                        updatedPurchases.splice(index, 1)
                        setPurchaseOrders(updatedPurchases)
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
                                            Tambah Faktur
                                        </Button>
                                    )}
                                </div>

                                {/* Form untuk input purchase order */}
                                {showForm && (
                                    <div className="mb-4 border rounded-md p-4">
                                        <h6 className="mb-3">
                                            {editIndex !== null
                                                ? 'Edit Faktur'
                                                : 'Tambah Faktur Baru'}
                                        </h6>

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
                                            <Field
                                                type="number"
                                                autoComplete="off"
                                                name="tempHarga"
                                                placeholder="Harga"
                                                component={Input}
                                            />
                                        </FormItem>

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
                                            >
                                                Simpan
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Daftar purchase order */}
                                {purchaseOrders.map((purchase, index) => {
                                    // If currently editing this item, don't show it in the list
                                    if (editIndex === index) {
                                        return null
                                    }

                                    return (
                                        <div
                                            key={purchase.id}
                                            className="mb-4 border rounded-md p-4"
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <h6>{purchase.pabrik}</h6>
                                                <div className="flex space-x-2">
                                                    <Button
                                                        type="button"
                                                        shape="circle"
                                                        variant="plain"
                                                        size="sm"
                                                        icon={<HiPencilAlt />}
                                                        onClick={() =>
                                                            handleEdit(index)
                                                        }
                                                    />
                                                    <Button
                                                        type="button"
                                                        shape="circle"
                                                        variant="plain"
                                                        size="sm"
                                                        icon={<HiMinus />}
                                                        onClick={() =>
                                                            handleDelete(index)
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <span className="text-sm text-gray-500">
                                                        Nomor PO:
                                                    </span>
                                                    <p>{purchase.nomor_po}</p>
                                                </div>
                                                <div>
                                                    <span className="text-sm text-gray-500">
                                                        Nama:
                                                    </span>
                                                    <p>{purchase.nama}</p>
                                                </div>
                                                <div>
                                                    <span className="text-sm text-gray-500">
                                                        Harga:
                                                    </span>
                                                    <p>
                                                        Rp{' '}
                                                        {purchase.harga.toLocaleString()}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-sm text-gray-500">
                                                        Estimasi Pengerjaan:
                                                    </span>
                                                    <p>
                                                        {
                                                            purchase.estimasi_pengerjaan
                                                        }{' '}
                                                        hari
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-sm text-gray-500">
                                                        Status:
                                                    </span>
                                                    <p>{purchase.status}</p>
                                                </div>
                                                <div>
                                                    <span className="text-sm text-gray-500">
                                                        Tanggal PO:
                                                    </span>
                                                    <p>
                                                        {new Date(
                                                            purchase.tanggal_po
                                                        ).toLocaleDateString(
                                                            'id-ID'
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}

                                {purchaseOrders.length === 0 && !showForm && (
                                    <div className="text-center py-8 text-gray-500">
                                        Belum ada data faktur. Klik 'Tambah
                                        Faktur' untuk menambahkan.
                                    </div>
                                )}
                            </AdaptableCard>
                        </Form>
                    )
                }}
            </Formik>
        </Loading>
    )
}

export default PurchaseOrder
