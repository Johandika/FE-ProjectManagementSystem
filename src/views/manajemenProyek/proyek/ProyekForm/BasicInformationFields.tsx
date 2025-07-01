import AdaptableCard from '@/components/shared/AdaptableCard'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Field, FieldProps, FormikErrors, FormikTouched } from 'formik'
import { NumericFormat } from 'react-number-format'
import { Checkbox, DatePicker, Select } from '@/components/ui'
import dayjs from 'dayjs'
import reducer from '@/views/master/Satuan/SatuanList/store'
import { useEffect, useState } from 'react'
import { getSelectClient, useAppDispatch, useAppSelector } from '@/store'

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
    uang_muka: number
    idDivisi: string
    nomor_kontrak: string
    tanggal_service_po: string
    tanggal_kontrak: string
    tanggal_delivery: string
    nilai_kontrak: number
    persen_retensi: number
    timeline_awal: string
    timeline_akhir: string
    jatuh_tempo_retensi: string
    keterangan: string
    idClient: string
    is_retensi: boolean
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
    initialData?: any[]
    dataDivisi?: any[]
}

const BasicInformationFields = (props: BasicInformationFields) => {
    const { touched, errors, type, initialData = {}, dataDivisi } = props
    const dispatch = useAppDispatch()
    const [checkRetensi, setCheckRetensi] = useState(false)
    const [disabledState, setDisabledState] = useState(false)

    const { selectClient, loadingSelectClient } = useAppSelector(
        (state) => state.base.common
    )

    const onCheck = (value: boolean, form: any) => {
        form.setFieldValue('is_retensi', value)

        // Reset field retensi jika unchecked
        if (!value) {
            form.setFieldValue('persen_retensi', 0)
            form.setFieldValue('jatuh_tempo_retensi', null)
        }
    }

    useEffect(() => {
        if (initialData?.idClient?.length > 5) {
            setDisabledState(true)
        }
    }, [initialData])

    useEffect(() => {
        dispatch(getSelectClient())
    }, [])

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
                    disabled={disabledState}
                />
            </FormItem>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4">
                {/* Client Select Field */}
                {/* anchor */}
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
                                // Gunakan `selectClient` bukan `kliensList`
                                const clientOptions = selectClient.data?.map(
                                    (client) => ({
                                        value: client.id,
                                        label: client.nama,
                                    })
                                )

                                const selectedValue = clientOptions?.find(
                                    (option) => option.value === field.value
                                )

                                return (
                                    <Select
                                        field={field}
                                        form={form}
                                        isDisabled={disabledState}
                                        // Tambahkan isLoading untuk UX yang lebih baik
                                        isLoading={loadingSelectClient}
                                        options={clientOptions}
                                        value={selectedValue}
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
                                    disabled={disabledState}
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
                {type === 'new' && (
                    <>
                        {/* Timeline Awal  */}
                        <div className="col-span-2 md:col-span-1">
                            <FormItem
                                label="Timeline Awal"
                                invalid={
                                    (errors.timeline_awal &&
                                        touched.timeline_awal) as boolean
                                }
                                errorMessage={errors.timeline_awal}
                            >
                                <Field name="timeline_awal">
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
                                                    ? dayjs(date).format(
                                                          'YYYY-MM-DD'
                                                      )
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
                        {/* Timeline Akhir  */}
                        <div className="col-span-2 md:col-span-1">
                            <FormItem
                                label="Timeline Akhir"
                                invalid={
                                    (errors.timeline_akhir &&
                                        touched.timeline_akhir) as boolean
                                }
                                errorMessage={errors.timeline_akhir}
                            >
                                <Field name="timeline_akhir">
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
                                                    ? dayjs(date).format(
                                                          'YYYY-MM-DD'
                                                      )
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
                    </>
                )}

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
                            style={{ textTransform: 'uppercase' }}
                        />
                    </FormItem>
                </div>

                {/* Uang Muka */}
                {type === 'new' && (
                    <>
                        <div className="col-span-2 md:col-span-1">
                            <FormItem
                                label="Uang Muka"
                                invalid={
                                    (errors.uang_muka &&
                                        touched.uang_muka) as boolean
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
                        </div>
                    </>
                )}

                <div className="col-span-2 md:col-span-1">
                    {/* Pilih Divisi */}
                    <FormItem
                        label="Divisi"
                        invalid={
                            (errors.idDivisi && touched.idDivisi) as boolean
                        }
                        errorMessage={errors.idDivisi}
                    >
                        <Field name="idDivisi">
                            {({ field, form }: FieldProps) => (
                                <Select
                                    placeholder="Pilih divisi"
                                    isDisabled={disabledState}
                                    options={dataDivisi?.map((role) => ({
                                        label: role.name,
                                        value: role.id,
                                    }))}
                                    value={dataDivisi
                                        ?.map((role) => ({
                                            label: role.name,
                                            value: role.id,
                                        }))
                                        .find(
                                            (opt) => opt.value === field.value
                                        )}
                                    onChange={(selected) => {
                                        form.setFieldValue(
                                            field.name,
                                            selected?.value || ''
                                        )
                                    }}
                                />
                            )}
                        </Field>
                    </FormItem>
                </div>

                {type === 'new' && (
                    <>
                        <div className="col-span-2 ">
                            <Field name="is_retensi">
                                {({ form }: FieldProps) => (
                                    <Checkbox
                                        checked={checkRetensi}
                                        onChange={(checked) =>
                                            onCheck(checked, form)
                                        }
                                    >
                                        Retensi
                                    </Checkbox>
                                )}
                            </Field>
                        </div>
                        {checkRetensi && (
                            <>
                                <div className="col-span-2 md:col-span-1">
                                    <FormItem
                                        label="Persen Retensi (%)"
                                        invalid={
                                            (errors.persen_retensi &&
                                                touched.persen_retensi) as boolean
                                        }
                                        errorMessage={errors.persen_retensi}
                                    >
                                        <Field name="persen_retensi">
                                            {({ field, form }: FieldProps) => (
                                                <NumericFormat
                                                    {...field}
                                                    customInput={Input}
                                                    placeholder="0"
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
                                <div className="col-span-2 md:col-span-1">
                                    <FormItem
                                        label="Jatuh Tempo Retensi"
                                        invalid={
                                            (errors.jatuh_tempo_retensi &&
                                                touched.jatuh_tempo_retensi) as boolean
                                        }
                                        errorMessage={
                                            errors.jatuh_tempo_retensi
                                        }
                                    >
                                        <Field name="jatuh_tempo_retensi">
                                            {({ field, form }: FieldProps) => (
                                                <DatePicker
                                                    placeholder="Pilih Tanggal"
                                                    value={
                                                        field.value
                                                            ? new Date(
                                                                  field.value
                                                              )
                                                            : null
                                                    }
                                                    inputFormat="DD-MM-YYYY"
                                                    onChange={(date) => {
                                                        const formattedDate =
                                                            date
                                                                ? dayjs(
                                                                      date
                                                                  ).format(
                                                                      'YYYY-MM-DD'
                                                                  )
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
                            </>
                        )}
                    </>
                )}

                {/* Keterangan */}
                <div className="col-span-2">
                    <FormItem
                        label="Keterangan"
                        labelClass="!justify-start"
                        invalid={
                            (errors.keterangan && touched.keterangan) as boolean
                        }
                        errorMessage={errors.keterangan}
                    >
                        <Field
                            textArea
                            name="keterangan"
                            placeholder="Masukkan keterangan"
                            component={Input}
                        />
                    </FormItem>
                </div>
            </div>
        </AdaptableCard>
    )
}

export default BasicInformationFields
