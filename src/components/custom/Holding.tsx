import React, { useEffect } from 'react'
import { Button, DatePicker, FormItem } from '../ui'
import { Field, FieldProps, Form, Formik } from 'formik'
import * as Yup from 'yup'
import dayjs from 'dayjs'
import { getDashboard, useAppDispatch, useAppSelector } from '@/store'
import { Loading } from '../shared'

interface DashboardData {
    total_proyek: number
    total_nilai_kontrak: number
    nilai_sudah_dibayar: number
    nilai_sudah_ditagih: number
    total_tender: number
    total_nilai_tender: number
    total_tender_pengajuan: number
    total_nilai_tender_pengajuan: number
    total_tender_diterima: number
    total_nilai_tender_diterima: number
    total_tender_ditolak: number
    total_nilai_tender_ditolak: number
    total_faktur_pajak: number
}

interface HoldingProps {
    data: {
        data: DashboardData
    }
}

interface BastpFormValues {
    tanggal_awal: string
    tanggal_akhir: string
}

const today = dayjs()
const bastpFormInitialValues: BastpFormValues = {
    tanggal_awal: today.startOf('month').format('YYYY-MM-DD'),
    tanggal_akhir: today.format('YYYY-MM-DD'),
}

const BastpSchema = Yup.object().shape({
    tanggal_awal: Yup.string().required('Wajib diisi'),
    tanggal_akhir: Yup.string().required('Wajib diisi'),
})

export default function Holding({ dataAwal }: any) {
    const dispatch = useAppDispatch()
    // Format number to currency (IDR)
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value)
    }
    const handleFilter = (values: BastpFormValues) => {
        // Lakukan aksi filter di sini
        dispatch(getDashboard(values))
    }

    return (
        <div className="flex flex-col">
            {/* Filter Tanggal */}
            <Formik
                initialValues={bastpFormInitialValues}
                validationSchema={BastpSchema}
                onSubmit={handleFilter}
                enableReinitialize
            >
                {({ errors, touched }) => (
                    <Form className="flex flex-col md:flex-row gap-0 md:gap-4 mt-0 md:mt-4 mb-4 sm:mb-0">
                        {/* Tanggal Awal */}
                        <FormItem
                            label="Tanggal Awal"
                            invalid={
                                (errors.tanggal_awal &&
                                    touched.tanggal_awal) as boolean
                            }
                            errorMessage={errors.tanggal_awal}
                        >
                            <Field name="tanggal_awal">
                                {({ field, form }: FieldProps) => (
                                    <DatePicker
                                        placeholder="Pilih Tanggal"
                                        value={
                                            field.value
                                                ? new Date(field.value)
                                                : null
                                        }
                                        inputFormat="DD-MM-YYYY"
                                        onChange={(date) => {
                                            const formattedDate = date
                                                ? dayjs(date).format(
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

                        {/* Tanggal Akhir */}
                        <FormItem
                            label="Tanggal Akhir"
                            invalid={
                                (errors.tanggal_akhir &&
                                    touched.tanggal_akhir) as boolean
                            }
                            errorMessage={errors.tanggal_akhir}
                        >
                            <Field name="tanggal_akhir">
                                {({ field, form }: FieldProps) => (
                                    <DatePicker
                                        placeholder="Pilih Tanggal"
                                        value={
                                            field.value
                                                ? new Date(field.value)
                                                : null
                                        }
                                        inputFormat="DD-MM-YYYY"
                                        onChange={(date) => {
                                            const formattedDate = date
                                                ? dayjs(date).format(
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

                        <Button
                            type="submit"
                            variant="solid"
                            className="mt-[21px]"
                        >
                            Filter
                        </Button>
                    </Form>
                )}
            </Formik>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg mt-4">
                {/* Card 1: Total Proyek */}
                <div className="bg-slate-50 rounded-lg shadow p-6 border-l-4 border-blue-500">
                    <h2 className="text-gray-600 text-sm font-normal ">
                        Total Proyek
                    </h2>
                    <p className="text-2xl font-semibold text-slate-900 mt-2">
                        {dataAwal?.total_proyek}
                    </p>
                </div>

                {/* Card 2: Total Nilai Kontrak */}
                <div className="bg-slate-50 rounded-lg shadow p-6 border-l-4 border-green-500">
                    <h2 className="text-gray-600 text-sm font-normal ">
                        Total Nilai Kontrak
                    </h2>
                    <p className="text-2xl font-semibold text-slate-900 mt-2">
                        {formatCurrency(dataAwal?.total_nilai_kontrak)}
                    </p>
                </div>

                {/* Card 3: Total Faktur Pajak */}
                <div className="bg-slate-50 rounded-lg shadow p-6 border-l-4 border-purple-500">
                    <h2 className="text-gray-600 text-sm font-normal ">
                        Total Faktur Pajak
                    </h2>
                    <p className="text-2xl font-semibold text-slate-900 mt-2">
                        {dataAwal?.total_faktur_pajak}
                    </p>
                </div>

                {/* Card 4: Nilai Sudah Dibayar */}
                <div className="bg-slate-50 rounded-lg shadow p-6 border-l-4 border-yellow-500">
                    <h2 className="text-gray-600 text-sm font-normal ">
                        Nilai Sudah Dibayar
                    </h2>
                    <p className="text-2xl font-semibold text-slate-900 mt-2">
                        {formatCurrency(dataAwal?.nilai_sudah_dibayar)}
                    </p>
                    <div className="mt-2">
                        <span className="text-sm text-gray-500">
                            {Math.round(
                                (dataAwal?.nilai_sudah_dibayar /
                                    dataAwal?.total_nilai_kontrak) *
                                    100
                            )}
                            % dari total kontrak
                        </span>
                    </div>
                </div>

                {/* Card 5: Nilai Sudah Ditagih */}
                <div className="bg-slate-50 rounded-lg shadow p-6 border-l-4 border-red-500">
                    <h2 className="text-gray-600 text-sm font-normal ">
                        Nilai Sudah Ditagih
                    </h2>
                    <p className="text-2xl font-semibold text-slate-900 mt-2">
                        {formatCurrency(dataAwal?.nilai_sudah_ditagih)}
                    </p>
                    <div className="mt-2">
                        <span className="text-sm text-gray-500">
                            {Math.round(
                                (dataAwal?.nilai_sudah_ditagih /
                                    dataAwal?.total_nilai_kontrak) *
                                    100
                            )}
                            % dari total kontrak
                        </span>
                    </div>
                </div>

                {/* Card 6: Total Tender */}
                <div className="bg-slate-50 rounded-lg shadow p-6 border-l-4 border-indigo-500">
                    <h2 className="text-gray-600 text-sm font-normal ">
                        Total Tender
                    </h2>
                    <p className="text-2xl font-semibold text-slate-900 mt-2">
                        {dataAwal?.total_tender}
                    </p>
                    <div className="mt-2 flex space-x-4 text-sm">
                        <div>
                            <span className="text-green-600">Diterima: </span>
                            <span>{dataAwal?.total_tender_diterima}</span>
                        </div>
                        <div>
                            <span className="text-red-600">Ditolak: </span>
                            <span>{dataAwal?.total_tender_ditolak}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
