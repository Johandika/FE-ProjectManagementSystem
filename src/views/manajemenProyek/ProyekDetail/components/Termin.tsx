// import { ConfirmDialog, Loading } from '@/components/shared'
// import { useAppDispatch } from '@/store'
// import React, { useEffect, useState } from 'react'
// import {
//     getFakturPajakByProyekId,
//     getTermins,
//     useAppSelector,
// } from '../../ProyekEdit/store'
// import {
//     Button,
//     DatePicker,
//     Dialog,
//     FormItem,
//     Input,
//     Notification,
//     toast,
// } from '@/components/ui'
// import { Formik, Form, Field, FieldProps } from 'formik'
// import * as Yup from 'yup'
// import dayjs from 'dayjs'
// import { NumericFormat } from 'react-number-format'
// import {
//     apiCreateFakturPajak,
//     apiDeleteFakturPajaks,
// } from '@/services/FakturPajakService'
// import { extractIntegerFromStringAndFloat } from '@/utils/extractNumberFromString'
// import DescriptionSection from './DesriptionSection'
// import { formatDate } from '@/utils/formatDate'
// import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'

// // Define missing interfaces
// export interface SetSubmitting {
//     (isSubmitting: boolean): void
// }

// export interface FormModel {
//     nomor: string
//     nominal: number
//     tanggal: string
//     // Add any other properties needed for the API
// }

// // Schema validasi untuk form faktur
// const FakturSchema = Yup.object().shape({
//     nomor: Yup.string().required('Nomor wajib diisi'),
//     tanggal: Yup.string().required('Tanggal wajib diisi'),
// })

// // Interface untuk nilai awal form
// interface FakturFormValues {
//     nomor: string
//     nominal: number
//     tanggal: string
// }

// export default function Termin() {
//     const dispatch = useAppDispatch()
//     const [dialogIsOpen, setIsOpen] = useState(false)
//     const [selectedTermin, setSelectedTermin] = useState<any>(null)
//     const [selectedFakturId, setSelectedFakturId] = useState<string | null>(
//         null
//     )
//     const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

//     // Nilai awal untuk form
//     const initialValues: FakturFormValues = {
//         nomor: '',
//         nominal: 0,
//         tanggal: '',
//     }

//     const openDialog = (termin: any) => {
//         setSelectedTermin(termin)
//         setIsOpen(true)
//     }

//     const onDialogClose = (e: React.MouseEvent) => {
//         setIsOpen(false)
//     }

//     const popNotification = (keyword: string) => {
//         toast.push(
//             <Notification
//                 title={`Successfuly ${keyword}`}
//                 type="success"
//                 duration={2500}
//             >
//                 Faktur successfuly {keyword}
//             </Notification>,
//             {
//                 placement: 'top-center',
//             }
//         )
//     }

//     const handleSubmit = async (
//         values: FakturFormValues,
//         { setSubmitting }: { setSubmitting: SetSubmitting }
//     ) => {
//         setSubmitting(true)
//         const processedData = {
//             ...values,
//             nominal: extractIntegerFromStringAndFloat(
//                 values.nominal as unknown as string | number
//             ),
//             idTerminProject: selectedTermin?.id || '',
//             idProject: selectedTermin?.idProject || '',
//         }

//         try {
//             const successCreateFakturPajak = await apiCreateFakturPajak<
//                 boolean,
//                 FormModel
//             >(processedData)

//             if (successCreateFakturPajak) {
//                 popNotification('added')
//                 // Refresh termins data if needed
//                 const path = location.pathname.substring(
//                     location.pathname.lastIndexOf('/') + 1
//                 )
//                 dispatch(getTermins({ id: path }))
//                 dispatch(getFakturPajakByProyekId({ id: path }))
//             }
//         } catch (error) {
//             console.error('Error creating faktur pajak:', error)
//         } finally {
//             setSubmitting(false)
//             setIsOpen(false)
//         }
//     }

//     const terminsData = useAppSelector(
//         (state) => state.proyekEdit.data.terminsData
//     )

//     const FakturPajakByProyekData = useAppSelector(
//         (state) => state.proyekEdit.data.fakturPajakByProyekData
//     )

