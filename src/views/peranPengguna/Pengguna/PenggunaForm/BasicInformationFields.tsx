import AdaptableCard from '@/components/shared/AdaptableCard'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Field, FieldProps, FormikErrors, FormikTouched } from 'formik'
import { Select } from '@/components/ui'
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi'
import { useState } from 'react'

type FormFieldsName = {
    nama: string
    email: string
    nomor_telepon: string
    password: string
    idRole: string
}

type BasicInformationFields = {
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
    type: 'new' | 'edit'
    roleData: any[]
}

const BasicInformationFields = (props: BasicInformationFields) => {
    const { touched, errors, type, roleData } = props

    const [pwInputType, setPwInputType] = useState('password')

    const onPasswordVisibleClick = (e: MouseEvent) => {
        e.preventDefault()
        setPwInputType(pwInputType === 'password' ? 'text' : 'password')
    }

    const inputIcon = (
        <span
            className="cursor-pointer"
            onClick={(e) => onPasswordVisibleClick(e)}
        >
            {pwInputType === 'password' ? (
                <HiOutlineEyeOff />
            ) : (
                <HiOutlineEye />
            )}
        </span>
    )

    return (
        <AdaptableCard divider className="mb-4">
            <h5>Informasi Dasar</h5>
            <p className="mb-6">Sesi untuk mengatur informasi dasar pengguna</p>
            <FormItem
                label="Pengguna"
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
                label="Email"
                invalid={(errors.email && touched.email) as boolean}
                errorMessage={errors.email}
            >
                <Field
                    type="mail"
                    autoComplete="off"
                    name="email"
                    placeholder="Email"
                    component={Input}
                />
            </FormItem>
            <FormItem
                label="Nomor Telepon"
                invalid={
                    (errors.nomor_telepon && touched.nomor_telepon) as boolean
                }
                errorMessage={errors.nomor_telepon}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="nomor_telepon"
                    placeholder="08xxxxxxxxxx"
                    component={Input}
                />
            </FormItem>
            {type === 'new' && (
                <>
                    <FormItem
                        label="Password"
                        invalid={
                            (errors.password && touched.password) as boolean
                        }
                        errorMessage={errors.password}
                    >
                        <Field
                            autoComplete="off"
                            name="password"
                            suffix={inputIcon}
                            type={pwInputType}
                            placeholder="password"
                            component={Input}
                        />
                    </FormItem>
                    <FormItem
                        label="Role"
                        invalid={(errors.idRole && touched.idRole) as boolean}
                        errorMessage={errors.idRole}
                    >
                        <Field name="idRole">
                            {({ field, form }: FieldProps) => (
                                <Select
                                    options={roleData?.map((role) => ({
                                        label: role.nama,
                                        value: role.id,
                                    }))}
                                    value={roleData
                                        ?.map((role) => ({
                                            label: role.nama,
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
                </>
            )}
        </AdaptableCard>
    )
}

export default BasicInformationFields
