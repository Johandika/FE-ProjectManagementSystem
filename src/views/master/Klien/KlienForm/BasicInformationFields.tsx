import AdaptableCard from '@/components/shared/AdaptableCard'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Field, FieldProps, FormikErrors, FormikTouched } from 'formik'
import { Select } from '@/components/ui'

type FormFieldsName = {
    nama: string
    keterangan: string
    idDivisi: string
}

type BasicInformationFields = {
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
    divisiData: any[]
}

const BasicInformationFields = (props: BasicInformationFields) => {
    const { touched, errors, divisiData } = props

    return (
        <AdaptableCard divider className="mb-4">
            <h5>Informasi Dasar</h5>
            <p className="mb-6">Sesi untuk mengatur informasi dasar klien</p>
            <FormItem
                label="Nama klien"
                invalid={(errors.nama && touched.nama) as boolean}
                errorMessage={errors.nama}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="nama"
                    placeholder="Nama"
                    component={Input}
                />
            </FormItem>
            <FormItem
                label="Divisi"
                invalid={(errors.idDivisi && touched.idDivisi) as boolean}
                errorMessage={errors.idDivisi}
            >
                <Field name="idDivisi">
                    {({ field, form }: FieldProps) => (
                        <Select
                            placeholder="Pilih divisi"
                            options={divisiData?.map((role) => ({
                                label: role.name,
                                value: role.id,
                            }))}
                            value={divisiData
                                ?.map((role) => ({
                                    label: role.name,
                                    value: role.id,
                                }))
                                .find((opt) => opt.value === field.value)}
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
