// {
//     "nomor_surat": "05/2025",
//     "waktu_mulai_pelaksanaan": "2025-05-03T17:00:00.000Z",
//     "waktu_selesai_pelaksanaan": "2025-05-04T17:00:00.000Z",
//     "keterangan": "-",
//     "idProject": "f2a9f512-3123-4a52-987b-01914828e4f6",
//     "nilai_subkontrak": "14.000.000", // number harusnya
//     "nama": "Subkon5", // gaperlu
//     "idSubkon": "05" // harusnya select option
// }

// import React, { useState, useEffect } from 'react'
// import {
//     HiOutlineTrash,
//     HiOutlinePencil,
//     HiOutlineOfficeBuilding,
// } from 'react-icons/hi'
// import classNames from 'classnames'
// import isLastChild from '@/utils/isLastChild'
// import DescriptionSection from './DesriptionSection'
// import reducer, {
//     getSubkonsByProyek,
//     getAllSubkontraktors,
//     useAppDispatch,
//     useAppSelector,
// } from '../store'
// import { injectReducer } from '@/store'
// import { Field, FieldProps, Form, Formik } from 'formik'
// import { FormItem, FormContainer } from '@/components/ui/Form'
// import Input from '@/components/ui/Input'
// import Button from '@/components/ui/Button'
// import AdaptableCard from '@/components/shared/AdaptableCard'
// import { ConfirmDialog, Loading } from '@/components/shared'
// import * as Yup from 'yup'
// import { Notification, toast, Select } from '@/components/ui'
// import DatePicker from '@/components/ui/DatePicker'
// import {
//     apiCreateSubkontraktorProject,
//     apiDeleteSubkontraktorsProject,
//     apiUpdateSubkontraktorProject,
// } from '@/services/SubkontraktorService'
// import { NumericFormat } from 'react-number-format'

// // Type definitions for subkontraktor data
// type Subkontraktor = {
//     id: string
//     nama: string
//     nomor_surat: string
//     nilai_subkontrak: number
//     waktu_mulai_pelaksanaan: string
//     waktu_selesai_pelaksanaan: string
//     keterangan: string
//     idProject: string
//     idSubkon: string
// }

// // Type for subkontraktor option in dropdown
// type SubkonOption = {
//     value: string
//     label: string
// }

// // Form values type
// type FormValues = {
//     tempNomorSurat: string
//     tempNilaiSubkontrak: number | string
//     tempWaktuMulai: Date | null
//     tempWaktuSelesai: Date | null
//     tempKeterangan: string
//     tempIdProject: string
//     tempIdSubkon: string
// }

// // Validation schema for the form fields
// const validationSchema = Yup.object().shape({
//     tempNomorSurat: Yup.string().required('Nomor surat harus diisi'),
//     tempNilaiSubkontrak: Yup.string().required('Nilai subkontrak harus diisi'),
//     tempWaktuMulai: Yup.date()
//         .required('Waktu mulai pelaksanaan harus diisi')
//         .typeError('Format tanggal tidak valid'),
//     tempWaktuSelesai: Yup.date()
//         .required('Waktu selesai pelaksanaan harus diisi')
//         .typeError('Format tanggal tidak valid')
//         .min(
//             Yup.ref('tempWaktuMulai'),
//             'Waktu selesai harus setelah waktu mulai'
//         ),
//     tempIdSubkon: Yup.string().required('Subkontraktor harus dipilih'),
// })

// injectReducer('proyekDetail', reducer)

// export default function Subkontraktor() {
//     const [showForm, setShowForm] = useState(false)
//     const [editIndex, setEditIndex] = useState<number | null>(null)
//     const [isSubmitting, setIsSubmitting] = useState(false)
//     const [dialogOpen, setDialogOpen] = useState(false)
//     const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
//     const [subkonOptions, setSubkonOptions] = useState<SubkonOption[]>([])

//     const dispatch = useAppDispatch()
//     const projectId = location.pathname.substring(
//         location.pathname.lastIndexOf('/') + 1
//     )

//     // Get subkontraktor data from state
//     const subkontraktorByProyekData = useAppSelector(
//         (state) => state.proyekDetail.data.subkonByProyekData?.data
//     )

//     // Get all subkontraktor list for dropdown
//     const allSubkontraktors = useAppSelector(
//         (state) => state.proyekDetail.data.allSubkontraktors?.data
//     )

