import { Field, FieldArray } from 'formik'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { HiMinus, HiPlus } from 'react-icons/hi'
import AdaptableCard from '@/components/shared/AdaptableCard'
import type { FormikErrors, FormikTouched } from 'formik'

type LocationFieldsProps = {
    touched: FormikTouched<{
        lokasi: string[]
    }>
    errors: FormikErrors<{
        lokasi: string[]
    }>
}

const LocationFields = (props: LocationFieldsProps) => {
    const { touched, errors } = props

    return (
        <AdaptableCard divider className="mb-4">
            <h5>Lokasi Proyek</h5>
            <p className="mb-6">Tambahkan lokasi-lokasi proyek yang terkait</p>

            <FieldArray name="lokasi">
                {({ push, remove, form }) => {
                    const { values } = form
                    const { lokasi = [] } = values as { lokasi: string[] }

                    return (
                        <div>
                            {lokasi.map((_, index) => {
                                const lokasiError =
                                    errors.lokasi?.[index] &&
                                    touched.lokasi?.[index]

                                return (
                                    <div
                                        className="flex items-center mb-4"
                                        key={index}
                                    >
                                        <FormItem
                                            className="w-full mb-0 mr-2"
                                            invalid={Boolean(lokasiError)}
                                            errorMessage={
                                                typeof errors.lokasi?.[
                                                    index
                                                ] === 'string'
                                                    ? errors.lokasi?.[index]
                                                    : ''
                                            }
                                        >
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name={`lokasi[${index}]`}
                                                placeholder="Nama lokasi"
                                                component={Input}
                                            />
                                        </FormItem>
                                        <Button
                                            type="button"
                                            shape="circle"
                                            variant="plain"
                                            size="sm"
                                            icon={<HiMinus />}
                                            onClick={(e) => {
                                                e.preventDefault() // Mencegah event default
                                                e.stopPropagation() // Mencegah event bubbling
                                                remove(index)
                                            }}
                                        />
                                    </div>
                                )
                            })}
                            <Button
                                type="button"
                                variant="twoTone"
                                icon={<HiPlus />}
                                onClick={() => push('')}
                            >
                                Tambah Lokasi
                            </Button>
                        </div>
                    )
                }}
            </FieldArray>
        </AdaptableCard>
    )
}

export default LocationFields
