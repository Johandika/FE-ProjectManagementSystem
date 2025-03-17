import AdaptableCard from '@/components/shared/AdaptableCard'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Field, FieldProps, FormikErrors, FormikTouched } from 'formik'
import { NumericFormat } from 'react-number-format'
import { DatePicker, Select } from '@/components/ui'
import dayjs from 'dayjs'

type FormFieldsName = {
    nomor_po: string
    nama: string
    tanggal_po: string
    pabrik: string
    harga: number
    status: string
    estimasi_pengerjaan?: string
    idProject: string
}

type BasicInformationFields = {
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
    values?: FormFieldsName
}

const statuses = [
    { label: 'Selesai', value: 'Selesai' },
    { label: 'Dalam Proses', value: 'Dalam Proses' },
]

const BasicInformationFields = (props: BasicInformationFields) => {
    const { touched, errors } = props

    return (
        <AdaptableCard divider className="mb-4">
            <h5>Informasi Dasar</h5>
            <p className="mb-6">
                Sesi untuk mengatur informasi dasar faktur pajak
            </p>
            <FormItem
                label="Nomor purchase order"
                invalid={(errors.nomor_po && touched.nomor_po) as boolean}
                errorMessage={errors.nomor_po}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="nomor_po"
                    placeholder="Nomor purchase"
                    component={Input}
                />
            </FormItem>
            <FormItem
                label="Nama"
                invalid={(errors.nama && touched.nama) as boolean}
                errorMessage={errors.nama}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="nama"
                    placeholder="Nama purchase"
                    component={Input}
                />
            </FormItem>
            <FormItem
                label="Tanggal"
                invalid={(errors.tanggal_po && touched.tanggal_po) as boolean}
                errorMessage={errors.tanggal_po}
            >
                <Field name="tanggal_po">
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
            <FormItem
                label="Pabrik"
                invalid={(errors.pabrik && touched.pabrik) as boolean}
                errorMessage={errors.pabrik}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="pabrik"
                    placeholder="Pabrik"
                    component={Input}
                />
            </FormItem>

            <FormItem
                label="Harga"
                invalid={(errors.harga && touched.harga) as boolean}
                errorMessage={errors.harga}
            >
                <Field name="harga">
                    {({ field, form }: FieldProps) => (
                        <NumericFormat
                            {...field}
                            customInput={Input}
                            placeholder="Harga"
                            onValueChange={(values) => {
                                form.setFieldValue(field.name, values.value)
                            }}
                        />
                    )}
                </Field>
            </FormItem>

            <FormItem
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
            </FormItem>
            <FormItem
                label="Proyek"
                invalid={(errors.idProject && touched.idProject) as boolean}
                errorMessage={errors.idProject}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="idProject"
                    placeholder="Proyek"
                    component={Input}
                />
            </FormItem>
        </AdaptableCard>
    )
}

export default BasicInformationFields