//     const loadingTermins = useAppSelector(
//         (state) => state.proyekEdit.data.loadingTermins
//     )

//     const loadingFakturPajakByProyekData = useAppSelector(
//         (state) => state.proyekEdit.data.loadingFakturPajakByProyekData
//     )

//     // Fungsi untuk membuka dialog konfirmasi delete
//     const handleConfirmDelete = (fakturId: string) => {
//         setSelectedFakturId(fakturId)
//         setDeleteConfirmOpen(true)
//     }

//     // Fungsi untuk menutup dialog konfirmasi
//     const handleCancelDelete = () => {
//         setDeleteConfirmOpen(false)
//         setSelectedFakturId(null)
//     }

//     const fetchData = (data: { id: string }) => {
//         dispatch(getTermins(data)) // by id
//         dispatch(getFakturPajakByProyekId(data))
//         // dispatch(getFakturPajakByProyek(data)) // by id
//     }

//     useEffect(() => {
//         const path = location.pathname.substring(
//             location.pathname.lastIndexOf('/') + 1
//         )
//         const requestParam = { id: path }
//         fetchData(requestParam)

//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [location.pathname])

//     const handleDelete = async () => {
//         if (!selectedFakturId) return

//         console.log('selectedFakturId', selectedFakturId.FakturPajak.id)
//         try {
//             const success = await apiDeleteFakturPajaks(
//                 selectedFakturId?.FakturPajak?.id
//             )

//             if (success) {
//                 popNotification('deleted')
//                 // Refresh data after deletion
//                 const path = location.pathname.substring(
//                     location.pathname.lastIndexOf('/') + 1
//                 )
//                 dispatch(getTermins({ id: path }))
//                 dispatch(getFakturPajakByProyekId({ id: path }))
//             }
//         } catch (error) {
//             console.error('Error deleting faktur:', error)
//             toast.push(
//                 <Notification
//                     title={`Delete Failed`}
//                     type="danger"
//                     duration={2500}
//                 >
//                     Failed to delete faktur
//                 </Notification>,
//                 {
//                     placement: 'top-center',
//                 }
//             )
//         } finally {
//             setDeleteConfirmOpen(false)
//             setSelectedFakturId(null)
//         }
//     }

//     return (
//         <>
//             <Loading loading={loadingTermins || loadingFakturPajakByProyekData}>
//                 <div className="flex flex-col py-6 space-y-2">
//                     <div className="flex flex-row justify-between">
//                         <DescriptionSection
//                             title="Termin"
//                             desc="Tambahkan data termin dan faktur"
//                         />
//                         <Button
//                             size="sm"
//                             variant="twoTone"
//                             // onClick={}
//                             className="w-fit text-xs"
//                         >
//                             Tambah Termin
//                         </Button>
//                     </div>
//                     {terminsData?.map((termin, index) => {
//                         // map semua termin yang ada pada proyek ini
//                         // find  data faktur pajak by project dengan termin.idFakturPajak
//                         const fakturByTermin = FakturPajakByProyekData?.find(
//                             (faktur) => faktur.id === termin.FakturPajak?.id
//                         )
//                         console.log('fakturByTermin', fakturByTermin)

