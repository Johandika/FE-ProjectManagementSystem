import { Field, FieldArray, FieldProps } from 'formik'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import DatePicker from '@/components/ui/DatePicker'
import { HiMinus, HiPlus } from 'react-icons/hi'
import AdaptableCard from '@/components/shared/AdaptableCard'
import type { FormikErrors, FormikTouched } from 'formik'
import dayjs from 'dayjs'
import { Select } from '@/components/ui'
import { NumericFormat } from 'react-number-format'

const { DatePickerRange } = DatePicker

interface Subcontractor {
    id: string
    nomor_surat: string
    nilai_subkontrak: number
    waktu_mulai_pelaksanaan: string
    waktu_selesai_pelaksanaan: string
    keterangan: string
}

type FormFieldsName = {
    subkontraktor: Subcontractor[]
}

type SubcontractorFieldsProps = {
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
    subkontraktorsList?: {
        nilai_subkontrak: number
        nomor_surat: string
        id: string
        waktu_mulai_pelaksanaan: string
        waktu_selesai_pelaksanaan: string
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
                    const { subkontraktor = [] } = values as FormFieldsName

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
                                                invalid={
                                                    (subcontractorErrors?.nomor_surat &&
                                                        subcontractorTouched?.nomor_surat) as boolean
                                                }
                                                errorMessage={
                                                    subcontractorErrors?.nomor_surat
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

                                            <FormItem
                                                label="Nama Vendor Subkon"
                                                className="w-full mb-0"
                                                invalid={
                                                    (subcontractorErrors?.id &&
                                                        subcontractorTouched?.id) as boolean
                                                }
                                                errorMessage={
                                                    subcontractorErrors?.id
                                                }
                                            >
                                                <Field
                                                    name={`subkontraktor[${index}].id`}
                                                >
                                                    {({
                                                        field,
                                                        form,
                                                    }: FieldProps) => {
                                                        const selectedSubkon =
                                                            field.value
                                                                ? subkontraktorsList.find(
                                                                      (
                                                                          subkon
                                                                      ) =>
                                                                          subkon.id ===
                                                                          field.value
                                                                  )
                                                                : null

                                                        const subkonOptions =
                                                            subkontraktorsList.map(
                                                                (subkon) => ({
                                                                    value: subkon.id,
                                                                    label: `${subkon.nama}`,
                                                                })
                                                            )

                                                        return (
                                                            <Select
                                                                field={field}
                                                                form={form}
                                                                options={
                                                                    subkonOptions
                                                                }
                                                                value={
                                                                    selectedSubkon
                                                                        ? {
                                                                              value: selectedSubkon.id,
                                                                              label: `${selectedSubkon.nama}`,
                                                                          }
                                                                        : null
                                                                }
                                                                placeholder="Pilih subkontraktor"
                                                                onChange={(
                                                                    option
                                                                ) => {
                                                                    const selectedValue =
                                                                        option
                                                                            ? option.value
                                                                            : ''
                                                                    form.setFieldValue(
                                                                        field.name,
                                                                        selectedValue
                                                                    )

                                                                    // Simpan nama vendor dalam field terpisah jika diperlukan
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
                                                invalid={
                                                    (subcontractorErrors?.nilai_subkontrak &&
                                                        subcontractorTouched?.nilai_subkontrak) as boolean
                                                }
                                                errorMessage={
                                                    subcontractorErrors?.nilai_subkontrak
                                                }
                                            >
                                                <Field
                                                    name={`subkontraktor[${index}].nilai_subkontrak`}
                                                >
                                                    {({
                                                        field,
                                                        form,
                                                    }: FieldProps) => (
                                                        <NumericFormat
                                                            {...field}
                                                            customInput={Input}
                                                            placeholder="Nilai kontrak subkontraktor"
                                                            thousandSeparator="."
                                                            decimalSeparator=","
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                form.setFieldValue(
                                                                    field.name,
                                                                    values.value
                                                                )
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </FormItem>

                                            <FormItem
                                                className="mb-0"
                                                label="Waktu Pelaksanaan Kerja"
                                                invalid={
                                                    ((subcontractorErrors?.waktu_mulai_pelaksanaan &&
                                                        subcontractorTouched?.waktu_mulai_pelaksanaan) ||
                                                        (subcontractorErrors?.waktu_selesai_pelaksanaan &&
                                                            subcontractorTouched?.waktu_selesai_pelaksanaan)) as boolean
                                                }
                                                errorMessage={
                                                    subcontractorErrors?.waktu_mulai_pelaksanaan ||
                                                    subcontractorErrors?.waktu_selesai_pelaksanaan
                                                }
                                            >
                                                {/* Using DatePickerRange but updating separate fields */}
                                                <DatePickerRange
                                                    placeholder="Pilih rentang waktu"
                                                    value={[
                                                        subkontraktor[index]
                                                            .waktu_mulai_pelaksanaan
                                                            ? new Date(
                                                                  subkontraktor[
                                                                      index
                                                                  ].waktu_mulai_pelaksanaan
                                                              )
                                                            : null,
                                                        subkontraktor[index]
                                                            .waktu_selesai_pelaksanaan
                                                            ? new Date(
                                                                  subkontraktor[
                                                                      index
                                                                  ].waktu_selesai_pelaksanaan
                                                              )
                                                            : null,
                                                    ]}
                                                    singleDate={false}
                                                    // inputFormat="DD-MM-YYYY"
                                                    closePickerOnChange={false}
                                                    onChange={(
                                                        selectedDates
                                                    ) => {
                                                        // Only update if both dates are selected
                                                        if (
                                                            selectedDates[0] !==
                                                                null &&
                                                            selectedDates[1] !==
                                                                null
                                                        ) {
                                                            // Format dates to YYYY-MM-DD strings
                                                            const startDate =
                                                                dayjs(
                                                                    selectedDates[0]
                                                                ).format(
                                                                    'YYYY-MM-DD'
                                                                )
                                                            const endDate =
                                                                dayjs(
                                                                    selectedDates[1]
                                                                ).format(
                                                                    'YYYY-MM-DD'
                                                                )

                                                            // Update both fields separately
                                                            form.setFieldValue(
                                                                `subkontraktor[${index}].waktu_mulai_pelaksanaan`,
                                                                startDate
                                                            )
                                                            form.setFieldValue(
                                                                `subkontraktor[${index}].waktu_selesai_pelaksanaan`,
                                                                endDate
                                                            )
                                                        }
                                                    }}
                                                />
                                            </FormItem>
                                        </div>

                                        <FormItem
                                            className="mb-0"
                                            label="Keterangan"
                                            invalid={
                                                (subcontractorErrors?.keterangan &&
                                                    subcontractorTouched?.keterangan) as boolean
                                            }
                                            errorMessage={
                                                subcontractorErrors?.keterangan
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
                                        id: '',
                                        nomor_surat: '',
                                        nilai_subkontrak: '',
                                        waktu_mulai_pelaksanaan: '',
                                        waktu_selesai_pelaksanaan: '',
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
