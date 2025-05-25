import { ConfirmDialog, Loading } from '@/components/shared'
import { useAppDispatch } from '@/store'
import React, { useEffect, useState } from 'react'
import {
    getFakturPajakByProyekId,
    getTermins,
    updateFakturPajak,
    useAppSelector,
} from '../../ProyekEdit/store'
import {
    Button,
    DatePicker,
    Dialog,
    FormItem,
    Input,
    Notification,
    toast,
} from '@/components/ui'
import { Formik, Form, Field, FieldProps } from 'formik'
import * as Yup from 'yup'
import dayjs from 'dayjs'
import { NumericFormat } from 'react-number-format'
import {
    apiCreateFakturPajak,
    apiDeleteFakturPajaks,
    apiUpdateStatusFaktur,
} from '@/services/FakturPajakService'
import {
    apiCreateTermin,
    apiGetOneTermin,
    apiEditTermin,
    apiDeleteTermin,
    apiGetTermin,
} from '@/services/TerminService'
import {
    extractIntegerFromStringAndFloat,
    extractNumberFromString,
} from '@/utils/extractNumberFromString'
import DescriptionSection from './DesriptionSection'
import { formatDate } from '@/utils/formatDate'
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import { IoIosAdd, IoIosCheckmark } from 'react-icons/io'

// Define missing interfaces
export interface SetSubmitting {
    (isSubmitting: boolean): void
}

export interface FormModel {
    nomor: string
    nominal: number
    tanggal: string
    keterangan?: string
    // Add any other properties needed for the API
}

// Schema validasi untuk form faktur
const FakturSchema = Yup.object().shape({
    nomor: Yup.string().required('Nomor wajib diisi'),
    tanggal: Yup.string().required('Tanggal wajib diisi'),
    keterangan: Yup.string(),
})

// Interface untuk nilai awal form faktur
interface FakturFormValues {
    nomor: string
    nominal: number
    tanggal: string
    keterangan?: string
}

// Schema validasi untuk form termin
const TerminSchema = Yup.object().shape({
    // persen: Yup.number()
    //     .required('Persentase wajib diisi')
    //     .min(0, 'Persentase minimal 0')
    //     .max(100, 'Persentase maksimal 100'),
    // nilai_termin: Yup.number().required('Nilai termin wajib diisi'),
    keterangan: Yup.string().required('Keterangan wajib diisi'),
})

// Interface untuk nilai awal form termin
interface TerminFormValues {
    persen: number | string
    keterangan: string
}

