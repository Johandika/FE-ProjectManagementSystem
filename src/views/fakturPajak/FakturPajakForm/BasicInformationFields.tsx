import AdaptableCard from '@/components/shared/AdaptableCard'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Field, FieldProps, FormikErrors, FormikTouched } from 'formik'
import { NumericFormat } from 'react-number-format'
import { DatePicker, Select } from '@/components/ui'
import dayjs from 'dayjs'

type FormFieldsName = {
    nomor: string
    nominal: number
    // keterangan: string
    tanggal: string
    // status: string
}

type BasicInformationFields = {
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
    values?: FormFieldsName
}

// const statuses = [
//     { label: 'Lunas', value: 'Lunas' },
//     { label: 'Belum Lunas', value: 'Belum Lunas' },
// ]

const BasicInformationFields = (props: BasicInformationFields) => {
    const { touched, errors } = props

    return (
        <AdaptableCard divider className="mb-4">
            <h5>Informasi Dasar</h5>
            <p className="mb-6">
                Sesi untuk mengatur informasi dasar faktur pajak
            </p>
            <FormItem
                label="Nomor Faktur Pajak"
                invalid={(errors.nomor && touched.nomor) as boolean}
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
            <FormItem
                label="Nominal"
                invalid={(errors.nominal && touched.nominal) as boolean}
                errorMessage={errors.nominal}
            >
                <Field name="nominal">
                    {({ field, form }: FieldProps) => (
                        <NumericFormat
                            {...field}
                            customInput={Input}
                            placeholder="Nominal"
                            onValueChange={(values) => {
                                form.setFieldValue(field.name, values.value)
                            }}
                        />
                    )}
                </Field>
            </FormItem>

            <FormItem
                label="Tanggal"
                invalid={(errors.tanggal && touched.tanggal) as boolean}
                errorMessage={errors.tanggal}
            >
                <Field name="tanggal">
                    {({ field, form }: FieldProps) => (
                        <DatePicker
                            placeholder="Pilih Tanggal"
                            value={field.value ? new Date(field.value) : null}
                            inputFormat="YYYY-MM-DD"
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
            {/* <FormItem
                label="Status"
                invalid={(errors.status && touched.status) as boolean}
                errorMessage={errors.status}
            >
                <Field name="status">
                    {({ field, form }: FieldProps) => {
                        // Cari status yang sesuai dengan nilai saat ini
                        const selectedStatus = field.value
                            ? statuses.find((s) => s.value === field.value)
                            : null

                        return (
                            <Select
                                field={field}
                                form={form}
                                options={statuses}
                                value={selectedStatus}
                                onChange={(option) =>
                                    form.setFieldValue(
                                        field.name,
                                        option?.value
                                    )
                                }
                            />
                        )
                    }}
                </Field>
            </FormItem> */}
            {/* <FormItem
                label="Keterangan"
                labelClass="!justify-start"
                invalid={(errors.keterangan && touched.keterangan) as boolean}
                errorMessage={errors.keterangan}
            >
                <Field
                    textArea
                    name="keterangan"
                    placeholder="Masukkan keterangan"
                    component={Input}
                />
            </FormItem> */}
        </AdaptableCard>
    )
}

export default BasicInformationFields
