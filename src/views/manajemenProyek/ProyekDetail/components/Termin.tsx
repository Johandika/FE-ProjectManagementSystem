// import { Loading } from '@/components/shared'
// import { useAppDispatch } from '@/store'
// import React, { useEffect, useState } from 'react'
// import { getTermins, useAppSelector } from '../../ProyekEdit/store'
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
// import { apiCreateFakturPajak } from '@/services/FakturPajakService'

// // Schema validasi untuk form faktur
// const FakturSchema = Yup.object().shape({
//     // nomor: Yup.string().required('Nomor wajib diisi'),
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

//     // Nilai awal untuk form
//     const initialValues: FakturFormValues = {
//         nomor: '',
//         nominal: 0,
//         tanggal: '',
//     }

//     const openDialog = () => {
//         setIsOpen(true)
//     }

//     const onDialogClose = (e: React.MouseEvent) => {
//         console.log('onDialogClose', e)
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
//         // navigate('/manajemen-proyek')
//     }

//     const handleFormSubmit = async (
//         values: FakturFormValues,
//         setSubmitting: SetSubmitting
//     ) => {
//         setSubmitting(true)

//         const success = await apiCreateFakturPajak<boolean, FormModel>(values)
//         setSubmitting(false)
//         setIsOpen(false)
//         if (success) {
//             popNotification('updated')
//         }
//     }

//     const terminsData = useAppSelector(
//         (state) => state.proyekEdit.data.terminsData
//     )

//     const loadingTermins = useAppSelector(
//         (state) => state.proyekEdit.data.loadingTermins
//     )

//     const fetchData = (data: { id: string }) => {
//         dispatch(getTermins(data))
//     }

//     useEffect(() => {
//         const path = location.pathname.substring(
//             location.pathname.lastIndexOf('/') + 1
//         )
//         const rquestParam = { id: path }
//         fetchData(rquestParam)

//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [location.pathname])

//     console.log('terminsData', terminsData)
//     return (
//         <>
//             <Loading loading={loadingTermins}>
//                 {/* { terminsData && terminsData.length > 0 ? (} */}
//                 <div className="flex flex-col py-6 space-y-2">
//                     {terminsData?.map((termin, index) => (
//                         <div
//                             key={index}
//                             className="bg-slate-50 rounded-md flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-between gap-3 p-10 w-full"
//                         >
//                             <div className="text-sm flex flex-col text-slate-600">
//                                 {termin.keterangan}
//                                 <span className="font-bold text-xl">
//                                     {termin.persen}%
//                                 </span>
//                             </div>
//                             <Button
//                                 size="sm"
//                                 variant="solid"
//                                 onClick={() => openDialog()}
//                             >
//                                 Tambah Faktur
//                             </Button>
//                         </div>
//                     ))}
//                 </div>

//                 <Formik
//                     initialValues={initialValues}
//                     validationSchema={FakturSchema}
//                     onSubmit={handleSubmit}
//                 >
//                     {({ errors, touched, handleSubmit }) => (
//                         <Dialog
//                             isOpen={dialogIsOpen}
//                             onClose={onDialogClose}
//                             onRequestClose={onDialogClose}
//                         >
//                             <Form onSubmit={handleSubmit}>
//                                 <h5 className="mb-4">Tambah Faktur</h5>

