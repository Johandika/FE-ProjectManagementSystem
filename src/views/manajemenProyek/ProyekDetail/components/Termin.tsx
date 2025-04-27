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
import { getFakturPajaks } from '../store'
import { extractIntegerFromStringAndFloat } from '@/utils/extractNumberFromString'

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
    const [selectedTermin, setSelectedTermin] = useState<any>(null)

    // Nilai awal untuk form
    const initialValues: FakturFormValues = {
        nomor: '',
        nominal: 0,
        tanggal: '',
    }

    const openDialog = (termin: any) => {
        setSelectedTermin(termin)
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
        console.log('values', values)
        const processedData = {
            ...values,
            nominal: extractIntegerFromStringAndFloat(
                values.nominal as unknown as string | number
            ),
            idTerminProject: selectedTermin?.id || '',
            idProject: selectedTermin?.idProject || '',
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

    // const fakturPajakData = useAppSelector(
    //     (state) => state.proyekEdit.data.fakturPajakData
    // )
    // const fakturPajaksData = useAppSelector(
    //     (state) => state.proyekEdit.data.fakturPajakData
    // )

    const loadingTermins = useAppSelector(
        (state) => state.proyekEdit.data.loadingTermins
    )

    // const loadingFakturPajaks = useAppSelector(
    //     (state) => state.proyekEdit.data.loadingTermins
    // )

    const fetchData = (data: { id: string }) => {
        dispatch(getTermins(data)) // by id
        dispatch(getFakturPajaks()) // by id
    }

    useEffect(() => {
        const path = location.pathname.substring(
            location.pathname.lastIndexOf('/') + 1
        )
        const requestParam = { id: path }
        fetchData(requestParam)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname])

    console.log(terminsData, 'terminsData')
    return (
        <>
            <Loading loading={loadingTermins}>
                <div className="flex flex-col py-6 space-y-2">
                    <Button
                        size="sm"
                        variant="solid"
                        // onClick={}
                        className="w-fit"
                    >
                        Tambah Faktur
                    </Button>
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
                                    <Button size="sm" variant="solid" disabled>
                                        {termin.idFakturPajak}
                                    </Button>
                                </div>
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
