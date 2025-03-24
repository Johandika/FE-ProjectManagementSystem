import { Field, FieldArray } from 'formik'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { HiMinus, HiPlus } from 'react-icons/hi'
import AdaptableCard from '@/components/shared/AdaptableCard'
import type { FormikErrors, FormikTouched } from 'formik'

type Location = {
    nama: string
    latitude: number
    longitude: number
}

type LocationFieldsProps = {
    touched: FormikTouched<{
        lokasi: Location[]
    }>
    errors: FormikErrors<{
        lokasi: Location[]
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
                    const { lokasi = [] } = values as {
                        lokasi: Location[]
                    }

                    return (
                        <div>
                            {lokasi.map((_, index) => {
                                // Cek apakah error ada di level objek location
                                const locationErrors = errors.lokasi?.[
                                    index
                                ] as FormikErrors<Location> | undefined
                                const locationTouched = touched.lokasi?.[
                                    index
                                ] as FormikTouched<Location> | undefined

                                const nameError =
                                    locationErrors?.nama &&
                                    locationTouched?.nama
                                const latitudeError =
                                    locationErrors?.latitude &&
                                    locationTouched?.latitude
                                const longitudeError =
                                    locationErrors?.longitude &&
                                    locationTouched?.longitude

                                return (
                                    <div
                                        key={index}
                                        className="mb-4 border rounded-md p-4"
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <h6>Lokasi {index + 1}</h6>
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
                                        <div className="mb-3">
                                            <FormItem
                                                className="w-full mb-0"
                                                label="Nama Lokasi"
                                                invalid={Boolean(nameError)}
                                                errorMessage={
                                                    typeof errors.lokasi?.[
                                                        index
                                                    ]?.nama === 'string'
                                                        ? errors.lokasi?.[index]
                                                              ?.nama
                                                        : ''
                                                }
                                            >
                                                <Field
                                                    type="text"
                                                    autoComplete="off"
                                                    name={`lokasi[${index}].nama`}
                                                    placeholder="Nama lokasi"
                                                    component={Input}
                                                />
                                            </FormItem>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormItem
                                                className="mb-0"
                                                label="Latitude"
                                                invalid={Boolean(latitudeError)}
                                                errorMessage={
                                                    typeof errors.lokasi?.[
                                                        index
                                                    ]?.latitude === 'string'
                                                        ? errors.lokasi?.[index]
                                                              ?.latitude
                                                        : ''
                                                }
                                            >
                                                <Field
                                                    type="number"
                                                    step="0.0001"
                                                    autoComplete="off"
                                                    name={`lokasi[${index}].latitude`}
                                                    placeholder="contoh: -6.2088"
                                                    component={Input}
                                                />
                                            </FormItem>
                                            <FormItem
                                                className="mb-0"
                                                label="Longitude"
                                                invalid={Boolean(
                                                    longitudeError
                                                )}
                                                errorMessage={
                                                    typeof errors.lokasi?.[
                                                        index
                                                    ]?.longitude === 'string'
                                                        ? errors.lokasi?.[index]
                                                              ?.longitude
                                                        : ''
                                                }
                                            >
                                                <Field
                                                    type="number"
                                                    step="0.0001"
                                                    autoComplete="off"
                                                    name={`lokasi[${index}].longitude`}
                                                    placeholder="contoh: 106.8456"
                                                    component={Input}
                                                />
                                            </FormItem>
                                        </div>
                                    </div>
                                )
                            })}
                            <Button
                                type="button"
                                variant="twoTone"
                                icon={<HiPlus />}
                                onClick={() =>
                                    push({
                                        name: '',
                                        latitude: '',
                                        longitude: '',
                                    })
                                }
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