//     const loading = useAppSelector(
//         (state) => state.proyekDetail.data.loadingSubkonsByProyek
//     )

//     const loadingAllSubkons = useAppSelector(
//         (state) => state.proyekDetail.data.loadingAllSubkontraktors
//     )

//     // Fetch subkontraktors when component mounts
//     useEffect(() => {
//         const requestParam = { id: projectId }
//         dispatch(getSubkonsByProyek(requestParam))
//         dispatch(getAllSubkontraktors())
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [dispatch, projectId])

//     // Prepare subkontraktor options for dropdown
//     useEffect(() => {
//         if (allSubkontraktors && allSubkontraktors.length > 0) {
//             const options = allSubkontraktors.map((subkon) => ({
//                 value: subkon.id,
//                 label: subkon.nama,
//             }))
//             setSubkonOptions(options)
//         }
//     }, [allSubkontraktors])

//     // Format date for display
//     const formatDate = (dateString: string) => {
//         const date = new Date(dateString)
//         return date.toLocaleDateString('id-ID', {
//             day: '2-digit',
//             month: '2-digit',
//             year: 'numeric',
//         })
//     }

//     // Format currency for display
//     const formatCurrency = (amount: number) => {
//         return new Intl.NumberFormat('id-ID', {
//             style: 'currency',
//             currency: 'IDR',
//             minimumFractionDigits: 0,
//         }).format(amount)
//     }

//     // Initialize form values
//     const initialValues: FormValues = {
//         tempNomorSurat: '',
//         tempNilaiSubkontrak: '',
//         tempWaktuMulai: null,
//         tempWaktuSelesai: null,
//         tempKeterangan: '',
//         tempIdProject: projectId || '',
//         tempIdSubkon: '',
//     }

//     // Success notification helper
//     const popNotification = (keyword: string) => {
//         toast.push(
//             <Notification
//                 title={`Berhasil ${keyword}`}
//                 type="success"
//                 duration={2500}
//             >
//                 Data subkontraktor berhasil {keyword}
//             </Notification>,
//             {
//                 placement: 'top-center',
//             }
//         )
//     }

//     return (
//         <Loading loading={loading || loadingAllSubkons || isSubmitting}>
//             <Formik
//                 enableReinitialize
//                 initialValues={initialValues}
//                 validationSchema={validationSchema}
//                 onSubmit={() => {
//                     // Form submission is handled by save button
//                 }}
//             >
//                 {(formikProps) => {
//                     const { values, errors, touched, setFieldValue } =
//                         formikProps

//                     const handleAddSubkontraktor = () => {
//                         setShowForm(true)
//                         setEditIndex(null)

//                         // Reset temp values
//                         setFieldValue('tempNomorSurat', '')
//                         setFieldValue('tempNilaiSubkontrak', '')
//                         setFieldValue('tempWaktuMulai', null)
//                         setFieldValue('tempWaktuSelesai', null)
//                         setFieldValue('tempKeterangan', '')
//                         setFieldValue('tempIdSubkon', '')
//                     }

//                     const handleSave = async () => {
//                         // Validate fields
//                         if (
//                             !errors.tempNomorSurat &&
//                             !errors.tempNilaiSubkontrak &&
//                             !errors.tempWaktuMulai &&
//                             !errors.tempWaktuSelesai &&
//                             !errors.tempIdSubkon
//                         ) {
//                             setIsSubmitting(true)

//                             // Cari informasi nama subkontraktor dari id yang dipilih
//                             const selectedSubkon = allSubkontraktors?.find(
//                                 (subkon) => subkon.id === values.tempIdSubkon
//                             )

//                             const requestData = {
//                                 nomor_surat: values.tempNomorSurat,
//                                 nilai_subkontrak: values.tempNilaiSubkontrak,
//                                 waktu_mulai_pelaksanaan:
//                                     values.tempWaktuMulai?.toISOString(),
//                                 waktu_selesai_pelaksanaan:
//                                     values.tempWaktuSelesai?.toISOString(),
//                                 keterangan: values.tempKeterangan || '-',
//                                 idProject: values.tempIdProject,
//                                 idSubkon: values.tempIdSubkon,
//                                 // Tambahkan nama untuk kompatibilitas API
//                                 nama: selectedSubkon?.nama || '',
//                             }

//                             try {
//                                 let result