//                         return (
//                             <div
//                                 key={index}
//                                 className="bg-slate-50 rounded-md flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-between gap-3 p-6 sm:p-10 w-full"
//                             >
//                                 <div className="flex flex-col  gap-4  sm:gap-0 sm:flex-row w-full">
//                                     <div className="text-sm flex flex-col text-slate-600 flex-auto sm:items-start items-center">
//                                         {termin.keterangan}
//                                         <span className="font-bold text-xl">
//                                             {termin.persen}%
//                                         </span>
//                                     </div>
//                                     {/* JIka faktur ada tampilkan button edit dan delete faktur */}
//                                     {termin.FakturPajak?.id ? (
//                                         <>
//                                             {fakturByTermin && (
//                                                 <>
//                                                     <div className="flex flex-col items-center sm:items-start flex-1">
//                                                         <span className="font-semibold text-base">
//                                                             INFORMASI FAKTUR
//                                                         </span>
//                                                         <div>
//                                                             <span className="font-semibold">
//                                                                 Nomor :{' '}
//                                                             </span>
//                                                             {
//                                                                 fakturByTermin?.nominal
//                                                             }
//                                                         </div>
//                                                         <div>
//                                                             <span className="font-semibold">
//                                                                 Nominal :{' '}
//                                                             </span>
//                                                             {
//                                                                 fakturByTermin?.nominal
//                                                             }
//                                                         </div>
//                                                         <div>
//                                                             <span className="font-semibold">
//                                                                 Tanggal :{' '}
//                                                             </span>
//                                                             {formatDate(
//                                                                 fakturByTermin?.tanggal ||
//                                                                     ''
//                                                             ) || ''}
//                                                         </div>
//                                                     </div>
//                                                     <div className="flex space-x-6 sm:space-x-2 justify-center sm:justify-start">
//                                                         <Button
//                                                             type="button"
//                                                             shape="circle"
//                                                             variant="plain"
//                                                             size="sm"
//                                                             icon={
//                                                                 <HiOutlinePencil />
//                                                             }
//                                                             className="text-indigo-500"
//                                                             // onClick={() =>
//                                                             //     handleEdit(
//                                                             //         index
//                                                             //     )
//                                                             // }
//                                                         />
//                                                         <Button
//                                                             type="button"
//                                                             shape="circle"
//                                                             variant="plain"
//                                                             size="sm"
//                                                             className="text-red-500"
//                                                             icon={
//                                                                 <HiOutlineTrash />
//                                                             }
//                                                             onClick={() =>
//                                                                 handleConfirmDelete(
//                                                                     termin
//                                                                 )
//                                                             }
//                                                         />
//                                                     </div>
//                                                 </>
//                                             )}
//                                         </>
//                                     ) : (
//                                         <Button
//                                             size="sm"
//                                             variant="solid"
//                                             onClick={() => openDialog(termin)}
//                                         >
//                                             Tambah Faktur
//                                         </Button>
//                                     )}
//                                 </div>
//                             </div>
//                         )
//                     })}
//                 </div>

//                 <Formik
//                     initialValues={initialValues}
//                     validationSchema={FakturSchema}
//                     onSubmit={handleSubmit}
//                 >
//                     {({ errors, touched, isSubmitting }) => (
//                         <>
//                             <Dialog
//                                 isOpen={dialogIsOpen}
//                                 onClose={onDialogClose}
//                                 onRequestClose={onDialogClose}
//                             >
//                                 <Form>
//                                     <h5 className="mb-4">Tambah Faktur</h5>

//                                     {/* Form */}
//                                     <div className="flex flex-col max-h-[60vh] overflow-y-auto border-b-[1px] pb-4">
//                                         {/* Nomor */}
//                                         <FormItem
//                                             label="Nomor"
//                                             invalid={
//                                                 (errors.nomor &&
//                                                     touched.nomor) as boolean
//                                             }
//                                             errorMessage={errors.nomor}
//                                         >
//                                             <Field
//                                                 type="text"
//                                                 autoComplete="off"
//                                                 name="nomor"
//                                                 placeholder="Nomor"
//                                                 component={Input}
//                                             />
//                                         </FormItem>

