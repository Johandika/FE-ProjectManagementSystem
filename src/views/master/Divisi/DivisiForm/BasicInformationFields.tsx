import AdaptableCard from '@/components/shared/AdaptableCard'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Field, FormikErrors, FormikTouched } from 'formik'

type FormFieldsName = {
    name: string
    keterangan: string
}

type BasicInformationFields = {
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
}

const BasicInformationFields = (props: BasicInformationFields) => {
    const { touched, errors } = props

    return (
        <AdaptableCard divider className="mb-4">
            <h5>Informasi Dasar</h5>
            <p className="mb-6">
                Sesi untuk mengatur informasi dasar divisi Tagihan
            </p>
            <FormItem
                label="Nama divisi"
                invalid={(errors.name && touched.name) as boolean}
                errorMessage={errors.name}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="name"
                    placeholder="Nama divisi"
                    component={Input}
                />
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
