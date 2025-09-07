import { useState, useRef, forwardRef, useEffect, useMemo } from 'react'
import { HiOutlineFilter } from 'react-icons/hi'
import {
    getPenggunas,
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
import { getSelectDivisi } from '@/store'

type FormModel = {
    name: string
    category: string[]
    status: number[]
    penggunaStatus: number
    idDivisi: string
}

type FilterFormProps = {
    onSubmitComplete?: () => void
}

type DrawerFooterProps = {
    onSaveClick: (event: MouseEvent<HTMLButtonElement>) => void
    onCancel: (event: MouseEvent<HTMLButtonElement>) => void
    onReset: (event: MouseEvent<HTMLButtonElement>) => void // inidia
}

const FilterForm = forwardRef<FormikProps<FormModel>, FilterFormProps>(
    ({ onSubmitComplete }, ref) => {
        const dispatch = useAppDispatch()

        const { selectDivisi, loadingSelectDivisi } = useAppSelector(
            (state) => state.base.common
        )

        const filterData = useAppSelector(
            (state) => state.penggunaList.data.filterData
        )

        const handleSubmit = (values: FormModel) => {
            onSubmitComplete?.()

            dispatch(setFilterData(values))
            // dispatch(getPenggunas(initialTableData))
        }

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
                                label="Divisi"
                                invalid={
                                    (errors.idDivisi &&
                                        touched.idDivisi) as boolean
                                }
                                errorMessage={errors.idDivisi}
                            >
                                <Field name="idDivisi">
                                    {({ field, form }: FieldProps) => {
                                        // PERBAIKAN: Pisahkan string ke array untuk ditampilkan
                                        const selectedValues = (
                                            field.value || ''
                                        )
                                            .split(',')
                                            .filter(Boolean)
                                        const selectedOptions = (
                                            divisiOptions || []
                                        ).filter((option) =>
                                            selectedValues.includes(
                                                option.value
                                            )
                                        )

                                        return (
                                            <Select
                                                isMulti
                                                options={divisiOptions}
                                                isLoading={loadingSelectDivisi}
                                                value={selectedOptions}
                                                placeholder="Pilih divisi"
                                                onChange={(selected) => {
                                                    // PERBAIKAN: Ubah array yang dipilih menjadi string yang dipisah koma
                                                    const values = selected
                                                        ? selected.map(
                                                              (option) =>
                                                                  option.value
                                                          )
                                                        : []
                                                    form.setFieldValue(
                                                        field.name,
                                                        values.join(',')
                                                    )
                                                }}
                                            />
                                        )
                                    }}
                                </Field>
                            </FormItem>

                            {/* Filter Status */}
                            <FormItem
                                invalid={
                                    errors.penggunaStatus &&
                                    touched.penggunaStatus
                                }
                                errorMessage={errors.penggunaStatus}
                            >
                                <h6 className="mb-4">Pengguna Status</h6>
                                <Field name="penggunaStatus">
                                    {({ field, form }: FieldProps) => (
                                        <Radio.Group
                                            vertical
                                            value={values.penggunaStatus}
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

const DrawerFooter = ({
    onSaveClick,
    onCancel,
    onReset,
}: DrawerFooterProps) => {
    return (
        <div className="text-right w-full flex flex-row justify-between">
            <Button size="sm" className="mr-2" onClick={onReset}>
                Reset
            </Button>
            <div>
                <Button size="sm" className="mr-2" onClick={onCancel}>
                    Cancel
                </Button>
                <Button size="sm" variant="solid" onClick={onSaveClick}>
                    Terapkan
                </Button>
            </div>
        </div>
    )
}

const PenggunaFilter = () => {
    const formikRef = useRef<FormikProps<FormModel>>(null)
    const dispatch = useAppDispatch()
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

    // inidia
    const onReset = () => {
        // Reset form Formik ke nilai awal
        formikRef.current?.resetForm()

        const initialFilterData = {
            type: '',
            idDivisi: '',
        }

        // Perbarui Redux store dengan data filter awal
        dispatch(setFilterData(initialFilterData))

        // Tutup drawer setelah reset
        onDrawerClose()
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
                        onReset={onReset} //inidia
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

export default PenggunaFilter
