import AdaptableCard from '@/components/shared/AdaptableCard'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Field, FieldProps, FormikErrors, FormikTouched } from 'formik'
import { NumericFormat } from 'react-number-format'
import { DatePicker, Select } from '@/components/ui'
import dayjs from 'dayjs'

type FormFieldsName = {
    pekerjaan: string
    tanggal_pengajuan: string
    nilai_kontrak: number
    idClient: string
}

type BasicInformationFields = {
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
    kliensData: any[]
}

const BasicInformationFields = (props: BasicInformationFields) => {
    const { touched, errors, kliensData } = props

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
                label="Nilai Kontrak"
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
                        // Find the selected client based on current idClient value
                        const selectedClient = field.value
                            ? kliensData?.find(
                                  (client: any) => client.id === field.value
                              )
                            : null

                        // Map clients to options format required by Select component
                        const clientOptions = Array.isArray(kliensData)
                            ? kliensData.map((client: any) => ({
                                  value: client.id,
                                  label: client.nama,
                              }))
                            : []

                        return (
                            <Select
                                field={field}
                                form={form}
                                options={clientOptions}
                                value={
                                    selectedClient
                                        ? {
                                              value: selectedClient.nama,
                                              label: `${selectedClient.nama}`,
                                          }
                                        : null
                                }
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
        </AdaptableCard>
    )
}

export default BasicInformationFields