//                                 {/* Form */}
//                                 <div className="flex flex-col h-[300px] overflow-y-scroll border-b-[1px]">
//                                     {/* Nomor */}
//                                     <FormItem
//                                         label="Nomor"
//                                         invalid={
//                                             (errors.nomor &&
//                                                 touched.nomor) as boolean
//                                         }
//                                         errorMessage={errors.nomor}
//                                     >
//                                         <Field
//                                             type="text"
//                                             autoComplete="off"
//                                             name="nomor"
//                                             placeholder="Nomor"
//                                             component={Input}
//                                         />
//                                     </FormItem>
//                                     {/* Nominal */}
//                                     <FormItem
//                                         label="Nominal"
//                                         invalid={
//                                             (errors.nominal &&
//                                                 touched.nominal) as boolean
//                                         }
//                                         errorMessage={errors.nominal}
//                                     >
//                                         <Field name="nominal">
//                                             {({ field, form }: FieldProps) => (
//                                                 <NumericFormat
//                                                     {...field}
//                                                     customInput={Input}
//                                                     placeholder="0"
//                                                     thousandSeparator="."
//                                                     decimalSeparator=","
//                                                     onValueChange={(values) => {
//                                                         form.setFieldValue(
//                                                             field.name,
//                                                             values.value
//                                                         )
//                                                     }}
//                                                 />
//                                             )}
//                                         </Field>
//                                     </FormItem>
//                                     {/* Tanggal */}
//                                     <FormItem
//                                         label="Tanggal"
//                                         invalid={
//                                             (errors.tanggal &&
//                                                 touched.tanggal) as boolean
//                                         }
//                                         errorMessage={errors.tanggal}
//                                     >
//                                         <Field name="tanggal">
//                                             {({ field, form }: FieldProps) => (
//                                                 <DatePicker
//                                                     placeholder="Pilih Tanggal"
//                                                     value={
//                                                         field.value
//                                                             ? new Date(
//                                                                   field.value
//                                                               )
//                                                             : null
//                                                     }
//                                                     inputFormat="YYYY-MM-DD"
//                                                     onChange={(date) => {
//                                                         const formattedDate =
//                                                             date
//                                                                 ? dayjs(
//                                                                       date
//                                                                   ).format(
//                                                                       'YYYY-MM-DD'
//                                                                   )
//                                                                 : ''
//                                                         form.setFieldValue(
//                                                             field.name,
//                                                             formattedDate
//                                                         )
//                                                     }}
//                                                 />
//                                             )}
//                                         </Field>
//                                     </FormItem>
//                                 </div>
//                                 {/* Button Dialog Option */}
//                                 <div className="text-right mt-6">
//                                     <Button
//                                         className="ltr:mr-2 rtl:ml-2"
//                                         variant="plain"
//                                         onClick={onDialogClose}
//                                         type="button"
//                                     >
//                                         Cancel
//                                     </Button>
//                                     <Button variant="solid" type="submit">
//                                         Okay
//                                     </Button>
//                                 </div>
//                             </Form>
//                         </Dialog>
//                     )}
//                 </Formik>
//             </Loading>
//         </>
//     )
// }

// // import { Loading } from '@/components/shared'
// // import { useAppDispatch } from '@/store'
// // import React, { useEffect, useState } from 'react'
// // import { getTermins, useAppSelector } from '../../ProyekEdit/store'
// // import { Button, Dialog, FormItem, Input } from '@/components/ui'
// // import { Formik, Form, Field } from 'formik'
// // import * as Yup from 'yup'

// // // Schema validasi untuk form faktur
// // const FakturSchema = Yup.object().shape({
// //     nomor: Yup.string().required('Nomor wajib diisi'),
// // })

// // // Interface untuk nilai awal form
// // interface FakturFormValues {
// //     nomor: string
// //     nominal: number
// // }

// // export default function Termin() {
// //     const dispatch = useAppDispatch()
// //     const [dialogIsOpen, setIsOpen] = useState(false)

// //     // Nilai awal untuk form
// //     const initialValues: FakturFormValues = {
// //         nomor: '',
// //         nominal: 0,
// //     }

// //     const openDialog = () => {
// //         setIsOpen(true)
// //     }

// //     const onDialogClose = (e: React.MouseEvent) => {
// //         console.log('onDialogClose', e)
// //         setIsOpen(false)
// //     }

// //     const handleSubmit = (values: FakturFormValues) => {
// //         console.log('Form values:', values)
// //         setIsOpen(false)
// //     }

// //     const terminsData = useAppSelector(
// //         (state) => state.proyekEdit.data.terminsData
// //     )

