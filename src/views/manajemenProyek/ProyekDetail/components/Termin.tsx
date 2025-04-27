import { Loading } from '@/components/shared'
import { useAppDispatch } from '@/store'
import React, { useEffect, useState } from 'react'
import {
    getFakturPajakByProyekId,
    getTermins,
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
import { apiCreateFakturPajak } from '@/services/FakturPajakService'
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

    const FakturPajakByProyekData = useAppSelector(
        (state) => state.proyekEdit.data.fakturPajakByProyekData
    )

    const loadingTermins = useAppSelector(
        (state) => state.proyekEdit.data.loadingTermins
    )

    // const loadingFakturPajaks = useAppSelector(
    //     (state) => state.proyekEdit.data.loadingTermins
    // )

    const fetchData = (data: { id: string }) => {
        dispatch(getTermins(data)) // by id
        dispatch(getFakturPajakByProyekId(data))
        // dispatch(getFakturPajakByProyek(data)) // by id
    }

    useEffect(() => {
        const path = location.pathname.substring(
            location.pathname.lastIndexOf('/') + 1
        )
        const requestParam = { id: path }
        fetchData(requestParam)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname])

    console.log('FakturPajakByProyekData', FakturPajakByProyekData)
    return (
        <>
            <Loading loading={loadingTermins}>
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
                        // find  data faktur pajak by project dengan termin.idFakturPajak
                        const fakturByTermin = FakturPajakByProyekData?.find(
                            (faktur) => faktur.id === termin.idFakturPajak
                        )
                        console.log('fakturByTermin', fakturByTermin)
                        return (
                            <div
                                key={index}
                                className="bg-slate-50 rounded-md flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-between gap-3 p-6 sm:p-10 w-full"
                            >
                                <div className="flex flex-col  gap-4  sm:gap-0 sm:flex-row w-full">
                                    <div className="text-sm flex flex-col text-slate-600 flex-auto sm:items-start items-center">
                                        {termin.keterangan}
                                        <span className="font-bold text-xl">
                                            {termin.persen}%
                                        </span>
                                    </div>
                                    {/* JIka faktur ada tampilkan button edit dan delete faktur */}
                                    {termin.idFakturPajak ? (
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
                                                            {
                                                                fakturByTermin?.nominal
                                                            }
                                                        </div>
                                                        <div>
                                                            <span className="font-semibold">
                                                                Nominal :{' '}
                                                            </span>
                                                            {
                                                                fakturByTermin?.nominal
                                                            }
                                                        </div>
                                                        <div>
                                                            <span className="font-semibold">
                                                                Tanggal :{' '}
                                                            </span>
                                                            {formatDate(
                                                                fakturByTermin?.tanggal ||
                                                                    ''
                                                            ) || ''}
                                                        </div>
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
                                                            // onClick={() =>
                                                            //     handleEdit(
                                                            //         index
                                                            //     )
                                                            // }
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
                                                            // onClick={() =>
                                                            //     handleConfirmDelete(
                                                            //         index
                                                            //     )
                                                            // }
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
