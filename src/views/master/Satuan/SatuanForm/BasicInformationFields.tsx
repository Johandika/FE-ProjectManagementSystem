import AdaptableCard from '@/components/shared/AdaptableCard'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Field, FormikErrors, FormikTouched } from 'formik'

type FormFieldsName = {
    satuan: string
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
            <p className="mb-6">Sesi untuk mengatur informasi dasar satuan</p>
            <FormItem
                label="Satuan"
                invalid={(errors.satuan && touched.satuan) as boolean}
                errorMessage={errors.satuan}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="satuan"
                    placeholder="Satuan"
                    component={Input}
                />
            </FormItem>
        </AdaptableCard>
    )
}

export default BasicInformationFields