//                                         {/* Nominal */}
//                                         <FormItem
//                                             label="Nominal"
//                                             invalid={
//                                                 (errors.nominal &&
//                                                     touched.nominal) as boolean
//                                             }
//                                             errorMessage={errors.nominal}
//                                         >
//                                             <Field name="nominal">
//                                                 {({
//                                                     field,
//                                                     form,
//                                                 }: FieldProps) => (
//                                                     <NumericFormat
//                                                         {...field}
//                                                         customInput={Input}
//                                                         placeholder="0"
//                                                         thousandSeparator="."
//                                                         decimalSeparator=","
//                                                         onValueChange={(
//                                                             values
//                                                         ) => {
//                                                             form.setFieldValue(
//                                                                 field.name,
//                                                                 values.value
//                                                             )
//                                                         }}
//                                                     />
//                                                 )}
//                                             </Field>
//                                         </FormItem>
//                                         {/* Tanggal */}
//                                         <FormItem
//                                             label="Tanggal"
//                                             invalid={
//                                                 (errors.tanggal &&
//                                                     touched.tanggal) as boolean
//                                             }
//                                             errorMessage={errors.tanggal}
//                                         >
//                                             <Field name="tanggal">
//                                                 {({
//                                                     field,
//                                                     form,
//                                                 }: FieldProps) => (
//                                                     <DatePicker
//                                                         placeholder="Pilih Tanggal"
//                                                         value={
//                                                             field.value
//                                                                 ? new Date(
//                                                                       field.value
//                                                                   )
//                                                                 : null
//                                                         }
//                                                         inputFormat="DD-MM-YYYY"
//                                                         onChange={(date) => {
//                                                             const formattedDate =
//                                                                 date
//                                                                     ? dayjs(
//                                                                           date
//                                                                       ).format(
//                                                                           'YYYY-MM-DD'
//                                                                       )
//                                                                     : ''
//                                                             form.setFieldValue(
//                                                                 field.name,
//                                                                 formattedDate
//                                                             )
//                                                         }}
//                                                     />
//                                                 )}
//                                             </Field>
//                                         </FormItem>
//                                         {/* Keterangan */}
//                                         <FormItem
//                                             label="Keterangan"
//                                             invalid={
//                                                 (errors.keterangan &&
//                                                     touched.keterangan) as boolean
//                                             }
//                                             errorMessage={errors.keterangan}
//                                         >
//                                             <Field
//                                                 textArea
//                                                 name="keterangan"
//                                                 placeholder="Masukkan keterangan"
//                                                 component={Input}
//                                             />
//                                         </FormItem>
//                                     </div>
//                                     {/* Button Dialog Option */}
//                                     <div className="text-right mt-6">
//                                         <Button
//                                             className="ltr:mr-2 rtl:ml-2"
//                                             variant="plain"
//                                             onClick={onDialogClose}
//                                             type="button"
//                                             disabled={isSubmitting}
//                                         >
//                                             Cancel
//                                         </Button>
//                                         <Button
//                                             variant="solid"
//                                             type="submit"
//                                             loading={isSubmitting}
//                                         >
//                                             Okay
//                                         </Button>
//                                     </div>
//                                 </Form>
//                             </Dialog>
//                             <ConfirmDialog
//                                 isOpen={deleteConfirmOpen}
//                                 type="danger"
//                                 title="Hapus Faktur"
//                                 confirmButtonColor="red-600"
//                                 onClose={handleCancelDelete}
//                                 onRequestClose={handleCancelDelete}
//                                 onCancel={handleCancelDelete}
//                                 onConfirm={handleDelete}
//                             >
//                                 <p>
//                                     Apakah kamu yakin ingin menghapus faktur
//                                     pada termin ini?
//                                 </p>
//                             </ConfirmDialog>
//                         </>
//                     )}
//                 </Formik>
//             </Loading>
//         </>
//     )
// }

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
} from '@/services/FakturPajakService'
import { extractIntegerFromStringAndFloat } from '@/utils/extractNumberFromString'
import DescriptionSection from './DesriptionSection'
import { formatDate } from '@/utils/formatDate'
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'

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

// Interface untuk nilai awal form
interface FakturFormValues {
    nomor: string
    nominal: number | string
    tanggal: string
    keterangan?: string
}