// //     const loadingTermins = useAppSelector(
// //         (state) => state.proyekEdit.data.loadingTermins
// //     )

// //     const fetchData = (data: { id: string }) => {
// //         dispatch(getTermins(data))
// //     }

// //     useEffect(() => {
// //         const path = location.pathname.substring(
// //             location.pathname.lastIndexOf('/') + 1
// //         )
// //         const rquestParam = { id: path }
// //         fetchData(rquestParam)

// //         // eslint-disable-next-line react-hooks/exhaustive-deps
// //     }, [location.pathname])

// //     console.log('terminsData', terminsData)
// //     return (
// //         <>
// //             <Loading loading={loadingTermins}>
// //                 {/* { terminsData && terminsData.length > 0 ? (} */}
// //                 <div className="flex flex-col py-6 space-y-2">
// //                     {terminsData?.map((termin, index) => (
// //                         <div
// //                             key={index}
// //                             className="bg-slate-50 rounded-md flex flex-row items-start justify-between gap-3 p-10 w-full"
// //                         >
// //                             <div className="text-sm flex flex-col text-slate-600">
// //                                 {termin.keterangan}
// //                                 <span className="font-bold text-xl">
// //                                     {termin.persen}%
// //                                 </span>
// //                             </div>
// //                             <Button
// //                                 size="sm"
// //                                 variant="solid"
// //                                 onClick={() => openDialog()}
// //                             >
// //                                 Tambah Faktur
// //                             </Button>
// //                         </div>
// //                     ))}
// //                 </div>

// //                 <Formik
// //                     initialValues={initialValues}
// //                     validationSchema={FakturSchema}
// //                     onSubmit={handleSubmit}
// //                 >
// //                     {({ errors, touched, handleSubmit }) => (
// //                         <Dialog
// //                             isOpen={dialogIsOpen}
// //                             onClose={onDialogClose}
// //                             onRequestClose={onDialogClose}
// //                             // Hapus property height yang tetap
// //                             className="flex items-center justify-center" // Tambahkan class centering
// //                             bodyOpenClassName="overflow-hidden" // Mencegah scroll pada body ketika dialog terbuka
// //                             overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" // Overlay responsif dengan padding
// //                             contentClassName="bg-white rounded-lg w-full max-w-md max-h-[90vh] my-auto overflow-y-auto" // Konten dialog yang responsif
// //                         >
// //                             <Form
// //                                 onSubmit={handleSubmit}
// //                                 className="flex flex-col h-full"
// //                             >
// //                                 <h5 className="mb-4">Tambah Faktur</h5>