//                                 if (
//                                     editIndex !== null &&
//                                     subkontraktorByProyekData
//                                 ) {
//                                     // Handle edit with API call
//                                     const subkontraktorId =
//                                         subkontraktorByProyekData[editIndex].id
//                                     result =
//                                         await apiUpdateSubkontraktorProject({
//                                             id: subkontraktorId,
//                                             ...requestData,
//                                         })
//                                 } else {
//                                     // Handle create with API call
//                                     result =
//                                         await apiCreateSubkontraktorProject(
//                                             requestData
//                                         )
//                                 }

//                                 setIsSubmitting(false)

//                                 if (
//                                     result &&
//                                     result.data?.statusCode >= 200 &&
//                                     result.data?.statusCode < 300
//                                 ) {
//                                     // Refresh data
//                                     dispatch(
//                                         getSubkonsByProyek({
//                                             id: projectId,
//                                         })
//                                     )

//                                     // Show success notification
//                                     popNotification(
//                                         editIndex !== null
//                                             ? 'diperbarui'
//                                             : 'ditambahkan'
//                                     )

//                                     // Reset form and close
//                                     resetFormFields()
//                                     setShowForm(false)
//                                     setEditIndex(null)
//                                 } else {
//                                     // Show error notification
//                                     toast.push(
//                                         <Notification
//                                             title="Error"
//                                             type="danger"
//                                             duration={2500}
//                                         >
//                                             {result
//                                                 ? result.data?.message
//                                                 : 'Gagal menambahkan subkontraktor'}
//                                         </Notification>,
//                                         { placement: 'top-center' }
//                                     )
//                                 }
//                             } catch (error) {
//                                 setIsSubmitting(false)
//                                 console.error('Error:', error)

//                                 // Show generic error notification
//                                 toast.push(
//                                     <Notification
//                                         title="Error"
//                                         type="danger"
//                                         duration={2500}
//                                     >
//                                         Terjadi kesalahan saat memproses
//                                         permintaan
//                                     </Notification>,
//                                     { placement: 'top-center' }
//                                 )
//                             }
//                         }
//                     }

//                     // Helper function to reset form fields
//                     const resetFormFields = () => {
//                         setFieldValue('tempNomorSurat', '')
//                         setFieldValue('tempNilaiSubkontrak', '')
//                         setFieldValue('tempWaktuMulai', null)
//                         setFieldValue('tempWaktuSelesai', null)
//                         setFieldValue('tempKeterangan', '')
//                         setFieldValue('tempIdSubkon', '')
//                     }

//                     const handleCancel = () => {
//                         setShowForm(false)
//                         setEditIndex(null)
//                         resetFormFields()
//                     }

//                     const handleEdit = (index: number) => {
//                         if (subkontraktorByProyekData) {
//                             const subkon = subkontraktorByProyekData[index]

//                             // Set temporary values for editing
//                             setFieldValue('tempNomorSurat', subkon.nomor_surat)
//                             setFieldValue(
//                                 'tempNilaiSubkontrak',
//                                 subkon.nilai_subkontrak
//                             )
//                             setFieldValue(
//                                 'tempWaktuMulai',
//                                 new Date(subkon.waktu_mulai_pelaksanaan)
//                             )
//                             setFieldValue(
//                                 'tempWaktuSelesai',
//                                 new Date(subkon.waktu_selesai_pelaksanaan)
//                             )
//                             setFieldValue('tempKeterangan', subkon.keterangan)
//                             setFieldValue('tempIdProject', subkon.idProject)
//                             setFieldValue('tempIdSubkon', subkon.idSubkon)

//                             setEditIndex(index)
//                             setShowForm(true)
//                         }
//                     }

//                     // Function to open confirmation dialog
//                     const handleConfirmDelete = (index: number) => {
//                         setDeleteIndex(index)
//                         setDialogOpen(true)
//                     }

//                     // Function to close confirmation dialog
//                     const handleCancelDelete = () => {
//                         setDialogOpen(false)
//                         setDeleteIndex(null)
//                     }

//                     const handleDelete = async () => {
//                         if (deleteIndex !== null && subkontraktorByProyekData) {
//                             const subkonId =
//                                 subkontraktorByProyekData[deleteIndex].id

//                             setIsSubmitting(true)
//                             try {
//                                 // Call delete API with subkontraktor ID
//                                 const success =
//                                     await apiDeleteSubkontraktorsProject(
//                                         subkonId
//                                     )

