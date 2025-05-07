import { Field, FieldArray, FieldProps } from 'formik'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { HiMinus, HiPlus } from 'react-icons/hi'
import AdaptableCard from '@/components/shared/AdaptableCard'
import type { FormikErrors, FormikTouched } from 'formik'
import { NumericFormat } from 'react-number-format'

interface ItemDetail {
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
    detail: ItemDetail[]
}

type FormFieldsName = {
    item: Item[]
}

type ItemFieldsProps = {
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
}

const ItemFields = (props: ItemFieldsProps) => {
    const { touched, errors } = props

    const calculateJumlahHargaMaterial = (
        volume: number,
        hargaSatuan: number
    ) => {
        return volume * hargaSatuan
    }

    const calculateJumlahHargaJasa = (volume: number, hargaSatuan: number) => {
        return volume * hargaSatuan
    }

    const calculateJumlahTotal = (hargaMaterial: number, hargaJasa: number) => {
        return hargaMaterial + hargaJasa
    }

    return (
        <AdaptableCard divider className="mb-4">
            <h5>Item Pekerjaan</h5>
            <p className="mb-6">
                Tambahkan item-item pekerjaan untuk proyek ini
            </p>

            <FieldArray name="item">
                {({ push: pushItem, remove: removeItem, form }) => {
                    const { values } = form
                    const { item = [] } = values as FormFieldsName

                    return (
                        <div>
                            {item.map((_, itemIndex) => {
                                // Check for errors at the item level
                                const itemErrors = errors.item?.[itemIndex] as
                                    | FormikErrors<Item>
                                    | undefined
                                const itemTouched = touched.item?.[
                                    itemIndex
                                ] as FormikTouched<Item> | undefined

                                return (
                                    <div
                                        key={itemIndex}
                                        className="mb-6 border rounded-lg p-4"
                                    >
                                        <div className="flex justify-between items-center mb-4">
                                            <h6 className="text-base font-semibold">
                                                Item {itemIndex + 1}
                                            </h6>
                                            <Button
                                                type="button"
                                                shape="circle"
                                                variant="plain"
                                                size="sm"
                                                icon={<HiMinus />}
                                                onClick={() =>
                                                    removeItem(itemIndex)
                                                }
                                            />
                                        </div>

                                        {/* Nama Item */}
                                        <FormItem
                                            label="Nama Item"
                                            invalid={
                                                (itemErrors?.item &&
                                                    itemTouched?.item) as boolean
                                            }
                                            errorMessage={itemErrors?.item}
                                            className="mb-4"
                                        >
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name={`item[${itemIndex}].item`}
                                                placeholder="Nama item pekerjaan"
                                                component={Input}
                                            />
                                        </FormItem>

                                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-4">
                                            <h6 className="mb-2">
                                                Detail Item
                                            </h6>

                                            <FieldArray
                                                name={`item[${itemIndex}].detail`}
                                            >
                                                {({
                                                    push: pushDetail,
                                                    remove: removeDetail,
                                                }) => {
                                                    const details =
                                                        item[itemIndex]
                                                            ?.detail || []

                                                    return (
                                                        <div>
                                                            {details.map(
                                                                (
                                                                    _,
                                                                    detailIndex
                                                                ) => {
                                                                    // Check for errors at the detail level
                                                                    const detailErrors =
                                                                        itemErrors
                                                                            ?.detail?.[
                                                                            detailIndex
                                                                        ] as
                                                                            | FormikErrors<ItemDetail>
                                                                            | undefined

                                                                    const detailTouched =
                                                                        itemTouched
                                                                            ?.detail?.[
                                                                            detailIndex
                                                                        ] as
                                                                            | FormikTouched<ItemDetail>
                                                                            | undefined

                                                                    return (
                                                                        <div
                                                                            key={
                                                                                detailIndex
                                                                            }
                                                                            className="mb-4 border border-dashed rounded-md p-4"
                                                                        >
                                                                            <div className="flex justify-between items-center mb-2">
                                                                                <h6>
                                                                                    Detail{' '}
                                                                                    {detailIndex +
                                                                                        1}
                                                                                </h6>
                                                                                <Button
                                                                                    type="button"
                                                                                    shape="circle"
                                                                                    variant="plain"
                                                                                    size="sm"
                                                                                    icon={
                                                                                        <HiMinus />
                                                                                    }
                                                                                    onClick={() =>
                                                                                        removeDetail(
                                                                                            detailIndex
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </div>

                                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                                                                <FormItem
                                                                                    className="mb-0"
                                                                                    label="Uraian"
                                                                                    invalid={
                                                                                        (detailErrors?.uraian &&
                                                                                            detailTouched?.uraian) as boolean
                                                                                    }
                                                                                    errorMessage={
                                                                                        detailErrors?.uraian
                                                                                    }
                                                                                >
                                                                                    <Field
                                                                                        type="text"
                                                                                        autoComplete="off"
                                                                                        name={`item[${itemIndex}].detail[${detailIndex}].uraian`}
                                                                                        placeholder="Uraian pekerjaan"
                                                                                        component={
                                                                                            Input
                                                                                        }
                                                                                    />
                                                                                </FormItem>

                                                                                <FormItem
                                                                                    className="mb-0"
                                                                                    label="Satuan"
                                                                                    invalid={
                                                                                        (detailErrors?.satuan &&
                                                                                            detailTouched?.satuan) as boolean
                                                                                    }
                                                                                    errorMessage={
                                                                                        detailErrors?.satuan
                                                                                    }
                                                                                >
                                                                                    <Field
                                                                                        type="text"
                                                                                        autoComplete="off"
                                                                                        name={`item[${itemIndex}].detail[${detailIndex}].satuan`}
                                                                                        placeholder="Satuan"
                                                                                        component={
                                                                                            Input
                                                                                        }
                                                                                    />
                                                                                </FormItem>
                                                                            </div>

                                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                                                                <FormItem
                                                                                    className="mb-0"
                                                                                    label="Volume"
                                                                                    invalid={
                                                                                        (detailErrors?.volume &&
                                                                                            detailTouched?.volume) as boolean
                                                                                    }
                                                                                    errorMessage={
                                                                                        detailErrors?.volume
                                                                                    }
                                                                                >
                                                                                    <Field
                                                                                        name={`item[${itemIndex}].detail[${detailIndex}].volume`}
                                                                                    >
                                                                                        {({
                                                                                            field,
                                                                                            form,
                                                                                        }: FieldProps) => (
                                                                                            <NumericFormat
                                                                                                {...field}
                                                                                                customInput={
                                                                                                    Input
                                                                                                }
                                                                                                placeholder="Volume"
                                                                                                thousandSeparator="."
                                                                                                decimalSeparator=","
                                                                                                onValueChange={(
                                                                                                    values
                                                                                                ) => {
                                                                                                    const volume =
                                                                                                        Number(
                                                                                                            values.value
                                                                                                        )
                                                                                                    form.setFieldValue(
                                                                                                        field.name,
                                                                                                        volume
                                                                                                    )

                                                                                                    // Get current harga_satuan values
                                                                                                    const hargaSatuanMaterial =
                                                                                                        form
                                                                                                            .values
                                                                                                            .item[
                                                                                                            itemIndex
                                                                                                        ]
                                                                                                            .detail[
                                                                                                            detailIndex
                                                                                                        ]
                                                                                                            .harga_satuan_material ||
                                                                                                        0
                                                                                                    const hargaSatuanJasa =
                                                                                                        form
                                                                                                            .values
                                                                                                            .item[
                                                                                                            itemIndex
                                                                                                        ]
                                                                                                            .detail[
                                                                                                            detailIndex
                                                                                                        ]
                                                                                                            .harga_satuan_jasa ||
                                                                                                        0

                                                                                                    // Calculate and update derived values
                                                                                                    const jumlahHargaMaterial =
                                                                                                        calculateJumlahHargaMaterial(
                                                                                                            volume,
                                                                                                            hargaSatuanMaterial
                                                                                                        )
                                                                                                    const jumlahHargaJasa =
                                                                                                        calculateJumlahHargaJasa(
                                                                                                            volume,
                                                                                                            hargaSatuanJasa
                                                                                                        )
                                                                                                    const jumlahTotal =
                                                                                                        calculateJumlahTotal(
                                                                                                            jumlahHargaMaterial,
                                                                                                            jumlahHargaJasa
                                                                                                        )

                                                                                                    form.setFieldValue(
                                                                                                        `item[${itemIndex}].detail[${detailIndex}].jumlah_harga_material`,
                                                                                                        jumlahHargaMaterial
                                                                                                    )
                                                                                                    form.setFieldValue(
                                                                                                        `item[${itemIndex}].detail[${detailIndex}].jumlah_harga_jasa`,
                                                                                                        jumlahHargaJasa
                                                                                                    )
                                                                                                    form.setFieldValue(
                                                                                                        `item[${itemIndex}].detail[${detailIndex}].jumlah`,
                                                                                                        jumlahTotal
                                                                                                    )
                                                                                                }}
                                                                                            />
                                                                                        )}
                                                                                    </Field>
                                                                                </FormItem>

                                                                                <FormItem
                                                                                    className="mb-0"
                                                                                    label="Harga Satuan Material"
                                                                                    invalid={
                                                                                        (detailErrors?.harga_satuan_material &&
                                                                                            detailTouched?.harga_satuan_material) as boolean
                                                                                    }
                                                                                    errorMessage={
                                                                                        detailErrors?.harga_satuan_material
                                                                                    }
                                                                                >
                                                                                    <Field
                                                                                        name={`item[${itemIndex}].detail[${detailIndex}].harga_satuan_material`}
                                                                                    >
                                                                                        {({
                                                                                            field,
                                                                                            form,
                                                                                        }: FieldProps) => (
                                                                                            <NumericFormat
                                                                                                {...field}
                                                                                                customInput={
                                                                                                    Input
                                                                                                }
                                                                                                placeholder="Harga satuan material"
                                                                                                thousandSeparator="."
                                                                                                decimalSeparator=","
                                                                                                onValueChange={(
                                                                                                    values
                                                                                                ) => {
                                                                                                    const hargaSatuanMaterial =
                                                                                                        Number(
                                                                                                            values.value
                                                                                                        )
                                                                                                    form.setFieldValue(
                                                                                                        field.name,
                                                                                                        hargaSatuanMaterial
                                                                                                    )

                                                                                                    // Get current volume value
                                                                                                    const volume =
                                                                                                        form
                                                                                                            .values
                                                                                                            .item[
                                                                                                            itemIndex
                                                                                                        ]
                                                                                                            .detail[
                                                                                                            detailIndex
                                                                                                        ]
                                                                                                            .volume ||
                                                                                                        0

                                                                                                    // Calculate and update derived values
                                                                                                    const jumlahHargaMaterial =
                                                                                                        calculateJumlahHargaMaterial(
                                                                                                            volume,
                                                                                                            hargaSatuanMaterial
                                                                                                        )
                                                                                                    const jumlahHargaJasa =
                                                                                                        form
                                                                                                            .values
                                                                                                            .item[
                                                                                                            itemIndex
                                                                                                        ]
                                                                                                            .detail[
                                                                                                            detailIndex
                                                                                                        ]
                                                                                                            .jumlah_harga_jasa ||
                                                                                                        0
                                                                                                    const jumlahTotal =
                                                                                                        calculateJumlahTotal(
                                                                                                            jumlahHargaMaterial,
                                                                                                            jumlahHargaJasa
                                                                                                        )

                                                                                                    form.setFieldValue(
                                                                                                        `item[${itemIndex}].detail[${detailIndex}].jumlah_harga_material`,
                                                                                                        jumlahHargaMaterial
                                                                                                    )
                                                                                                    form.setFieldValue(
                                                                                                        `item[${itemIndex}].detail[${detailIndex}].jumlah`,
                                                                                                        jumlahTotal
                                                                                                    )
                                                                                                }}
                                                                                            />
                                                                                        )}
                                                                                    </Field>
                                                                                </FormItem>

                                                                                <FormItem
                                                                                    className="mb-0"
                                                                                    label="Harga Satuan Jasa"
                                                                                    invalid={
                                                                                        (detailErrors?.harga_satuan_jasa &&
                                                                                            detailTouched?.harga_satuan_jasa) as boolean
                                                                                    }
                                                                                    errorMessage={
                                                                                        detailErrors?.harga_satuan_jasa
                                                                                    }
                                                                                >
                                                                                    <Field
                                                                                        name={`item[${itemIndex}].detail[${detailIndex}].harga_satuan_jasa`}
                                                                                    >
                                                                                        {({
                                                                                            field,
                                                                                            form,
                                                                                        }: FieldProps) => (
                                                                                            <NumericFormat
                                                                                                {...field}
                                                                                                customInput={
                                                                                                    Input
                                                                                                }
                                                                                                placeholder="Harga satuan jasa"
                                                                                                thousandSeparator="."
                                                                                                decimalSeparator=","
                                                                                                onValueChange={(
                                                                                                    values
                                                                                                ) => {
                                                                                                    const hargaSatuanJasa =
                                                                                                        Number(
                                                                                                            values.value
                                                                                                        )
                                                                                                    form.setFieldValue(
                                                                                                        field.name,
                                                                                                        hargaSatuanJasa
                                                                                                    )

                                                                                                    // Get current volume value
                                                                                                    const volume =
                                                                                                        form
                                                                                                            .values
                                                                                                            .item[
                                                                                                            itemIndex
                                                                                                        ]
                                                                                                            .detail[
                                                                                                            detailIndex
                                                                                                        ]
                                                                                                            .volume ||
                                                                                                        0

                                                                                                    // Calculate and update derived values
                                                                                                    const jumlahHargaJasa =
                                                                                                        calculateJumlahHargaJasa(
                                                                                                            volume,
                                                                                                            hargaSatuanJasa
                                                                                                        )
                                                                                                    const jumlahHargaMaterial =
                                                                                                        form
                                                                                                            .values
                                                                                                            .item[
                                                                                                            itemIndex
                                                                                                        ]
                                                                                                            .detail[
                                                                                                            detailIndex
                                                                                                        ]
                                                                                                            .jumlah_harga_material ||
                                                                                                        0
                                                                                                    const jumlahTotal =
                                                                                                        calculateJumlahTotal(
                                                                                                            jumlahHargaMaterial,
                                                                                                            jumlahHargaJasa
                                                                                                        )

                                                                                                    form.setFieldValue(
                                                                                                        `item[${itemIndex}].detail[${detailIndex}].jumlah_harga_jasa`,
                                                                                                        jumlahHargaJasa
                                                                                                    )
                                                                                                    form.setFieldValue(
                                                                                                        `item[${itemIndex}].detail[${detailIndex}].jumlah`,
                                                                                                        jumlahTotal
                                                                                                    )
                                                                                                }}
                                                                                            />
                                                                                        )}
                                                                                    </Field>
                                                                                </FormItem>
                                                                            </div>

                                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                                <FormItem
                                                                                    className="mb-0"
                                                                                    label="Jumlah Harga Material"
                                                                                    invalid={
                                                                                        (detailErrors?.jumlah_harga_material &&
                                                                                            detailTouched?.jumlah_harga_material) as boolean
                                                                                    }
                                                                                    errorMessage={
                                                                                        detailErrors?.jumlah_harga_material
                                                                                    }
                                                                                >
                                                                                    <Field
                                                                                        name={`item[${itemIndex}].detail[${detailIndex}].jumlah_harga_material`}
                                                                                    >
                                                                                        {({
                                                                                            field,
                                                                                        }: FieldProps) => (
                                                                                            <NumericFormat
                                                                                                {...field}
                                                                                                customInput={
                                                                                                    Input
                                                                                                }
                                                                                                placeholder="Jumlah harga material"
                                                                                                thousandSeparator="."
                                                                                                decimalSeparator=","
                                                                                                readOnly
                                                                                                disabled
                                                                                            />
                                                                                        )}
                                                                                    </Field>
                                                                                </FormItem>

                                                                                <FormItem
                                                                                    className="mb-0"
                                                                                    label="Jumlah Harga Jasa"
                                                                                    invalid={
                                                                                        (detailErrors?.jumlah_harga_jasa &&
                                                                                            detailTouched?.jumlah_harga_jasa) as boolean
                                                                                    }
                                                                                    errorMessage={
                                                                                        detailErrors?.jumlah_harga_jasa
                                                                                    }
                                                                                >
                                                                                    <Field
                                                                                        name={`item[${itemIndex}].detail[${detailIndex}].jumlah_harga_jasa`}
                                                                                    >
                                                                                        {({
                                                                                            field,
                                                                                        }: FieldProps) => (
                                                                                            <NumericFormat
                                                                                                {...field}
                                                                                                customInput={
                                                                                                    Input
                                                                                                }
                                                                                                placeholder="Jumlah harga jasa"
                                                                                                thousandSeparator="."
                                                                                                decimalSeparator=","
                                                                                                readOnly
                                                                                                disabled
                                                                                            />
                                                                                        )}
                                                                                    </Field>
                                                                                </FormItem>

                                                                                <FormItem
                                                                                    className="mb-0"
                                                                                    label="Jumlah Total"
                                                                                    invalid={
                                                                                        (detailErrors?.jumlah &&
                                                                                            detailTouched?.jumlah) as boolean
                                                                                    }
                                                                                    errorMessage={
                                                                                        detailErrors?.jumlah
                                                                                    }
                                                                                >
                                                                                    <Field
                                                                                        name={`item[${itemIndex}].detail[${detailIndex}].jumlah`}
                                                                                    >
                                                                                        {({
                                                                                            field,
                                                                                        }: FieldProps) => (
                                                                                            <NumericFormat
                                                                                                {...field}
                                                                                                customInput={
                                                                                                    Input
                                                                                                }
                                                                                                placeholder="Jumlah total"
                                                                                                thousandSeparator="."
                                                                                                decimalSeparator=","
                                                                                                readOnly
                                                                                                disabled
                                                                                            />
                                                                                        )}
                                                                                    </Field>
                                                                                </FormItem>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                }
                                                            )}

                                                            <Button
                                                                type="button"
                                                                variant="twoTone"
                                                                className="ml-4"
                                                                size="sm"
                                                                icon={
                                                                    <HiPlus />
                                                                }
                                                                onClick={() =>
                                                                    pushDetail({
                                                                        uraian: '',
                                                                        satuan: '',
                                                                        volume: 0,
                                                                        harga_satuan_material: 0,
                                                                        harga_satuan_jasa: 0,
                                                                        jumlah_harga_material: 0,
                                                                        jumlah_harga_jasa: 0,
                                                                        jumlah: 0,
                                                                    })
                                                                }
                                                            >
                                                                Tambah Detail
                                                            </Button>
                                                        </div>
                                                    )
                                                }}
                                            </FieldArray>
                                        </div>
                                    </div>
                                )
                            })}

                            <Button
                                type="button"
                                variant="twoTone"
                                icon={<HiPlus />}
                                onClick={() =>
                                    pushItem({
                                        item: '',
                                        detail: [
                                            {
                                                uraian: '',
                                                satuan: '',
                                                volume: 0,
                                                harga_satuan_material: 0,
                                                harga_satuan_jasa: 0,
                                                jumlah_harga_material: 0,
                                                jumlah_harga_jasa: 0,
                                                jumlah: 0,
                                            },
                                        ],
                                    })
                                }
                            >
                                Tambah Item
                            </Button>
                        </div>
                    )
                }}
            </FieldArray>
        </AdaptableCard>
    )
}

export default ItemFields

// [
//     {
//         "item": "asfasfasdgsagas",
//         "detail": [
//             {
//                 "uraian": "asfsafasfasf",
//                 "satuan": "kg",
//                 "volume": 10,
//                 "harga_satuan_material": 300000,
//                 "harga_satuan_jasa": 150000,
//                 "jumlah_harga_material": 3000000,
//                 "jumlah_harga_jasa": 1500000,
//                 "jumlah": 4500000
//             },
//             {
//                 "uraian": "asdasgasdgas",
//                 "satuan": "kg",
//                 "volume": 2222,
//                 "harga_satuan_material": 2222,
//                 "harga_satuan_jasa": 222,
//                 "jumlah_harga_material": 4937.284,
//                 "jumlah_harga_jasa": 493.284,
//                 "jumlah": 5430.567999999999
//             }
//         ]
//     },
//     {
//         "item": "asdgasgasgsd",
//         "detail": [
//             {
//                 "uraian": "asgsagas",
//                 "satuan": "asgas",
//                 "volume": 2222,
//                 "harga_satuan_material": 222,
//                 "harga_satuan_jasa": 222,
//                 "jumlah_harga_material": 493.284,
//                 "jumlah_harga_jasa": 493.284,
//                 "jumlah": 986.568
//             }
//         ]
//     }
// ]