export default function Termin() {
    const dispatch = useAppDispatch()
    // Faktur states
    const [dialogIsOpen, setIsOpen] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [selectedTermin, setSelectedTermin] = useState<any>(null)
    const [selectedFakturId, setSelectedFakturId] = useState<string | null>(
        null
    )
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [formInitialValues, setFormInitialValues] =
        useState<FakturFormValues>({
            nomor: '',
            nominal: 0,
            tanggal: '',
            keterangan: '',
        })

    // Termin states
    const [terminDialogIsOpen, setTerminDialogIsOpen] = useState(false)
    const [isEditTerminMode, setIsEditTerminMode] = useState(false)
    const [selectedTerminToEdit, setSelectedTerminToEdit] = useState<any>(null)
    const [terminDeleteConfirmOpen, setTerminDeleteConfirmOpen] =
        useState(false)
    const [terminFormInitialValues, setTerminFormInitialValues] =
        useState<TerminFormValues>({
            persen: 0,
            keterangan: '',
        })

    // Get project ID from path
    const getProjectId = () => {
        return location.pathname.substring(
            location.pathname.lastIndexOf('/') + 1
        )
    }

    // Redux state
    const terminsData = useAppSelector(
        (state) => state.proyekEdit.data.terminsData
    )

    const FakturPajakByProyekData = useAppSelector(
        (state) => state.proyekEdit.data.fakturPajakByProyekData
    )

    const loadingTermins = useAppSelector(
        (state) => state.proyekEdit.data.loadingTermins
    )

    const loadingFakturPajakByProyekData = useAppSelector(
        (state) => state.proyekEdit.data.loadingFakturPajakByProyekData
    )

    // Calculate total percentage used
    const calculateTotalPercentage = () => {
        if (!terminsData || terminsData.length === 0) return 0
        return terminsData.reduce(
            (sum, termin) => sum + (termin.persen || 0),
            0
        )
    }

    const totalPercentageUsed = calculateTotalPercentage()
    const remainingPercentage = 100 - totalPercentageUsed

    /* ========================= FAKTUR HANDLING ========================= */

    const openDialog = (termin: any, isEdit = false) => {
        setSelectedTermin(termin)
        setIsEditMode(isEdit)

        // Reset form values to default for adding new faktur
        if (!isEdit) {
            setFormInitialValues({
                nomor: '',
                nominal: 0,
                tanggal: '',
                keterangan: '',
            })
        } else {
            // For edit mode, find the faktur data to pre-populate form
            const fakturToEdit = FakturPajakByProyekData?.find(
                (faktur) => faktur.id === termin.FakturPajak?.id
            )

            if (fakturToEdit) {
                setFormInitialValues({
                    nomor: fakturToEdit.nomor || '',
                    nominal: fakturToEdit.nominal || 0,
                    tanggal: fakturToEdit.tanggal || '',
                    keterangan: fakturToEdit.keterangan || '',
                })
            }
        }

        setIsOpen(true)
    }

    const onDialogClose = () => {
        setIsOpen(false)
        setIsEditMode(false)
    }

    // Notification helper
    const popNotification = (action: string, type: string = 'Faktur') => {
        toast.push(
            <Notification
                title={`Successfully ${action}`}
                type="success"
                duration={2500}
            >
                {type} successfully {action}
            </Notification>,
            {
                placement: 'top-center',
            }
        )
    }

    const handleSubmit = async (
        values: FakturFormValues,
        { setSubmitting }: { setSubmitting: SetSubmitting }
    ) => {
        setSubmitting(true)

        const processedData = {
            ...values,
            nominal: extractIntegerFromStringAndFloat(
                values.nominal as unknown as string | number
            ),
            idTerminProject: selectedTermin?.id || '',
            idProject: selectedTermin?.idProject || '',
        }

        try {
            let success = false
            if (isEditMode) {
                // Update existing faktur
                const fakturId = selectedTermin?.FakturPajak

                const updateData = {
                    ...processedData,
                    id: fakturId.id,
                }

                success = await updateFakturPajak<boolean, FormModel>({
                    ...updateData,
                })
                if (success) {
                    popNotification('updated')
                }
            } else {
                // Create new faktur
                success = await apiCreateFakturPajak<boolean, FormModel>(
                    processedData
                )
                if (success) {
                    popNotification('added')
                }
            }

            if (success) {
                // Refresh termins data if needed
                fetchData({ id: getProjectId() })
            }
        } catch (error) {
            console.error(
                `Error ${isEditMode ? 'updating' : 'creating'} faktur pajak:`,
                error
            )
            toast.push(
                <Notification
                    title={`${isEditMode ? 'Update' : 'Create'} Failed`}
                    type="danger"
                    duration={2500}
                >
                    Failed to {isEditMode ? 'update' : 'create'} faktur
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        } finally {
            setSubmitting(false)
            setIsOpen(false)
        }
    }

    // Fungsi untuk mengedit faktur
    const handleEditFaktur = (termin: any) => {
        openDialog(termin, true)
    }

    // Fungsi untuk membuka dialog konfirmasi delete faktur
    const handleConfirmDeleteFaktur = (fakturData: any) => {
        setSelectedFakturId(fakturData)
        setDeleteConfirmOpen(true)
    }

    // Fungsi untuk menutup dialog konfirmasi
    const handleCancelDeleteFaktur = () => {
        setDeleteConfirmOpen(false)
        setSelectedFakturId(null)
    }

    const handleDeleteFaktur = async () => {
        if (!selectedFakturId) return

        try {
            const fakturId = selectedFakturId.FakturPajak?.id
            if (!fakturId) {
                console.error('Invalid faktur ID')
                return
            }

            const success = await apiDeleteFakturPajaks(fakturId)

            if (success) {
                popNotification('deleted')
                fetchData({ id: getProjectId() })
            }
        } catch (error) {
            console.error('Error deleting faktur:', error)
            toast.push(
                <Notification
                    title={`Delete Failed`}
                    type="danger"
                    duration={2500}
                >
                    Failed to delete faktur
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        } finally {
            setDeleteConfirmOpen(false)
            setSelectedFakturId(null)
        }
    }

    /* ========================= TERMIN HANDLING ========================= */

    // Open termin dialog
    const openTerminDialog = (termin: any = null, isEdit = false) => {
        setIsEditTerminMode(isEdit)
        setSelectedTerminToEdit(termin)

        if (isEdit && termin) {
            setTerminFormInitialValues({
                persen: termin.persen || 0,
                keterangan: termin.keterangan || '',
            })
        } else {
            // For new termin
            setTerminFormInitialValues({
                persen: 0,
                keterangan: '',
            })
        }

        setTerminDialogIsOpen(true)
    }

    // Close termin dialog
    const onTerminDialogClose = () => {
        setTerminDialogIsOpen(false)
        setIsEditTerminMode(false)
        setSelectedTerminToEdit(null)
    }

    // Handle termin form submission
    const handleTerminSubmit = async (
        values: TerminFormValues,
        { setSubmitting }: { setSubmitting: SetSubmitting }
    ) => {
        setSubmitting(true)
        console.log('processedData before', { ...values })
        const projectId = getProjectId()

        const processedData = {
            ...values,
            persen: extractNumberFromString(values.persen),
            idProject: projectId,
        }
        console.log('processedData after', processedData)

        try {
            let success = false
            if (isEditTerminMode && selectedTerminToEdit) {
                // Update existing termin
                const updateData = {
                    ...processedData,
                    id: selectedTerminToEdit.id,
                }

                success = await apiEditTermin(updateData)
                if (success) {
                    popNotification('updated', 'Termin')
                }
            } else {
                // Create new termin
                success = await apiCreateTermin(processedData)
                if (success) {
                    popNotification('added', 'Termin')
                }
            }

            if (success) {
                // Refresh termins data
                fetchData({ id: projectId })
            }
        } catch (error) {
            console.error(
                `Error ${isEditTerminMode ? 'updating' : 'creating'} termin:`,
                error
            )
            toast.push(
                <Notification
                    title={`${isEditTerminMode ? 'Update' : 'Create'} Failed`}
                    type="danger"
                    duration={2500}
                >
                    Failed to {isEditTerminMode ? 'update' : 'create'} termin
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        } finally {
            setSubmitting(false)
            setTerminDialogIsOpen(false)
        }
    }

    // Handle termin edit
    const handleEditTermin = (termin: any) => {
        openTerminDialog(termin, true)
    }

    // Handle confirm delete termin
    const handleConfirmDeleteTermin = (termin: any) => {
        setSelectedTerminToEdit(termin)
        setTerminDeleteConfirmOpen(true)
    }

    // Cancel delete termin
    const handleCancelDeleteTermin = () => {
        setTerminDeleteConfirmOpen(false)
        setSelectedTerminToEdit(null)
    }

    // Delete termin
    const handleDeleteTermin = async () => {
        if (!selectedTerminToEdit?.id) return

        try {
            const success = await apiDeleteTermin(selectedTerminToEdit)

            if (success) {
                popNotification('deleted', 'Termin')
                fetchData({ id: getProjectId() })
            }
        } catch (error) {
            console.error('Error deleting termin:', error)
            toast.push(
                <Notification
                    title={`Delete Failed`}
                    type="danger"
                    duration={2500}
                >
                    Failed to delete termin
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        } finally {
            setTerminDeleteConfirmOpen(false)
            setSelectedTerminToEdit(null)
        }
    }

    /* ========================= COMMON FUNCTIONS ========================= */

    const fetchData = (data: { id: string }) => {
        dispatch(getTermins(data)) // by id
        dispatch(getFakturPajakByProyekId(data))
    }

    const handleUpdateStatusFaktur = async (fakturData: any) => {
        try {
            const fakturDataUpdated = {
                id: fakturData.id,
                status: 'Sudah Bayar',
            }
            const result = await apiUpdateStatusFaktur(fakturDataUpdated)

            if (result.data.statusCode === 200) {
                popNotification('updated', 'Status Faktur')
                fetchData({ id: getProjectId() })
            } else {
                toast.push(
                    <Notification
                        title="Update Status Failed"
                        type="danger"
                        duration={2500}
                    >
                        Gagal memperbarui status faktur
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
            }
        } catch (error) {
            console.error('Error updating status faktur:', error)
            toast.push(
                <Notification
                    title="Update Status Failed"
                    type="danger"
                    duration={2500}
                >
                    Gagal memperbarui status faktur
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        }
    }

    useEffect(() => {
        const projectId = getProjectId()
        const requestParam = { id: projectId }
        fetchData(requestParam)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname])

    return (
        <>
            <Loading loading={loadingTermins || loadingFakturPajakByProyekData}>
                <div className="flex flex-col py-6 space-y-2">
                    <div className="flex flex-row justify-between items-center">
                        <div>
                            <DescriptionSection
                                title="Termin"
                                desc="Tambahkan data termin dan faktur"
                            />
                            <div className="mt-2 text-sm">
                                Total:{' '}
                                <span className="font-bold">
                                    {totalPercentageUsed}%
                                </span>{' '}
                                ({remainingPercentage}% remaining)
                            </div>
                        </div>
                        <Button
                            size="sm"
                            variant="twoTone"
                            onClick={() => openTerminDialog()}
                            className="w-fit text-xs"
                            disabled={remainingPercentage <= 0}
                        >
                            Tambah Termin
                        </Button>
                    </div>
                    {terminsData?.length === 0 && (
                        <div className="text-center py-8 bg-slate-50 rounded-md">
                            Belum ada termin yang ditambahkan
                        </div>
                    )}
                    <div className="overflow-x-auto">
                        <div className="min-w-[400px]">
                            {terminsData?.map((termin, index) => {
                                // map semua termin yang ada pada proyek ini
                                // find data faktur pajak by project dengan termin.idFakturPajak
                                const fakturByTermin =
                                    FakturPajakByProyekData?.find(
                                        (faktur) =>
                                            faktur.id === termin.FakturPajak?.id
                                    )

                                return (
                                    <div
                                        key={index}
                                        className={` flex flex-row 
                                    ${
                                        index === 0
                                            ? 'rounded-t-md border'
                                            : index === terminsData.length - 1
                                            ? 'rounded-b-md border-b border-x'
                                            : 'border-b border-x'
                                    }
                                         sm:flex-row justify-center sm:justify-between`}
                                    >
                                        <div className="border-r p-6 flex flex-1 flex-row ">
                                            <div className="flex flex-col w-full items-center sm:items-start ">
                                                <span>{termin.keterangan}</span>
                                                <span className="font-bold text-2xl">
                                                    {termin.persen}%
                                                </span>
                                                <div>
                                                    Rp.{' '}
                                                    {termin.nilai_termin?.toLocaleString(
                                                        'id-ID'
                                                    )}
                                                </div>
                                            </div>

                                            <div className=" w-full flex space-x-2 justify-center sm:justify-end ">
                                                <div>
                                                    {!termin.FakturPajak
                                                        ?.id && (
                                                        <Button
                                                            type="button"
                                                            shape="circle"
                                                            variant="twoTone"
                                                            size="sm"
                                                            icon={<IoIosAdd />}
                                                            className="text-indigo-500"
                                                            onClick={() =>
                                                                openDialog(
                                                                    termin
                                                                )
                                                            }
                                                        >
                                                            Faktur
                                                        </Button>
                                                    )}

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
                                                            handleEditTermin(
                                                                termin
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
                                                            handleConfirmDeleteTermin(
                                                                termin
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Jika faktur ada tampilkan button edit dan delete faktur */}
                                        {termin.FakturPajak?.id && (
                                            <>
                                                {fakturByTermin && (
                                                    <div className="bg-white flex-1 p-6 w-full flex flex-col sm:flex-row gap-4 rounded-lg justify-between">
                                                        <div className="flex flex-col items-center sm:items-start ">
                                                            <div>
                                                                <span>
                                                                    Nomor
                                                                    Faktur:{' '}
                                                                </span>
                                                                {fakturByTermin.nomor ||
                                                                    '-'}
                                                            </div>
                                                            <div>
                                                                <span>
                                                                    Nominal :{' '}
                                                                </span>
                                                                {fakturByTermin.nominal?.toLocaleString(
                                                                    'id-ID'
                                                                ) || '-'}
                                                            </div>
                                                            <div>
                                                                <span>
                                                                    Tanggal :{' '}
                                                                </span>
                                                                {formatDate(
                                                                    fakturByTermin.tanggal ||
                                                                        ''
                                                                ) || '-'}
                                                            </div>
                                                            {fakturByTermin.keterangan && (
                                                                <div>
                                                                    <span>
                                                                        Keterangan
                                                                        :{' '}
                                                                    </span>
                                                                    {
                                                                        fakturByTermin.keterangan
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex space-x-6 sm:space-x-0 justify-center sm:justify-start">
                                                            <Button
                                                                type="button"
                                                                shape="circle"
                                                                variant="twoTone"
                                                                size="sm"
                                                                icon={
                                                                    <IoIosCheckmark />
                                                                }
                                                                className="text-indigo-500"
                                                                onClick={() =>
                                                                    handleUpdateStatusFaktur(
                                                                        fakturByTermin
                                                                    )
                                                                }
                                                                disabled={
                                                                    fakturByTermin.status ===
                                                                        'Sudah Bayar' &&
                                                                    true
                                                                }
                                                            >
                                                                {fakturByTermin.status ===
                                                                'Sudah Bayar'
                                                                    ? 'Sudah Bayar'
                                                                    : 'Update Status'}
                                                            </Button>

                                                            {fakturByTermin.status !==
                                                                'Sudah Bayar' && (
                                                                <>
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
                                                                            handleEditFaktur(
                                                                                termin
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
                                                                            handleConfirmDeleteFaktur(
                                                                                termin
                                                                            )
                                                                        }
                                                                    />
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Form for Faktur */}
                <Formik
                    initialValues={formInitialValues}
                    validationSchema={FakturSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize={true}
                >
                    {({ errors, touched, isSubmitting }) => (
                        <>
                            <Dialog
                                isOpen={dialogIsOpen}
                                onClose={onDialogClose}
                                onRequestClose={onDialogClose}
                            >
                                <Form>
                                    <h5 className="mb-4">
                                        {isEditMode
                                            ? 'Edit Faktur'
                                            : 'Tambah Faktur'}
                                    </h5>

                                    {/* Form */}
                                    <div className="flex flex-col max-h-[60vh] overflow-y-auto border-b-[1px] pb-4">
                                        {/* Nomor */}
                                        <FormItem
                                            label="Nomor"
                                            invalid={
                                                (errors.nomor &&
                                                    touched.nomor) as boolean
                                            }
                                            errorMessage={errors.nomor}
                                        >
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="nomor"
                                                placeholder="Nomor"
                                                component={Input}
                                            />
                                        </FormItem>

                                        {/* Nominal */}
                                        <FormItem
                                            label="Nominal"
                                            invalid={
                                                (errors.nominal &&
                                                    touched.nominal) as boolean
                                            }
                                            errorMessage={errors.nominal}
                                        >
                                            <Field name="nominal">
                                                {({
                                                    field,
                                                    form,
                                                }: FieldProps) => (
                                                    <NumericFormat
                                                        {...field}
                                                        customInput={Input}
                                                        placeholder="0"
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
                                        {/* Tanggal */}
                                        <FormItem
                                            label="Tanggal"
                                            invalid={
                                                (errors.tanggal &&
                                                    touched.tanggal) as boolean
                                            }
                                            errorMessage={errors.tanggal}
                                        >
                                            <Field name="tanggal">
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
                                                        onChange={(date) => {
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
                                        {/* Keterangan */}
                                        <FormItem
                                            label="Keterangan"
                                            invalid={
                                                (errors.keterangan &&
                                                    touched.keterangan) as boolean
                                            }
                                            errorMessage={errors.keterangan}
                                        >
                                            <Field
                                                textArea
                                                name="keterangan"
                                                placeholder="Masukkan keterangan"
                                                component={Input}
                                            />
                                        </FormItem>
                                    </div>
                                    {/* Button Dialog Option */}
                                    <div className="text-right mt-6">
                                        <Button
                                            className="ltr:mr-2 rtl:ml-2"
                                            variant="plain"
                                            onClick={onDialogClose}
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
                                            {isEditMode ? 'Update' : 'Simpan'}
                                        </Button>
                                    </div>
                                </Form>
                            </Dialog>
                            <ConfirmDialog
                                isOpen={deleteConfirmOpen}
                                type="danger"
                                title="Hapus Faktur"
                                confirmButtonColor="red-600"
                                onClose={handleCancelDeleteFaktur}
                                onRequestClose={handleCancelDeleteFaktur}
                                onCancel={handleCancelDeleteFaktur}
                                onConfirm={handleDeleteFaktur}
                            >
                                <p>
                                    Apakah kamu yakin ingin menghapus faktur
                                    pada termin ini?
                                </p>
                            </ConfirmDialog>
                        </>
                    )}
                </Formik>

                {/* Form for Termin */}
                <Formik
                    initialValues={terminFormInitialValues}
                    validationSchema={TerminSchema}
                    onSubmit={handleTerminSubmit}
                    enableReinitialize={true}
                >
                    {({
                        errors,
                        touched,
                        isSubmitting,
                        values,
                        setFieldValue,
                    }) => (
                        <>
                            <Dialog
                                isOpen={terminDialogIsOpen}
                                onClose={onTerminDialogClose}
                                onRequestClose={onTerminDialogClose}
                            >
                                <Form>
                                    <h5 className="mb-4">
                                        {isEditTerminMode
                                            ? 'Edit Termin'
                                            : 'Tambah Termin'}
                                    </h5>
                                    {!isEditTerminMode && (
                                        <div className="mb-4 p-2 bg-blue-50 text-blue-600 rounded-md">
                                            Tersisa {remainingPercentage}% dari
                                            total
                                        </div>
                                    )}

                                    {/* Form Termin */}
                                    <div className="flex flex-col max-h-[60vh] overflow-y-auto border-b-[1px] pb-4">
                                        {/* Persentase */}
                                        <FormItem
                                            label="Persentase (%)"
                                            invalid={
                                                (errors.persen &&
                                                    touched.persen) as boolean
                                            }
                                            errorMessage={errors.persen}
                                        >
                                            <Field name="persen">
                                                {({
                                                    field,
                                                    form,
                                                }: FieldProps) => (
                                                    <NumericFormat
                                                        {...field}
                                                        customInput={Input}
                                                        placeholder="0"
                                                        suffix="%"
                                                        allowNegative={false}
                                                        decimalScale={2}
                                                        isAllowed={(values) => {
                                                            const {
                                                                floatValue,
                                                            } = values
                                                            // For edit mode, allow existing value or for new values, ensure not exceeding 100
                                                            return isEditTerminMode
                                                                ? floatValue !==
                                                                      undefined &&
                                                                      floatValue >=
                                                                          0 &&
                                                                      floatValue <=
                                                                          100
                                                                : floatValue !==
                                                                      undefined &&
                                                                      floatValue >=
                                                                          0 &&
                                                                      floatValue <=
                                                                          remainingPercentage
                                                        }}
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

                                        {/* Keterangan */}
                                        <FormItem
                                            label="Keterangan"
                                            invalid={
                                                (errors.keterangan &&
                                                    touched.keterangan) as boolean
                                            }
                                            errorMessage={errors.keterangan}
                                        >
                                            <Field
                                                name="keterangan"
                                                placeholder="Masukkan keterangan termin"
                                                component={Input}
                                            />
                                        </FormItem>
                                    </div>
                                    {/* Button Dialog Option */}
                                    <div className="text-right mt-6">
                                        <Button
                                            className="ltr:mr-2 rtl:ml-2"
                                            variant="plain"
                                            onClick={onTerminDialogClose}
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
                                            {isEditTerminMode
                                                ? 'Update'
                                                : 'Simpan'}
                                        </Button>
                                    </div>
                                </Form>
                            </Dialog>
                            <ConfirmDialog
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
                                    Apakah kamu yakin ingin menghapus termin
                                    ini?
                                    {selectedTerminToEdit?.FakturPajak?.id && (
                                        <span className="block mt-2 text-red-500">
                                            Faktur yang terkait dengan termin
                                            ini juga akan dihapus!
                                        </span>
                                    )}
                                </p>
                            </ConfirmDialog>
                        </>
                    )}
                </Formik>
            </Loading>
        </>
    )
}
