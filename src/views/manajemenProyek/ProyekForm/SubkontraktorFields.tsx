import { Field, FieldArray } from 'formik'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import DatePicker from '@/components/ui/DatePicker'
import { HiMinus, HiPlus } from 'react-icons/hi'
import AdaptableCard from '@/components/shared/AdaptableCard'
import type { FieldProps, FormikErrors, FormikTouched } from 'formik'
import dayjs from 'dayjs'
import { Select } from '@/components/ui'

const { DatePickerRange } = DatePicker

type Subcontractor = {
    nomor_surat: string
    nama_vendor_subkon: string
    nilai_subkon: number
    waktu_pelaksanaan_kerja: [Date | null, Date | null]
    keterangan: string
}

type SubcontractorFieldsProps = {
    touched: FormikTouched<{
        subkontraktor: Subcontractor[]
    }>
    errors: FormikErrors<{
        subkontraktor: Subcontractor[]
    }>
    subkontraktorsList?: {
        nomor_surat: string
        nama_vendor_subkon: string
        nilai_subkon: number
        waktu_pelaksanaan_kerja: string[]
        keterangan: string
    }[]
}

const SubcontractorFields = (props: SubcontractorFieldsProps) => {
    const { touched, errors, subkontraktorsList = [] } = props

    return (
        <AdaptableCard divider className="mb-4">
            <h5>Subkontraktor</h5>
            <p className="mb-6">Tambahkan detail subkontraktor proyek</p>

            <FieldArray name="subkontraktor">
                {({ push, remove, form }) => {
                    const { values } = form
                    const { subkontraktor = [] } = values as {
                        subkontraktor: Subcontractor[]
                    }

                    return (
                        <div>
                            {subkontraktor.map((_, index) => {
                                // Check for errors at the subcontractor object level
                                const subcontractorErrors = errors
                                    .subkontraktor?.[index] as
                                    | FormikErrors<Subcontractor>
                                    | undefined
                                const subcontractorTouched = touched
                                    .subkontraktor?.[index] as
                                    | FormikTouched<Subcontractor>
                                    | undefined

                                // Error checking for each field
                                const nomorSuratError =
                                    subcontractorErrors?.nomor_surat &&
                                    subcontractorTouched?.nomor_surat
                                const namaVendorError =
                                    subcontractorErrors?.nama_vendor_subkon &&
                                    subcontractorTouched?.nama_vendor_subkon
                                const nilaiSubkonError =
                                    subcontractorErrors?.nilai_subkon &&
                                    subcontractorTouched?.nilai_subkon
                                const waktuPelaksanaanError =
                                    subcontractorErrors?.waktu_pelaksanaan_kerja &&
                                    subcontractorTouched?.waktu_pelaksanaan_kerja
                                const keteranganError =
                                    subcontractorErrors?.keterangan &&
                                    subcontractorTouched?.keterangan

                                return (
                                    <div
                                        key={index}
                                        className="mb-4 border rounded-md p-4"
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <h6>Subkontraktor {index + 1}</h6>
                                            <Button
                                                type="button"
                                                shape="circle"
                                                variant="plain"
                                                size="sm"
                                                icon={<HiMinus />}
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    remove(index)
                                                }}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-3">
                                            <FormItem
                                                className="w-full mb-0"
                                                label="Nomor Surat"
                                                invalid={Boolean(
                                                    nomorSuratError
                                                )}
                                                errorMessage={
                                                    typeof errors
                                                        .subkontraktor?.[index]
                                                        ?.nomor_surat ===
                                                    'string'
                                                        ? errors
                                                              .subkontraktor?.[
                                                              index
                                                          ]?.nomor_surat
                                                        : ''
                                                }
                                            >
                                                <Field
                                                    type="text"
                                                    autoComplete="off"
                                                    name={`subkontraktor[${index}].nomor_surat`}
                                                    placeholder="Nomor surat subkontraktor"
                                                    component={Input}
                                                />
                                            </FormItem>

                                            {/* <FormItem
                                                className="w-full mb-0"
                                                label="Nama Vendor Subkon"
                                                invalid={Boolean(
                                                    namaVendorError
                                                )}
                                                errorMessage={
                                                    typeof errors
                                                        .subkontraktor?.[index]
                                                        ?.nama_vendor_subkon ===
                                                    'string'
                                                        ? errors
                                                              .subkontraktor?.[
                                                              index
                                                          ]?.nama_vendor_subkon
                                                        : ''
                                                }
                                            >
                                                <Field
                                                    type="text"
                                                    autoComplete="off"
                                                    name={`subkontraktor[${index}].nama_vendor_subkon`}
                                                    placeholder="Nama vendor subkontraktor"
                                                    component={Input}
                                                />
                                            </FormItem> */}
                                            {/* subkon */}
                                            <FormItem
                                                className="w-full mb-0"
                                                label="Nama Vendor Subkon"
                                                invalid={Boolean(
                                                    namaVendorError
                                                )}
                                                errorMessage={
                                                    typeof errors
                                                        .subkontraktor?.[index]
                                                        ?.nama_vendor_subkon ===
                                                    'string'
                                                        ? errors
                                                              .subkontraktor?.[
                                                              index
                                                          ]?.nama_vendor_subkon
                                                        : ''
                                                }
                                            >
                                                <Field
                                                    name={`subkontraktor[${index}].nama_vendor_subkon`}
                                                >
                                                    {({
                                                        field,
                                                        form,
                                                    }: FieldProps) => {
                                                        // Convert selected value to option format
                                                        const selectedOption =
                                                            field.value
                                                                ? subkontraktorsList.find(
                                                                      (
                                                                          vendor
                                                                      ) =>
                                                                          vendor.nama ===
                                                                          field.value
                                                                  )
                                                                    ? {
                                                                          value: field.value,
                                                                          label: field.value,
                                                                      }
                                                                    : null
                                                                : null

                                                        // Map vendor list to options format required by Select
                                                        const vendorOptions =
                                                            subkontraktorsList.map(
                                                                (vendor) => ({
                                                                    value: vendor.nama,
                                                                    label: vendor.nama,
                                                                })
                                                            )

                                                        return (
                                                            <Select
                                                                field={field}
                                                                form={form}
                                                                options={
                                                                    vendorOptions
                                                                }
                                                                value={
                                                                    selectedOption
                                                                }
                                                                placeholder="Pilih vendor subkontraktor"
                                                                onChange={(
                                                                    option
                                                                ) => {
                                                                    // Extract just the value (vendor name) for saving to formik
                                                                    const selectedValue =
                                                                        option
                                                                            ? option.value
                                                                            : ''
                                                                    form.setFieldValue(
                                                                        field.name,
                                                                        selectedValue
                                                                    )
                                                                }}
                                                            />
                                                        )
                                                    }}
                                                </Field>
                                            </FormItem>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-3">
                                            <FormItem
                                                className="mb-0"
                                                label="Nilai Subkon"
                                                invalid={Boolean(
                                                    nilaiSubkonError
                                                )}
                                                errorMessage={
                                                    typeof errors
                                                        .subkontraktor?.[index]
                                                        ?.nilai_subkon ===
                                                    'string'
                                                        ? errors
                                                              .subkontraktor?.[
                                                              index
                                                          ]?.nilai_subkon
                                                        : ''
                                                }
                                            >
                                                <Field
                                                    type="number"
                                                    autoComplete="off"
                                                    name={`subkontraktor[${index}].nilai_subkon`}
                                                    placeholder="Nilai kontrak subkontraktor"
                                                    component={Input}
                                                />
                                            </FormItem>

                                            <FormItem
                                                className="mb-0"
                                                label="Waktu Pelaksanaan Kerja"
                                                invalid={Boolean(
                                                    waktuPelaksanaanError
                                                )}
                                                errorMessage={
                                                    typeof errors
                                                        .subkontraktor?.[index]
                                                        ?.waktu_pelaksanaan_kerja ===
                                                    'string'
                                                        ? errors
                                                              .subkontraktor?.[
                                                              index
                                                          ]
                                                              ?.waktu_pelaksanaan_kerja
                                                        : ''
                                                }
                                            >
                                                <Field
                                                    name={`subkontraktor[${index}].waktu_pelaksanaan_kerja`}
                                                    component={({
                                                        field,
                                                        form,
                                                    }) => (
                                                        <DatePickerRange
                                                            placeholder="Pilih rentang waktu"
                                                            value={
                                                                Array.isArray(
                                                                    field.value
                                                                )
                                                                    ? field.value.map(
                                                                          (
                                                                              dateStr
                                                                          ) =>
                                                                              dateStr
                                                                                  ? new Date(
                                                                                        dateStr
                                                                                    )
                                                                                  : null
                                                                      )
                                                                    : [
                                                                          null,
                                                                          null,
                                                                      ]
                                                            }
                                                            singleDate={false}
                                                            closePickerOnChange={
                                                                false
                                                            }
                                                            onChange={(
                                                                selectedDates
                                                            ) => {
                                                                // Pastikan kedua tanggal terisi
                                                                const isFirstDateSet =
                                                                    selectedDates[0] !==
                                                                    null
                                                                const isSecondDateSet =
                                                                    selectedDates[1] !==
                                                                    null

                                                                // Hanya update jika kedua tanggal sudah dipilih
                                                                if (
                                                                    isFirstDateSet &&
                                                                    isSecondDateSet
                                                                ) {
                                                                    // Format tanggal ke string YYYY-MM-DD
                                                                    const formattedDates =
                                                                        selectedDates.map(
                                                                            (
                                                                                date
                                                                            ) =>
                                                                                date
                                                                                    ? dayjs(
                                                                                          date
                                                                                      ).format(
                                                                                          'YYYY-MM-DD'
                                                                                      )
                                                                                    : null
                                                                        )

                                                                    // Update field value di Formik dengan format yang diinginkan
                                                                    form.setFieldValue(
                                                                        `subkontraktor[${index}].waktu_pelaksanaan_kerja`,
                                                                        formattedDates
                                                                    )

                                                                    console.log(
                                                                        'Formatted Dates:',
                                                                        formattedDates
                                                                    )
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </FormItem>
                                        </div>

                                        <FormItem
                                            className="mb-0"
                                            label="Keterangan"
                                            invalid={Boolean(keteranganError)}
                                            errorMessage={
                                                typeof errors.subkontraktor?.[
                                                    index
                                                ]?.keterangan === 'string'
                                                    ? errors.subkontraktor?.[
                                                          index
                                                      ]?.keterangan
                                                    : ''
                                            }
                                        >
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name={`subkontraktor[${index}].keterangan`}
                                                placeholder="Keterangan pekerjaan subkontraktor"
                                                component={Input}
                                            />
                                        </FormItem>
                                    </div>
                                )
                            })}
                            <Button
                                type="button"
                                variant="twoTone"
                                icon={<HiPlus />}
                                onClick={() =>
                                    push({
                                        nomor_surat: '',
                                        nama_vendor_subkon: '',
                                        nilai_subkon: '',
                                        waktu_pelaksanaan_kerja: [null, null],
                                        keterangan: '',
                                    })
                                }
                            >
                                Tambah Subkontraktor
                            </Button>
                        </div>
                    )
                }}
            </FieldArray>
        </AdaptableCard>
    )
}

export default SubcontractorFields
