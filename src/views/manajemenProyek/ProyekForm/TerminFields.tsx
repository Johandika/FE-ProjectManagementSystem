// export default TerminFields
import { Field, FieldArray, useFormikContext } from 'formik'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { HiMinus, HiPlus } from 'react-icons/hi'
import AdaptableCard from '@/components/shared/AdaptableCard'
import { NumericFormat } from 'react-number-format'
import type { FormikErrors, FormikTouched, FieldProps } from 'formik'
import { useMemo, useEffect } from 'react'

interface Termin {
    keterangan: string
    persen: number
}

type TerminFieldsProps = {
    touched: FormikTouched<{
        termin: Termin[]
    }>
    errors: FormikErrors<{
        termin: Termin[]
    }>
    terminsList?: {
        id: string
        persen: number
        tanggal: string
        status: string
        idProject: string
        idFakturPajak: string
        keterangan: string
    }[]
}

const TerminFields = (props: TerminFieldsProps) => {
    const { touched, errors, terminsList = [] } = props
    const { values, setFieldValue } = useFormikContext<{ termin: Termin[] }>()

    // Mengisi formik values dengan data dari terminsList saat komponen dimount
    useEffect(() => {
        if (terminsList && terminsList.length > 0) {
            const formattedTermin = terminsList.map((item) => ({
                keterangan: item.keterangan,
                persen: item.persen,
            }))
            setFieldValue('termin', formattedTermin)
        }
    }, [terminsList, setFieldValue])

    // Menghitung total persentase secara langsung saat render menggunakan useMemo
    const totalPersen = useMemo(() => {
        if (!values.termin || !Array.isArray(values.termin)) {
            return 0
        }

        return values.termin.reduce((sum, item) => {
            const value = parseFloat(String(item.persen)) || 0
            return sum + value
        }, 0)
    }, [values.termin])

    return (
        <AdaptableCard divider className="mb-4">
            <h5>Termin Pembayaran</h5>
            <p className="mb-6">
                Tambahkan data termin pembayaran beserta persentasenya
            </p>

            <FieldArray name="termin">
                {({ push, remove }) => {
                    return (
                        <div>
                            {values.termin && values.termin.length > 0 && (
                                <div className="flex mb-2">
                                    <div className="flex-grow mr-4">
                                        <p className="font-medium">
                                            Keterangan
                                        </p>
                                    </div>
                                    <div className="w-32">
                                        <p className="font-medium">
                                            Persentase (%)
                                        </p>
                                    </div>
                                    <div className="w-10"></div>
                                </div>
                            )}

                            {values.termin &&
                                values.termin.map((_, index) => {
                                    const keteranganError =
                                        errors.termin?.[index]?.keterangan &&
                                        touched.termin?.[index]?.keterangan

                                    const persenError =
                                        errors.termin?.[index]?.persen &&
                                        touched.termin?.[index]?.persen

                                    return (
                                        <div
                                            className="flex items-start mb-4"
                                            key={index}
                                        >
                                            <FormItem
                                                className="flex-grow mb-0 mr-4"
                                                invalid={Boolean(
                                                    keteranganError
                                                )}
                                                errorMessage={
                                                    typeof errors.termin?.[
                                                        index
                                                    ]?.keterangan === 'string'
                                                        ? errors.termin?.[index]
                                                              ?.keterangan
                                                        : ''
                                                }
                                            >
                                                <Field
                                                    type="text"
                                                    autoComplete="off"
                                                    name={`termin[${index}].keterangan`}
                                                    placeholder="Keterangan termin"
                                                    component={Input}
                                                />
                                            </FormItem>
                                            <FormItem
                                                className="w-32 mb-0 mr-2"
                                                invalid={Boolean(persenError)}
                                                errorMessage={
                                                    typeof errors.termin?.[
                                                        index
                                                    ]?.persen === 'string'
                                                        ? errors.termin?.[index]
                                                              ?.persen
                                                        : ''
                                                }
                                            >
                                                <Field
                                                    name={`termin[${index}].persen`}
                                                >
                                                    {({
                                                        field,
                                                        form,
                                                    }: FieldProps) => (
                                                        <NumericFormat
                                                            {...field}
                                                            customInput={Input}
                                                            placeholder="%"
                                                            suffix="%"
                                                            onValueChange={(
                                                                values
                                                            ) => {
                                                                form.setFieldValue(
                                                                    field.name,
                                                                    Number(
                                                                        values.value
                                                                    )
                                                                )
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </FormItem>

                                            <div className="flex items-center h-10">
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
                                        </div>
                                    )
                                })}

                            {/* Total Percentage Display */}
                            {values.termin && values.termin.length > 0 && (
                                <div className="flex justify-end mb-4">
                                    <div className="w-32 mr-12">
                                        <div
                                            className={`font-medium ${
                                                totalPersen !== 100
                                                    ? 'text-red-500'
                                                    : 'text-emerald-500'
                                            }`}
                                        >
                                            Total: {totalPersen}%
                                        </div>
                                        {totalPersen !== 100 && (
                                            <div className="text-xs text-red-500">
                                                Total harus 100%
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <Button
                                type="button"
                                variant="twoTone"
                                icon={<HiPlus />}
                                onClick={() =>
                                    push({ keterangan: '', persen: 0 })
                                }
                            >
                                Tambah Termin
                            </Button>
                        </div>
                    )
                }}
            </FieldArray>
        </AdaptableCard>
    )
}

export default TerminFields
