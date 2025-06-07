import { useState, useRef, forwardRef, useEffect } from 'react'
import { HiOutlineFilter } from 'react-icons/hi'
import {
    getLogs,
    setFilterData,
    initialTableData,
    useAppDispatch,
    useAppSelector,
    getPenggunas,
} from '../store'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import { Field, Form, Formik, FormikProps, FieldProps } from 'formik'
import type { MouseEvent } from 'react'
import { Select } from '@/components/ui'

type FormModel = {
    name: string
    category: string[]
    status: number[]
    productStatus: number
}

type FilterFormProps = {
    onSubmitComplete?: () => void
}

type DrawerFooterProps = {
    onSaveClick: (event: MouseEvent<HTMLButtonElement>) => void
    onCancel: (event: MouseEvent<HTMLButtonElement>) => void
}

const FilterForm = forwardRef<FormikProps<FormModel>, FilterFormProps>(
    ({ onSubmitComplete }, ref) => {
        const dispatch = useAppDispatch()

        const filterData = useAppSelector(
            (state) => state.logList.data.filterData
        )

        const penggunaList = useAppSelector(
            (state) => state.logList.data.penggunaList.data
        )

        // Ref untuk Formik
        const formikRef = useRef<FormikProps<FormModel>>(null)

        const handleSubmit = (values: FormModel) => {
            onSubmitComplete?.()
            dispatch(setFilterData(values))
            // dispatch(getLogs(initialTableData))
        }

        // useEffect untuk memastikan Formik menerima update dari filterData
        useEffect(() => {
            // Pastikan formikRef mendapatkan nilai terbaru dari filterData
            formikRef.current?.setValues(filterData)
        }, [filterData]) // Trigger useEffect ketika filterData berubah

        useEffect(() => {
            dispatch(getPenggunas())
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])

        return (
            <Formik
                enableReinitialize
                innerRef={ref}
                initialValues={filterData}
                onSubmit={(values) => {
                    handleSubmit(values)
                }}
            >
                {({ values, touched, errors }) => (
                    <Form>
                        <FormContainer>
                            {/* Select client */}
                            <FormItem
                                label="Klien"
                                invalid={errors.idUser && touched.idUser}
                                errorMessage={errors.idUser}
                            >
                                <Field name="idUser">
                                    {({ field, form }: FieldProps) => {
                                        // Find the selected client based on current idUser value
                                        const selectedClient = field.value
                                            ? penggunaList.find(
                                                  (client) =>
                                                      client.id === field.value
                                              )
                                            : null

                                        // Map clients to options format required by Select component
                                        const clientOptions =
                                            penggunaList?.map((client) => ({
                                                value: client.id,
                                                label: `${client.nama}`,
                                            })) || null

                                        return (
                                            <Select
                                                field={field}
                                                form={form}
                                                options={clientOptions}
                                                value={
                                                    selectedClient
                                                        ? {
                                                              value: selectedClient.nama,
                                                              label: `${selectedClient.nama}`,
                                                          }
                                                        : null
                                                }
                                                placeholder="Pilih user"
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
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        )
    }
)

const DrawerFooter = ({ onSaveClick, onCancel }: DrawerFooterProps) => {
    return (
        <div className="text-right w-full">
            <Button size="sm" className="mr-2" onClick={onCancel}>
                Cancel
            </Button>
            <Button size="sm" variant="solid" onClick={onSaveClick}>
                Terapkan
            </Button>
        </div>
    )
}

const LogFilter = () => {
    const formikRef = useRef<FormikProps<FormModel>>(null)

    const [isOpen, setIsOpen] = useState(false)

    const openDrawer = () => {
        setIsOpen(true)
    }

    const onDrawerClose = () => {
        setIsOpen(false)
    }

    const formSubmit = () => {
        formikRef.current?.submitForm()
    }

    return (
        <>
            <Button
                size="sm"
                className="block md:inline-block ltr:md:ml-2 rtl:md:mr-2 md:mb-0 mb-4"
                icon={<HiOutlineFilter />}
                onClick={() => openDrawer()}
            >
                Filter
            </Button>
            <Drawer
                title="Filter"
                isOpen={isOpen}
                footer={
                    <DrawerFooter
                        onCancel={onDrawerClose}
                        onSaveClick={formSubmit}
                    />
                }
                onClose={onDrawerClose}
                onRequestClose={onDrawerClose}
            >
                <FilterForm ref={formikRef} onSubmitComplete={onDrawerClose} />
            </Drawer>
        </>
    )
}

FilterForm.displayName = 'FilterForm'

export default LogFilter