// //                                 {/* Form */}
// //                                 {/* Gunakan flex-grow agar form mengisi space yang tersedia */}
// //                                 <div className="flex flex-col flex-grow space-y-4">
// //                                     <FormItem
// //                                         label="Nominal"
// //                                         invalid={
// //                                             (errors.nominal &&
// //                                                 touched.nominal) as boolean
// //                                         }
// //                                         errorMessage={errors.nominal}
// //                                     >
// //                                         <Field
// //                                             type="text"
// //                                             autoComplete="off"
// //                                             name="nominal"
// //                                             placeholder="Nominal"
// //                                             component={Input}
// //                                         />
// //                                     </FormItem>
// //                                     <FormItem
// //                                         label="Nominal"
// //                                         invalid={
// //                                             (errors.nominal &&
// //                                                 touched.nominal) as boolean
// //                                         }
// //                                         errorMessage={errors.nominal}
// //                                     >
// //                                         <Field
// //                                             type="text"
// //                                             autoComplete="off"
// //                                             name="nominal"
// //                                             placeholder="Nominal"
// //                                             component={Input}
// //                                         />
// //                                     </FormItem>
// //                                     <FormItem
// //                                         label="Nominal"
// //                                         invalid={
// //                                             (errors.nominal &&
// //                                                 touched.nominal) as boolean
// //                                         }
// //                                         errorMessage={errors.nominal}
// //                                     >
// //                                         <Field
// //                                             type="text"
// //                                             autoComplete="off"
// //                                             name="nominal"
// //                                             placeholder="Nominal"
// //                                             component={Input}
// //                                         />
// //                                     </FormItem>
// //                                     <FormItem
// //                                         label="Nominal"
// //                                         invalid={
// //                                             (errors.nominal &&
// //                                                 touched.nominal) as boolean
// //                                         }
// //                                         errorMessage={errors.nominal}
// //                                     >
// //                                         <Field
// //                                             type="text"
// //                                             autoComplete="off"
// //                                             name="nominal"
// //                                             placeholder="Nominal"
// //                                             component={Input}
// //                                         />
// //                                     </FormItem>
// //                                     <FormItem
// //                                         label="Nominal"
// //                                         invalid={
// //                                             (errors.nominal &&
// //                                                 touched.nominal) as boolean
// //                                         }
// //                                         errorMessage={errors.nominal}
// //                                     >
// //                                         <Field
// //                                             type="text"
// //                                             autoComplete="off"
// //                                             name="nominal"
// //                                             placeholder="Nominal"
// //                                             component={Input}
// //                                         />
// //                                     </FormItem>
// //                                     <FormItem
// //                                         label="Nominal"
// //                                         invalid={
// //                                             (errors.nominal &&
// //                                                 touched.nominal) as boolean
// //                                         }
// //                                         errorMessage={errors.nominal}
// //                                     >
// //                                         <Field
// //                                             type="text"
// //                                             autoComplete="off"
// //                                             name="nominal"
// //                                             placeholder="Nominal"
// //                                             component={Input}
// //                                         />
// //                                     </FormItem>
// //                                 </div>
// //                                 {/* Button Dialog Option - pastikan selalu ada di bawah */}
// //                                 <div className="text-right mt-6 pt-3 border-t">
// //                                     <Button
// //                                         className="ltr:mr-2 rtl:ml-2"
// //                                         variant="plain"
// //                                         onClick={onDialogClose}
// //                                         type="button"
// //                                     >
// //                                         Cancel
// //                                     </Button>
// //                                     <Button variant="solid" type="submit">
// //                                         Okay
// //                                     </Button>
// //                                 </div>
// //                             </Form>
// //                         </Dialog>
// //                     )}
// //                 </Formik>
// //             </Loading>
// //         </>
// //     )
// // }

import { Loading } from '@/components/shared'
import { useAppDispatch } from '@/store'
import React, { useEffect, useState } from 'react'
import { getTermins, useAppSelector } from '../../ProyekEdit/store'
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
import { apiCreateFakturPajak } from '@/services/FakturPajakService'
import { extractNumberFromString } from '@/utils/extractNumberFromString'
import { useNavigate } from 'react-router-dom'
import { getFakturPajak, getFakturPajaks } from '../store'

// Define missing interfaces
export interface SetSubmitting {
    (isSubmitting: boolean): void
}

export interface FormModel {
    nomor: string
    nominal: number
    tanggal: string
    // Add any other properties needed for the API
}

// Schema validasi untuk form faktur
const FakturSchema = Yup.object().shape({
    nomor: Yup.string().required('Nomor wajib diisi'),
    nominal: Yup.number().required('Nominal wajib diisi'),
    tanggal: Yup.string().required('Tanggal wajib diisi'),
})

// Interface untuk nilai awal form
interface FakturFormValues {
    nomor: string
    nominal: number
    tanggal: string
}

