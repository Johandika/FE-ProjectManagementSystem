import { useState, useRef, forwardRef, useEffect, useMemo } from 'react'
import { HiOutlineFilter } from 'react-icons/hi'
import {
    setFilterData,
    useAppDispatch,
    useAppSelector,
    getKliens,
} from '../store'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import Radio from '@/components/ui/Radio'
import Drawer from '@/components/ui/Drawer'
import { Field, Form, Formik, FormikProps, FieldProps } from 'formik'
import type { MouseEvent } from 'react'
import { Select } from '@/components/ui'
import { getSelectDivisi } from '@/store'

type FormModel = {
    order: string
    progress: number
}

type FilterFormProps = {
    onSubmitComplete?: () => void
}

type DrawerFooterProps = {
    onSaveClick: (event: MouseEvent<HTMLButtonElement>) => void
    onCancel: (event: MouseEvent<HTMLButtonElement>) => void
    onReset: (event: MouseEvent<HTMLButtonElement>) => void
}

const FilterForm = forwardRef<FormikProps<FormModel>, FilterFormProps>(
    ({ onSubmitComplete }, ref) => {
        const dispatch = useAppDispatch()

        const { selectDivisi, loadingSelectDivisi } = useAppSelector(
            (state) => state.base.common
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

        const kliensList = useAppSelector(
            (state) => state.proyekList.data.kliensList
        )

        const filterData = useAppSelector(
            (state) => state.proyekList.data.filterData
        )

        const handleSubmit = (values: FormModel) => {
            onSubmitComplete?.()
            dispatch(setFilterData(values))
            // dispatch(getProyeks(initialTableData))
        }

        const clientOptions = useMemo(() => {
            if (!kliensList) {
                return []
            }
            return kliensList.map((client) => ({
                value: client.id,
                label: client.nama,
            }))
        }, [kliensList])

        useEffect(() => {
            dispatch(getKliens()) // kliens
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
                            {/* Pilih klien */}
                            <FormItem
                                label="Klien"
                                invalid={
                                    (errors.idClient &&
                                        touched.idClient) as boolean
                                }
                                errorMessage={errors.idClient}
                            >
                                <Field name="idClient">
                                    {({ field, form }: FieldProps) => {
                                        const selectedValues = (
                                            field.value || ''
                                        )
                                            .split(',')
                                            .filter(Boolean)
                                        const selectedOptions = (
                                            clientOptions || []
                                        ).filter((option) =>
                                            selectedValues.includes(
                                                option.value
                                            )
                                        )

                                        return (
                                            <Select
                                                isMulti // Tambahkan prop isMulti
                                                options={clientOptions}
                                                value={selectedOptions}
                                                placeholder="Pilih klien"
                                                onChange={(selected) => {
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

                            {/* Progress */}
                            <FormItem
                                invalid={errors.progress && touched.progress}
                                errorMessage={errors.progress}
                            >
                                <h6 className="mb-4">Progress</h6>
                                <Field name="progress">
                                    {({ field, form }: FieldProps) => (
                                        <Radio.Group
                                            vertical
                                            value={values.progress}
                                            onChange={(val) => {
                                                form.setFieldValue(
                                                    field.name,
                                                    val
                                                )
                                            }}
                                            className="inline space-x-4 sm:space-x-6"
                                        >
                                            <Radio value={30}>30</Radio>
                                            <Radio value={50}>50</Radio>
                                            <Radio value={95}>95</Radio>
                                            <Radio value={100}>100</Radio>
                                        </Radio.Group>
                                    )}
                                </Field>
                            </FormItem>

                            {/* Urutan asc desc */}
                            <FormItem
                                invalid={errors.order && touched.order}
                                errorMessage={errors.order}
                            >
                                <h6 className="mb-4">Urutkan</h6>
                                <Field name="order">
                                    {({ field, form }: FieldProps) => (
                                        <Radio.Group
                                            vertical
                                            value={values.order}
                                            onChange={(val) => {
                                                form.setFieldValue(
                                                    field.name,
                                                    val
                                                )
                                            }}
                                        >
                                            <Radio value={'asc'}>
                                                Ascending
                                            </Radio>
                                            <Radio value={'desc'}>
                                                Descending
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
            {/* inidia */}
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

const ProyekFilter = () => {
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

    const onReset = () => {
        // Reset form Formik ke nilai awal
        formikRef.current?.resetForm()

        // Buat data filter awal untuk Redux store
        const initialFilterData = {
            idClient: '',
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

export default ProyekFilter
