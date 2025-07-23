import AdaptableCard from '@/components/shared/AdaptableCard'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Field, FieldProps, FormikErrors, FormikTouched } from 'formik'
import { NumericFormat } from 'react-number-format'
import { DatePicker, Select } from '@/components/ui'
import dayjs from 'dayjs'
import { getSelectClient, useAppDispatch, useAppSelector } from '@/store'
import { useEffect } from 'react'

type FormFieldsName = {
    pekerjaan: string
    tanggal_pengajuan: string
    nilai_kontrak: number
    idClient: string
    // idDivisi: string
    prioritas: string
}

type BasicInformationFields = {
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
    kliensData: any[]
    dataDivisi: any[]
    type: 'edit' | 'new'
}

const BasicInformationFields = (props: BasicInformationFields) => {
    const dispatch = useAppDispatch()

    const { selectClient, loadingSelectClient } = useAppSelector(
        (state) => state.base.common
    )

    const { touched, errors, kliensData, dataDivisi, type } = props
    const prioritasOptions = [
        { value: 'Rendah', label: 'Rendah' },
        { value: 'Sedang', label: 'Sedang' },
        { value: 'Tinggi', label: 'Tinggi' },
    ]

    useEffect(() => {
        dispatch(getSelectClient())
    }, [])

    return (
        <AdaptableCard divider className="mb-4">
            <h5>Informasi Dasar</h5>
            <p className="mb-6">Sesi untuk mengatur informasi dasar tender</p>
            <FormItem
                label="Pekerjaan"
                invalid={(errors.pekerjaan && touched.pekerjaan) as boolean}
                errorMessage={errors.pekerjaan}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="pekerjaan"
                    placeholder="Nama"
                    component={Input}
                />
            </FormItem>

            {/* Tanggal */}
            <FormItem
                label="Tanggal Pengajuan"
                invalid={
                    (errors.tanggal_pengajuan &&
                        touched.tanggal_pengajuan) as boolean
                }
                errorMessage={errors.tanggal_pengajuan}
            >
                <Field name="tanggal_pengajuan">
                    {({ field, form }: FieldProps) => (
                        <DatePicker
                            placeholder="Pilih Tanggal"
                            value={field.value ? new Date(field.value) : null}
                            inputFormat="DD-MM-YYYY"
                            onChange={(date) => {
                                const formattedDate = date
                                    ? dayjs(date).format('YYYY-MM-DD')
                                    : ''
                                form.setFieldValue(field.name, formattedDate)
                            }}
                        />
                    )}
                </Field>
            </FormItem>

            {/* Nilai Kontrak */}
            <FormItem
                label="Nilai Kontrak (Rp)"
                invalid={
                    (errors.nilai_kontrak && touched.nilai_kontrak) as boolean
                }
                errorMessage={errors.nilai_kontrak}
            >
                <Field name="nilai_kontrak">
                    {({ field, form }: FieldProps) => (
                        <NumericFormat
                            {...field}
                            customInput={Input}
                            placeholder="0"
                            thousandSeparator="."
                            decimalSeparator=","
                            onValueChange={(values) => {
                                form.setFieldValue(field.name, values.value)
                            }}
                        />
                    )}
                </Field>
            </FormItem>

            {/* Pilih Client */}
            <FormItem
                label="Klien"
                invalid={(errors.idClient && touched.idClient) as boolean}
                errorMessage={errors.idClient}
            >
                <Field name="idClient">
                    {({ field, form }: FieldProps) => {
                        // Gunakan `selectClient` bukan `kliensList`
                        const clientOptions = selectClient.data?.map(
                            (client) => ({
                                value: client.id,
                                label: client.nama,
                            })
                        )

                        // Logika untuk menemukan nilai yang sedang aktif tetap sama,
                        // tapi gunakan `selectClient`
                        const selectedValue = clientOptions?.find(
                            (option) => option.value === field.value
                        )

                        return (
                            <Select
                                field={field}
                                form={form}
                                isLoading={loadingSelectClient}
                                options={clientOptions}
                                value={selectedValue}
                                placeholder="Pilih klien"
                                onChange={(option) => {
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

            {/* Pilih Divisi
            <FormItem
                label="Divisi"
                invalid={(errors.idDivisi && touched.idDivisi) as boolean}
                errorMessage={errors.idDivisi}
            >
                <Field name="idDivisi">
                    {({ field, form }: FieldProps) => (
                        <Select
                            placeholder="Pilih divisi"
                            options={dataDivisi?.map((role) => ({
                                label: role.name,
                                value: role.id,
                            }))}
                            value={dataDivisi
                                ?.map((role) => ({
                                    label: role.name,
                                    value: role.id,
                                }))
                                .find((opt) => opt.value === field.value)}
                            onChange={(selected) => {
                                form.setFieldValue(
                                    field.name,
                                    selected?.value || ''
                                )
                            }}
                        />
                    )}
                </Field>
            </FormItem> */}
        </AdaptableCard>
    )
}

export default BasicInformationFields
