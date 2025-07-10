import { useState, useRef, forwardRef, useMemo, useEffect } from 'react'
import { HiOutlineFilter } from 'react-icons/hi'
import {
    getKliens,
    setFilterData,
    initialTableData,
    useAppDispatch,
    useAppSelector,
} from '../store'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import { Field, Form, Formik, FormikProps, FieldProps } from 'formik'
import type { MouseEvent } from 'react'
import { Radio, Select } from '@/components/ui'
import { getSelectDivisi, RootState } from '@/store'

type FormModel = {
    name: string
    category: string[]
    status: number[]
    productStatus: number
    idDivisi: string
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

        const { selectDivisi, loadingSelectDivisi } = useAppSelector(
            (state: RootState) => state.base.common
        )

        const filterData = useAppSelector(
            (state) => state.klienList.data.filterData
        )

        const divisiOptions = useMemo(() => {
            if (!selectDivisi?.data) {
                return []
            }
            return selectDivisi.data.map(
                (divisi: { id: string; name: string }) => ({
                    value: divisi.id,
                    label: divisi.name,
                })
            )
        }, [selectDivisi])

        const handleSubmit = (values: FormModel) => {
            onSubmitComplete?.()
            dispatch(setFilterData(values))
            // dispatch(getKliens(initialTableData))
        }

        useEffect(() => {
            dispatch(getSelectDivisi())
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
                            {/* Filter Divisi */}
                            <FormItem
                                label="Klien"
                                invalid={errors.idDivisi && touched.idDivisi}
                                errorMessage={errors.idDivisi}
                            >
                                <Field name="idDivisi">
                                    {({ field, form }: FieldProps) => {
                                        const selectedDivisi = field.value
                                            ? divisiOptions.find(
                                                  (divisi: any) =>
                                                      divisi.value ===
                                                      field.value
                                              )
                                            : null

                                        return (
                                            <Select
                                                field={field}
                                                form={form}
                                                options={divisiOptions}
                                                isLoading={loadingSelectDivisi}
                                                value={
                                                    selectedDivisi
                                                        ? selectedDivisi
                                                        : null
                                                }
                                                placeholder="Pilih divisi"
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
                            {/* Filter Active Inactive */}
                            <FormItem
                                invalid={
                                    errors.klienStatus && touched.klienStatus
                                }
                                errorMessage={errors.klienStatus}
                            >
                                <h6 className="mb-4">Klien Status</h6>
                                <Field name="klienStatus">
                                    {({ field, form }: FieldProps) => (
                                        <Radio.Group
                                            vertical
                                            value={values.klienStatus}
                                            onChange={(val) => {
                                                form.setFieldValue(
                                                    field.name,
                                                    val
                                                )
                                            }}
                                        >
                                            <Radio value={'active'}>
                                                Active
                                            </Radio>
                                            <Radio value={'inactive'}>
                                                Inactive
                                            </Radio>
                                        </Radio.Group>
                                    )}
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

const KlienFilter = () => {
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

export default KlienFilter