export default function Termin() {
    const dispatch = useAppDispatch()
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

    const popNotification = (keyword: string) => {
        toast.push(
            <Notification
                title={`Successfully ${keyword}`}
                type="success"
                duration={2500}
            >
                Faktur successfully {keyword}
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
                console.log('fakturId', fakturId)

                const updateData = {
                    ...processedData,
                    id: fakturId.id,
                }

                success = await updateFakturPajak<boolean, FormModel>({
                    ...updateData,
                })
                console.log('success', success)
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
                const path = location.pathname.substring(
                    location.pathname.lastIndexOf('/') + 1
                )
                dispatch(getTermins({ id: path }))
                dispatch(getFakturPajakByProyekId({ id: path }))
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
    const handleEdit = (termin: any) => {
        openDialog(termin, true)
    }

    // Fungsi untuk membuka dialog konfirmasi delete
    const handleConfirmDelete = (fakturData: any) => {
        setSelectedFakturId(fakturData)
        setDeleteConfirmOpen(true)
    }

    // Fungsi untuk menutup dialog konfirmasi
    const handleCancelDelete = () => {
        setDeleteConfirmOpen(false)
        setSelectedFakturId(null)
    }

    const fetchData = (data: { id: string }) => {
        dispatch(getTermins(data)) // by id
        dispatch(getFakturPajakByProyekId(data))
    }

    useEffect(() => {
        const path = location.pathname.substring(
            location.pathname.lastIndexOf('/') + 1
        )
        const requestParam = { id: path }
        fetchData(requestParam)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname])

    const handleDelete = async () => {
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
                // Refresh data after deletion
                const path = location.pathname.substring(
                    location.pathname.lastIndexOf('/') + 1
                )
                dispatch(getTermins({ id: path }))
                dispatch(getFakturPajakByProyekId({ id: path }))
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

    return (
        <>
            <Loading loading={loadingTermins || loadingFakturPajakByProyekData}>
                <div className="flex flex-col py-6 space-y-2">
                    <div className="flex flex-row justify-between">
                        <DescriptionSection
                            title="Termin"
                            desc="Tambahkan data termin dan faktur"
                        />
                        <Button
                            size="sm"
                            variant="twoTone"
                            // onClick={}
                            className="w-fit text-xs"
                        >
                            Tambah Termin
                        </Button>
                    </div>
                    {terminsData?.map((termin, index) => {
                        // map semua termin yang ada pada proyek ini
                        // find data faktur pajak by project dengan termin.idFakturPajak
                        const fakturByTermin = FakturPajakByProyekData?.find(
                            (faktur) => faktur.id === termin.FakturPajak?.id
                        )

                        return (
                            <div
                                key={index}
                                className="bg-slate-50 rounded-md flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-between gap-3 p-6 sm:p-10 w-full"
                            >
                                <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row w-full">
                                    <div className="text-sm flex flex-col text-slate-600 flex-auto sm:items-start items-center">
                                        {termin.keterangan}
                                        <span className="font-bold text-xl">
                                            {termin.persen}%
                                        </span>
                                    </div>
                                    {/* Jika faktur ada tampilkan button edit dan delete faktur */}
                                    {termin.FakturPajak?.id ? (
                                        <>
                                            {fakturByTermin && (
                                                <>
                                                    <div className="flex flex-col items-center sm:items-start flex-1">
                                                        <span className="font-semibold text-base">
                                                            INFORMASI FAKTUR
                                                        </span>
                                                        <div>
                                                            <span className="font-semibold">
                                                                Nomor :{' '}
                                                            </span>
                                                            {fakturByTermin.nomor ||
                                                                '-'}
                                                        </div>
                                                        <div>
                                                            <span className="font-semibold">
                                                                Nominal :{' '}
                                                            </span>
                                                            {fakturByTermin.nominal?.toLocaleString(
                                                                'id-ID'
                                                            ) || '-'}
                                                        </div>
                                                        <div>
                                                            <span className="font-semibold">
                                                                Tanggal :{' '}
                                                            </span>
                                                            {formatDate(
                                                                fakturByTermin.tanggal ||
                                                                    ''
                                                            ) || '-'}
                                                        </div>
                                                        {fakturByTermin.keterangan && (
                                                            <div>
                                                                <span className="font-semibold">
                                                                    Keterangan :{' '}
                                                                </span>
                                                                {
                                                                    fakturByTermin.keterangan
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex space-x-6 sm:space-x-2 justify-center sm:justify-start">
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
                                                                handleConfirmDelete(
                                                                    termin
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <Button
                                            size="sm"
                                            variant="solid"
                                            onClick={() => openDialog(termin)}
                                        >
                                            Tambah Faktur
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                <Formik
                    initialValues={formInitialValues}
                    validationSchema={FakturSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize={true} // Important for updating form with new values when editing
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
                                onClose={handleCancelDelete}
                                onRequestClose={handleCancelDelete}
                                onCancel={handleCancelDelete}
                                onConfirm={handleDelete}
                            >
                                <p>
                                    Apakah kamu yakin ingin menghapus faktur
                                    pada termin ini?
                                </p>
                            </ConfirmDialog>
                        </>
                    )}
                </Formik>
            </Loading>
        </>
    )
}
