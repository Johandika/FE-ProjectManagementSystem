import AdaptableCard from '@/components/shared/AdaptableCard'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Field, FieldProps, FormikErrors, FormikTouched } from 'formik'
import { NumericFormat } from 'react-number-format'
import { DatePicker, Select } from '@/components/ui'
import dayjs from 'dayjs'

interface Termin {
    keterangan: string
    persen: number
}

type FormFieldsName = {
    pekerjaan: string
    klien: string
    pic: string
    nomor_spk: string
    nomor_spj: string
    nomor_spo: string
    tanggal_service_po: string
    tanggal_delivery: string
    nilai_kontrak: number
    realisasi: number
    progress: number
    sisa_waktu: number
    keterangan: string
    status: string
    idKlien: string
    berkas: string[]
    lokasi: string[]
    termin: Termin[]
}

type BasicInformationFields = {
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
    values?: FormFieldsName
    kliensList?: { id: string; nama: string; keterangan: string }[]
}

const statuses = [
    { label: 'Dalam Pengerjaan', value: 'Dalam Pengerjaan' },
    { label: 'Selesai', value: 'Selesai' },
    { label: 'Tertunda', value: 'Tertunda' },
    { label: 'Dibatalkan', value: 'Dibatalkan' },
]

const BasicInformationFields = (props: BasicInformationFields) => {
    const { touched, errors, kliensList = [] } = props

    return (
        <AdaptableCard divider className="mb-4">
            <h5>Informasi Dasar</h5>
            <p className="mb-6">Sesi untuk mengatur informasi dasar proyek</p>
            <FormItem
                label="Pekerjaan"
                invalid={(errors.pekerjaan && touched.pekerjaan) as boolean}
                errorMessage={errors.pekerjaan}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="pekerjaan"
                    placeholder="Nama pekerjaan"
                    component={Input}
                />
            </FormItem>
            {/* Client Select Field */}
            <FormItem
                label="Klien"
                invalid={(errors.idKlien && touched.idKlien) as boolean}
                errorMessage={errors.idKlien}
            >
                <Field name="idKlien">
                    {({ field, form }: FieldProps) => {
                        // Find the selected client based on current idKlien value
                        const selectedClient = field.value
                            ? kliensList.find(
                                  (client) => client.id === field.value
                              )
                            : null

                        // Map clients to options format required by Select component
                        const clientOptions = kliensList.map((client) => ({
                            value: client.id,
                            label: `${client.nama}`,
                        }))

                        return (
                            <Select
                                field={field}
                                form={form}
                                options={clientOptions}
                                value={
                                    selectedClient
                                        ? {
                                              value: selectedClient.id,
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
                                    // Also update the klien field with the client name
                                    if (option) {
                                        const client = kliensList.find(
                                            (c) => c.id === option.value
                                        )
                                        if (client) {
                                            form.setFieldValue(
                                                'klien',
                                                client.nama
                                            )
                                        }
                                    }
                                }}
                            />
                        )
                    }}
                </Field>
            </FormItem>
            <FormItem
                label="PIC"
                invalid={(errors.pic && touched.pic) as boolean}
                errorMessage={errors.pic}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="pic"
                    placeholder="Person in charge"
                    component={Input}
                />
            </FormItem>
            <FormItem
                label="Nomor SPK"
                invalid={(errors.nomor_spk && touched.nomor_spk) as boolean}
                errorMessage={errors.nomor_spk}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="nomor_spk"
                    placeholder="Nomor SPK"
                    component={Input}
                />
            </FormItem>

            <FormItem
                label="Nomor SPJ"
                invalid={(errors.nomor_spj && touched.nomor_spj) as boolean}
                errorMessage={errors.nomor_spj}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="nomor_spj"
                    placeholder="Nomor SPJ"
                    component={Input}
                />
            </FormItem>

            <FormItem
                label="Nomor SPO"
                invalid={(errors.nomor_spo && touched.nomor_spo) as boolean}
                errorMessage={errors.nomor_spo}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="nomor_spo"
                    placeholder="Nomor SPO"
                    component={Input}
                />
            </FormItem>
            <FormItem
                label="Tanggal Service PO"
                invalid={
                    (errors.tanggal_service_po &&
                        touched.tanggal_service_po) as boolean
                }
                errorMessage={errors.tanggal_service_po}
            >
                <Field name="tanggal_service_po">
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
                label="Tanggal Delivery"
                invalid={
                    (errors.tanggal_delivery &&
                        touched.tanggal_delivery) as boolean
                }
                errorMessage={errors.tanggal_delivery}
            >
                <Field name="tanggal_delivery">
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
                            placeholder="Nilai Kontrak"
                            thousandSeparator="."
                            decimalSeparator=","
                            onValueChange={(values) => {
                                form.setFieldValue(field.name, values.value)
                            }}
                        />
                    )}
                </Field>
            </FormItem>
            <FormItem
                label="Realisasi"
                invalid={(errors.realisasi && touched.realisasi) as boolean}
                errorMessage={errors.realisasi}
            >
                <Field name="realisasi">
                    {({ field, form }: FieldProps) => (
                        <NumericFormat
                            {...field}
                            customInput={Input}
                            placeholder="Realisasi"
                            thousandSeparator="."
                            decimalSeparator=","
                            onValueChange={(values) => {
                                form.setFieldValue(field.name, values.value)
                            }}
                        />
                    )}
                </Field>
            </FormItem>
            <FormItem
                label="Progress (%)"
                invalid={(errors.progress && touched.progress) as boolean}
                errorMessage={errors.progress}
            >
                <Field name="progress">
                    {({ field, form }: FieldProps) => (
                        <NumericFormat
                            {...field}
                            customInput={Input}
                            placeholder="%"
                            suffix="%"
                            onValueChange={(values) => {
                                form.setFieldValue(
                                    field.name,
                                    Number(values.value)
                                )
                            }}
                        />
                    )}
                </Field>
            </FormItem>

            <FormItem
                label="Sisa Waktu (hari)"
                invalid={(errors.sisa_waktu && touched.sisa_waktu) as boolean}
                errorMessage={errors.sisa_waktu}
            >
                <Field name="sisa_waktu">
                    {({ field, form }: FieldProps) => (
                        <NumericFormat
                            {...field}
                            customInput={Input}
                            placeholder="Sisa waktu dalam hari"
                            suffix=" hari"
                            onValueChange={(values) => {
                                form.setFieldValue(
                                    field.name,
                                    Number(values.value)
                                )
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
            </FormItem>
        </AdaptableCard>
    )
}

export default BasicInformationFields