//                                 if (success) {
//                                     // Refresh data after successful delete
//                                     dispatch(
//                                         getSubkonsByProyek({
//                                             id: projectId,
//                                         })
//                                     )
//                                     popNotification('dihapus')
//                                 }
//                             } catch (error) {
//                                 console.error(
//                                     'Error deleting subkontraktor:',
//                                     error
//                                 )

//                                 // Show error notification
//                                 toast.push(
//                                     <Notification
//                                         title="Error"
//                                         type="danger"
//                                         duration={2500}
//                                     >
//                                         Gagal menghapus subkontraktor
//                                     </Notification>,
//                                     { placement: 'top-center' }
//                                 )
//                             } finally {
//                                 setIsSubmitting(false)
//                                 setDialogOpen(false)
//                                 setDeleteIndex(null)
//                             }
//                         }
//                     }

//                     return (
//                         <Form>
//                             <AdaptableCard divider>
//                                 <div className="flex justify-between items-center mb-4">
//                                     <DescriptionSection
//                                         title="Informasi Subkontraktor"
//                                         desc="Informasi subkontraktor proyek"
//                                     />
//                                     {!showForm && (
//                                         <Button
//                                             size="sm"
//                                             variant="twoTone"
//                                             onClick={handleAddSubkontraktor}
//                                             className="w-fit text-xs"
//                                             type="button"
//                                         >
//                                             Tambah Subkontraktor
//                                         </Button>
//                                     )}
//                                 </div>

//                                 {/* Form untuk input subkontraktor */}
//                                 {showForm && (
//                                     <div className="mb-4 border bg-slate-50 rounded-md p-4">
//                                         <h6 className="mb-3">
//                                             {editIndex !== null
//                                                 ? 'Edit Subkontraktor'
//                                                 : 'Tambah Subkontraktor Baru'}
//                                         </h6>

//                                         <FormContainer>
//                                             <div className="grid grid-cols-2 gap-4">
//                                                 {/* Dropdown untuk memilih Subkontraktor */}
//                                                 <FormItem
//                                                     label="Nama Subkontraktor"
//                                                     errorMessage={
//                                                         errors.tempIdSubkon &&
//                                                         touched.tempIdSubkon
//                                                             ? errors.tempIdSubkon
//                                                             : ''
//                                                     }
//                                                     invalid={
//                                                         !!(
//                                                             errors.tempIdSubkon &&
//                                                             touched.tempIdSubkon
//                                                         )
//                                                     }
//                                                 >
//                                                     <Field name="tempIdSubkon">
//                                                         {({
//                                                             field,
//                                                             form,
//                                                         }: FieldProps) => {
//                                                             const selectedOption =
//                                                                 subkonOptions.find(
//                                                                     (option) =>
//                                                                         option.value ===
//                                                                         field.value
//                                                                 )

//                                                             return (
//                                                                 <Select
//                                                                     placeholder="Pilih subkontraktor"
//                                                                     options={
//                                                                         subkonOptions
//                                                                     }
//                                                                     value={
//                                                                         selectedOption
//                                                                     }
//                                                                     onChange={(
//                                                                         option
//                                                                     ) => {
//                                                                         form.setFieldValue(
//                                                                             field.name,
//                                                                             option?.value ||
//                                                                                 ''
//                                                                         )
//                                                                     }}
//                                                                 />
//                                                             )
//                                                         }}
//                                                     </Field>
//                                                 </FormItem>

//                                                 {/* Nomor Surat */}
//                                                 <FormItem
//                                                     label="Nomor Surat"
//                                                     errorMessage={
//                                                         errors.tempNomorSurat &&
//                                                         touched.tempNomorSurat
//                                                             ? errors.tempNomorSurat
//                                                             : ''
//                                                     }
//                                                     invalid={
//                                                         !!(
//                                                             errors.tempNomorSurat &&
//                                                             touched.tempNomorSurat
//                                                         )
//                                                     }
//                                                 >
//                                                     <Field
//                                                         type="text"
//                                                         autoComplete="off"
//                                                         name="tempNomorSurat"
//                                                         placeholder="Contoh: 01/IV/2025"
//                                                         component={Input}
//                                                     />
//                                                 </FormItem>