export default function Termin() {
    const dispatch = useAppDispatch()
    const [dialogIsOpen, setIsOpen] = useState(false)

    // Nilai awal untuk form
    const initialValues: FakturFormValues = {
        nomor: '',
        nominal: 0,
        tanggal: '',
    }

    const openDialog = () => {
        setIsOpen(true)
    }

    const onDialogClose = (e: React.MouseEvent) => {
        console.log('onDialogClose', e)
        setIsOpen(false)
    }

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

    const handleSubmit = async (
        values: FakturFormValues,
        { setSubmitting }: { setSubmitting: SetSubmitting }
    ) => {
        setSubmitting(true)

        const processedData = {
            ...values,
            nominal: extractNumberFromString(
                values.nominal as unknown as string | number
            ),
        }

        try {
            const successCreateFakturPajak = await apiCreateFakturPajak<
                boolean,
                FormModel
            >(processedData)

            if (successCreateFakturPajak) {
                popNotification('added')
                // Refresh termins data if needed
                const path = location.pathname.substring(
                    location.pathname.lastIndexOf('/') + 1
                )
                dispatch(getTermins({ id: path }))
            }
        } catch (error) {
            console.error('Error creating faktur pajak:', error)
        } finally {
            setSubmitting(false)
            setIsOpen(false)
        }
    }

    const terminsData = useAppSelector(
        (state) => state.proyekEdit.data.terminsData
    )

    const fakturPajakData = useAppSelector(
        (state) => state.proyekEdit.data.fakturPajakData
    )
    const fakturPajaksData = useAppSelector(
        (state) => state.proyekEdit.data.fakturPajakData
    )

    const loadingTermins = useAppSelector(
        (state) => state.proyekEdit.data.loadingTermins
    )

    const loadingFakturPajaks = useAppSelector(
        (state) => state.proyekEdit.data.loadingTermins
    )

    const fetchData = (data: { id: string }) => {
        dispatch(getTermins(data)) // by id
        dispatch(getFakturPajaks()) // by id
    }

    // termin(idProject)
    // fakturpajak

    console.log('fakturPajaksData', fakturPajaksData)
    // dispatch(getFakturPajak(data))

    useEffect(() => {
        const path = location.pathname.substring(
            location.pathname.lastIndexOf('/') + 1
        )
        const requestParam = { id: path }
        fetchData(requestParam)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname])

    console.log('fakturPajakData', fakturPajakData)
    return (
        <>
            <Loading loading={loadingTermins}>
                <div className="flex flex-col py-6 space-y-2">
                    {terminsData?.map((termin, index) => (
                        <div
                            key={index}
                            className="bg-slate-50 rounded-md flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-between gap-3 p-10 w-full"
                        >
                            <div className="text-sm flex flex-col text-slate-600">
                                {termin.keterangan}
                                <span className="font-bold text-xl">
                                    {termin.persen}%
                                </span>
                            </div>
                            {termin.idFakturPajak ? (
                                <div>
                                    <Button
                                        size="sm"
                                        variant="solid"
                                        onClick={() => openDialog()}
                                        disabled
                                    >
                                        {termin.idFakturPajak}
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    size="sm"
                                    variant="solid"
                                    onClick={() => openDialog()}
                                >
                                    Tambah Faktur
                                </Button>
                            )}
                        </div>
                    ))}
                </div>

                <Formik
                    initialValues={initialValues}
                    validationSchema={FakturSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, isSubmitting }) => (
                        <Dialog
                            isOpen={dialogIsOpen}
                            onClose={onDialogClose}
                            onRequestClose={onDialogClose}
                        >
                            <Form>
                                <h5 className="mb-4">Tambah Faktur</h5>

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
                                            {({ field, form }: FieldProps) => (
                                                <NumericFormat
                                                    {...field}
                                                    customInput={Input}
                                                    placeholder="0"
                                                    thousandSeparator="."
                                                    decimalSeparator=","
                                                    onValueChange={(values) => {
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
                                            {({ field, form }: FieldProps) => (
                                                <DatePicker
                                                    placeholder="Pilih Tanggal"
                                                    value={
                                                        field.value
                                                            ? new Date(
                                                                  field.value
                                                              )
                                                            : null
                                                    }
                                                    inputFormat="YYYY-MM-DD"
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
                                        Okay
                                    </Button>
                                </div>
                            </Form>
                        </Dialog>
                    )}
                </Formik>
            </Loading>
        </>
    )
}
