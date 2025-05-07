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
interface DetailItem {
    uraian: string
    satuan: string
    volume: number
    harga_satuan_material: number
    harga_satuan_jasa: number
    jumlah_harga_material: number
    jumlah_harga_jasa: number
    jumlah: number
}
interface Item {
    item: string
    detail: DetailItem[]
}
interface Subkontraktor {
    nama: string
    nilai_subkontrak: number
    nomor_surat: string
    id: string
    waktu_mulai_pelaksanaan: string
    waktu_selesai_pelaksanaan: string
    keterangan: string
}

type FormFieldsName = {
    pekerjaan: string
    pic: string
    nomor_kontrak: string
    uang_muka: number
    tanggal_service_po: string
    tanggal_kontrak: string
    tanggal_delivery: string
    nilai_kontrak: number
    timeline: number
    keterangan: string
    idClient: string
    berkas: string[]
    lokasi: string[]
    termin: Termin[]
    item: Item[]
    subkontraktor: Subkontraktor[]
}

type BasicInformationFields = {
    type: 'edit' | 'new'
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
    values?: FormFieldsName
    kliensList?: { id: string; nama: string; keterangan: string }[]
    berkasesList?: { id: string; nama: string }[]
}

const BasicInformationFields = (props: BasicInformationFields) => {
    const { type, touched, errors, kliensList = [], berkasesList = [] } = props
    return (
        <AdaptableCard divider className="mb-4">
            <h5>Informasi Dasar</h5>
            <p className="mb-6">Sesi untuk mengatur informasi dasar proyek</p>

            {/* Pekerjaan */}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4">
                {/* Client Select Field */}
                <div className="col-span-1">
                    <FormItem
                        label="Klien"
                        invalid={
                            (errors.idClient && touched.idClient) as boolean
                        }
                        errorMessage={errors.idClient}
                    >
                        <Field name="idClient">
                            {({ field, form }: FieldProps) => {
                                // Find the selected client based on current idClient value
                                const selectedClient = field.value
                                    ? kliensList.find(
                                          (client) => client.id === field.value
                                      )
                                    : null

                                // Map clients to options format required by Select component
                                const clientOptions = kliensList.map(
                                    (client) => ({
                                        value: client.id,
                                        label: `${client.nama}`,
                                    })
                                )

                                // console.log('field.value1', field.value)
                                // console.log('selected client', selectedClient)
                                // console.log(' kliensList', kliensList)
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
                                        }}
                                    />
                                )
                            }}
                        </Field>
                    </FormItem>
                </div>
                {/* Nomor Kontrak */}
                <div className="col-span-1">
                    <FormItem
                        label="Nomor Kontrak"
                        invalid={
                            (errors.nomor_kontrak &&
                                touched.nomor_kontrak) as boolean
                        }
                        errorMessage={errors.nomor_kontrak}
                    >
                        <Field
                            type="text"
                            autoComplete="off"
                            name="nomor_kontrak"
                            placeholder="Nomor Kontrak"
                            component={Input}
                        />
                    </FormItem>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4">
                {/* Tanggal Kontrak */}
                <div className="col-span-1">
                    <FormItem
                        label="Tanggal Kontrak"
                        invalid={
                            (errors.tanggal_kontrak &&
                                touched.tanggal_kontrak) as boolean
                        }
                        errorMessage={errors.tanggal_kontrak}
                    >
                        <Field name="tanggal_kontrak">
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
                                            ? dayjs(date).format('YYYY-MM-DD')
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
                {/* Nilai Kontrak */}
                <div className="col-span-1">
                    <FormItem
                        label="Nilai Kontrak"
                        invalid={
                            (errors.nilai_kontrak &&
                                touched.nilai_kontrak) as boolean
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
                                        form.setFieldValue(
                                            field.name,
                                            values.value
                                        )
                                    }}
                                />
                            )}
                        </Field>
                    </FormItem>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4">
                {/* Timeline */}
                <div className="col-span-1">
                    <FormItem
                        label="Timeline (hari)"
                        invalid={
                            (errors.timeline && touched.timeline) as boolean
                        }
                        errorMessage={errors.timeline}
                    >
                        <Field name="timeline">
                            {({ field, form }: FieldProps) => (
                                <NumericFormat
                                    {...field}
                                    name={field.name}
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
                </div>
                {/* PIC */}
                <div className="col-span-1">
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
                </div>
                {/* Uang Muka */}
                {/* <div className="col-span-1">
                    <FormItem
                        label="Uang Muka"
                        invalid={
                            (errors.uang_muka && touched.uang_muka) as boolean
                        }
                        errorMessage={errors.uang_muka}
                    >
                        <Field name="uang_muka">
                            {({ field, form }: FieldProps) => (
                                <NumericFormat
                                    {...field}
                                    customInput={Input}
                                    placeholder="Uang Muka"
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
                </div> */}
                {/* Berkas BASTP */}
                {/* <div className="col-span-1">
                    {type === 'new' && (
                        <FormItem
                            label="Berkas BASTP"
                            invalid={
                                (errors.berkas && touched.berkas) as boolean
                            }
                            errorMessage={errors.berkas}
                        >
                            <Field name="berkas">
                                {({ field, form }: FieldProps) => {
                                    // Convert berkas array values to options format
                                    const selectedOptions = field.value
                                        ? berkasesList
                                              .filter((berkas) => {
                                                  // Cek jika field.value adalah array ID atau array objek
                                                  if (
                                                      Array.isArray(field.value)
                                                  ) {
                                                      if (
                                                          typeof field
                                                              .value[0] ===
                                                          'string'
                                                      ) {
                                                          // Handle berkas sebagai array ID
                                                          return (
                                                              field.value.includes(
                                                                  berkas.id
                                                              ) ||
                                                              field.value.includes(
                                                                  berkas.nama
                                                              )
                                                          )
                                                      } else {
                                                          // Handle BerkasProjects sebagai array objek
                                                          return field.value.some(
                                                              (item: any) =>
                                                                  item.id ===
                                                                  berkas.id
                                                          )
                                                      }
                                                  }
                                                  return false
                                              })
                                              .map((berkas) => ({
                                                  value: berkas.id,
                                                  label: berkas.nama,
                                              }))
                                        : []

                                    // Map berkasesList to options format required by Select
                                    const berkasOptions = berkasesList.map(
                                        (berkas) => ({
                                            value: berkas.id,
                                            label: berkas.nama,
                                        })
                                    )

                                    return (
                                        <Select
                                            isMulti
                                            value={selectedOptions}
                                            options={berkasOptions}
                                            field={field}
                                            form={form}
                                            placeholder="Pilih berkas"
                                            onChange={(options) => {
                                                // Extract just the values (berkas names) for saving to formik
                                                const selectedValues = options
                                                    ? options.map(
                                                          (option: any) =>
                                                              option.value
                                                      )
                                                    : []
                                                form.setFieldValue(
                                                    field.name,
                                                    selectedValues
                                                )
                                            }}
                                        />
                                    )
                                }}
                            </Field>
                        </FormItem>
                    )}
                </div> */}
            </div>

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