//                                                 {/* Nilai Subkontrak */}
//                                                 <FormItem
//                                                     label="Nilai Subkontrak"
//                                                     className="mb-3"
//                                                     errorMessage={
//                                                         errors.tempNilaiSubkontrak &&
//                                                         touched.tempNilaiSubkontrak
//                                                             ? errors.tempNilaiSubkontrak
//                                                             : ''
//                                                     }
//                                                     invalid={
//                                                         !!(
//                                                             errors.tempNilaiSubkontrak &&
//                                                             touched.tempNilaiSubkontrak
//                                                         )
//                                                     }
//                                                 >
//                                                     <Field name="tempNilaiSubkontrak">
//                                                         {({
//                                                             field,
//                                                             form,
//                                                         }: FieldProps) => (
//                                                             <NumericFormat
//                                                                 {...field}
//                                                                 placeholder="Nilai dalam Rupiah"
//                                                                 customInput={
//                                                                     Input
//                                                                 }
//                                                                 thousandSeparator="."
//                                                                 decimalSeparator=","
//                                                                 onValueChange={(
//                                                                     val
//                                                                 ) =>
//                                                                     form.setFieldValue(
//                                                                         field.name,
//                                                                         val.value
//                                                                     )
//                                                                 }
//                                                             />
//                                                         )}
//                                                     </Field>
//                                                 </FormItem>

//                                                 {/* Waktu Mulai */}
//                                                 <FormItem
//                                                     label="Waktu Mulai Pelaksanaan"
//                                                     errorMessage={
//                                                         errors.tempWaktuMulai &&
//                                                         touched.tempWaktuMulai
//                                                             ? errors.tempWaktuMulai
//                                                             : ''
//                                                     }
//                                                     invalid={
//                                                         !!(
//                                                             errors.tempWaktuMulai &&
//                                                             touched.tempWaktuMulai
//                                                         )
//                                                     }
//                                                 >
//                                                     <DatePicker
//                                                         placeholder="Pilih tanggal mulai"
//                                                         value={
//                                                             values.tempWaktuMulai
//                                                         }
//                                                         onChange={(date) => {
//                                                             setFieldValue(
//                                                                 'tempWaktuMulai',
//                                                                 date
//                                                             )
//                                                         }}
//                                                     />
//                                                 </FormItem>

//                                                 {/* Waktu Selesai */}
//                                                 <FormItem
//                                                     label="Waktu Selesai Pelaksanaan"
//                                                     errorMessage={
//                                                         errors.tempWaktuSelesai &&
//                                                         touched.tempWaktuSelesai
//                                                             ? errors.tempWaktuSelesai
//                                                             : ''
//                                                     }
//                                                     invalid={
//                                                         !!(
//                                                             errors.tempWaktuSelesai &&
//                                                             touched.tempWaktuSelesai
//                                                         )
//                                                     }
//                                                 >
//                                                     <DatePicker
//                                                         placeholder="Pilih tanggal selesai"
//                                                         value={
//                                                             values.tempWaktuSelesai
//                                                         }
//                                                         onChange={(date) => {
//                                                             setFieldValue(
//                                                                 'tempWaktuSelesai',
//                                                                 date
//                                                             )
//                                                         }}
//                                                     />
//                                                 </FormItem>

//                                                 {/* Keterangan */}
//                                                 <FormItem
//                                                     label="Keterangan"
//                                                     className="col-span-2"
//                                                 >
//                                                     <Field
//                                                         type="text"
//                                                         autoComplete="off"
//                                                         name="tempKeterangan"
//                                                         placeholder="Keterangan (opsional)"
//                                                         component={Input}
//                                                     />
//                                                 </FormItem>
//                                             </div>

//                                             <div className="flex justify-end space-x-2 mt-4">
//                                                 <Button
//                                                     size="sm"
//                                                     variant="plain"
//                                                     onClick={handleCancel}
//                                                     type="button"
//                                                 >
//                                                     Batal
//                                                 </Button>
//                                                 <Button
//                                                     size="sm"
//                                                     variant="solid"
//                                                     onClick={handleSave}
//                                                     type="button"
//                                                     loading={isSubmitting}
//                                                 >
//                                                     Simpan
//                                                 </Button>
//                                             </div>
//                                         </FormContainer>
//                                     </div>
//                                 )}

//                                 {/* Daftar subkontraktor */}
//                                 {subkontraktorByProyekData &&
//                                 subkontraktorByProyekData.length > 0 ? (
//                                     <div className="rounded-lg border border-gray-200 dark:border-gray-600">
//                                         {subkontraktorByProyekData.map(
//                                             (
//                                                 data: Subkontraktor,
//                                                 index: number
//                                             ) => {
//                                                 // If currently editing this item, don't show it in the list
//                                                 if (editIndex === index) {
//                                                     return null
//                                                 }

//                                                 return (
//                                                     <div
//                                                         key={data.id}
//                                                         className={classNames(
//                                                             'flex items-center justify-between px-4 py-6',
//                                                             !isLastChild(
//                                                                 subkontraktorByProyekData,
//                                                                 index
//                                                             ) &&
//                                                                 'border-b border-gray-200 dark:border-gray-600'
//                                                         )}
//                                                     >
//                                                         <div className="flex items-center flex-grow">
//                                                             <div className="text-3xl">
//                                                                 <HiOutlineOfficeBuilding className="text-indigo-500" />
//                                                             </div>
//                                                             <div className="ml-3 rtl:mr-3">
//                                                                 <div className="flex items-center">
//                                                                     <div className="text-gray-900 dark:text-gray-100 font-semibold">
//                                                                         {
//                                                                             data.nama
//                                                                         }
//                                                                     </div>
//                                                                 </div>
//                                                                 <div className="text-gray-500 text-sm mt-1">
//                                                                     <div>
//                                                                         No.
//                                                                         Surat:{' '}
//                                                                         {
//                                                                             data.nomor_surat
//                                                                         }
//                                                                     </div>
//                                                                     <div>
//                                                                         Nilai:{' '}
//                                                                         {formatCurrency(
//                                                                             data.nilai_subkontrak
//                                                                         )}
//                                                                     </div>
//                                                                     <div>
//                                                                         Periode:{' '}
//                                                                         {formatDate(
//                                                                             data.waktu_mulai_pelaksanaan
//                                                                         )}{' '}
//                                                                         -{' '}
//                                                                         {formatDate(
//                                                                             data.waktu_selesai_pelaksanaan
//                                                                         )}
//                                                                     </div>
//                                                                     {data.keterangan !==
//                                                                         '-' && (
//                                                                         <div>
//                                                                             Keterangan:{' '}
//                                                                             {
//                                                                                 data.keterangan
//                                                                             }
//                                                                         </div>
//                                                                     )}
//                                                                 </div>
//                                                             </div>
//                                                         </div>

//                                                         <div className="flex space-x-2">
//                                                             <Button
//                                                                 type="button"
//                                                                 shape="circle"
//                                                                 variant="plain"
//                                                                 size="sm"
//                                                                 icon={
//                                                                     <HiOutlinePencil />
//                                                                 }
//                                                                 className="text-indigo-500"
//                                                                 onClick={() =>
//                                                                     handleEdit(
//                                                                         index
//                                                                     )
//                                                                 }
//                                                             />
//                                                             <Button
//                                                                 type="button"
//                                                                 shape="circle"
//                                                                 variant="plain"
//                                                                 size="sm"
//                                                                 className="text-red-500"
//                                                                 icon={
//                                                                     <HiOutlineTrash />
//                                                                 }
//                                                                 onClick={() =>
//                                                                     handleConfirmDelete(
//                                                                         index
//                                                                     )
//                                                                 }
//                                                             />
//                                                         </div>
//                                                     </div>
//                                                 )
//                                             }
//                                         )}
//                                     </div>
//                                 ) : (
//                                     <div className="text-center py-8 text-gray-500">
//                                         Belum ada data subkontraktor. Klik
//                                         'Tambah Subkontraktor' untuk
//                                         menambahkan.
//                                     </div>
//                                 )}
//                             </AdaptableCard>

//                             {/* Dialog Konfirmasi Hapus */}
//                             <ConfirmDialog
//                                 isOpen={dialogOpen}
//                                 type="danger"
//                                 title="Hapus Subkontraktor"
//                                 confirmButtonColor="red-600"
//                                 onClose={handleCancelDelete}
//                                 onRequestClose={handleCancelDelete}
//                                 onCancel={handleCancelDelete}
//                                 onConfirm={handleDelete}
//                             >
//                                 <p>
//                                     Apakah kamu yakin ingin menghapus
//                                     subkontraktor ini?
//                                 </p>
//                             </ConfirmDialog>
//                         </Form>
//                     )
//                 }}
//             </Formik>
//         </Loading>
//     )
// }
