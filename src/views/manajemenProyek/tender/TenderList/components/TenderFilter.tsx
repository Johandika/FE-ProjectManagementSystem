import { useState, useRef, forwardRef, useEffect, useMemo } from 'react'
import { HiOutlineFilter } from 'react-icons/hi'
import { setFilterData, useAppDispatch, useAppSelector } from '../store'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import Radio from '@/components/ui/Radio'
import Drawer from '@/components/ui/Drawer'
import { Field, Form, Formik, FormikProps, FieldProps } from 'formik'
import type { MouseEvent } from 'react'
import { getSelectClient, getSelectDivisi } from '@/store'
import { Select } from '@/components/ui'

type FormModel = {
    status: string
    idDivisi: string
    filteruser: string
    idClient: string
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

        const {
            selectDivisi,
            selectClient,
            loadingSelectDivisi,
            loadingSelectClient,
        } = useAppSelector((state) => state.base.common)

        const filterData = useAppSelector(
            (state) => state.tenderList.data.filterData
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
            // dispatch(getTenders(initialTableData))
        }

        // PERBAIKAN: Memformat data klien untuk Select
        const clientOptions = useMemo(() => {
            if (!selectClient?.data) {
                return []
            }
            return selectClient.data.map(
                (client: { id: string; nama: string }) => ({
                    value: client.id,
                    label: client.nama,
                })
            )
        }, [selectClient])

        useEffect(() => {
            dispatch(getSelectDivisi())
            dispatch(getSelectClient())
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
                            {/* Tender Status */}
                            <FormItem
                                invalid={errors.status && touched.status}
                                errorMessage={errors.status}
                            >
                                <h6 className="mb-4">Tender Status</h6>
                                <Field name="status">
                                    {({ field, form }: FieldProps) => (
                                        <Radio.Group
                                            vertical
                                            value={values.status}
                                            onChange={(val) =>
                                                form.setFieldValue(
                                                    field.name,
                                                    val
                                                )
                                            }
                                        >
                                            <Radio value={'Pengajuan'}>
                                                Pengajuan
                                            </Radio>
                                            <Radio value={'Diterima'}>
                                                Menang
                                            </Radio>
                                            <Radio value={'Ditolak'}>
                                                Kalah
                                            </Radio>
                                            <Radio value={'Diproses'}>
                                                Diproses
                                            </Radio>
                                            <Radio value={'Batal'}>Batal</Radio>
                                        </Radio.Group>
                                    )}
                                </Field>
                            </FormItem>

                            {/* Filter Klien multi-select */}
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
                                                isMulti
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

                            {/* Urutan asc desc */}
                            <FormItem
                                invalid={
                                    errors.filteruser && touched.filteruser
                                }
                                errorMessage={errors.filteruser}
                            >
                                <h6 className="mb-4">Urutkan Dibuat Oleh</h6>
                                <Field name="filteruser">
                                    {({ field, form }: FieldProps) => (
                                        <Radio.Group
                                            vertical
                                            value={values.filteruser}
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

// ini dia
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

const TenderFilter = () => {
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

        // Buat data filter awal untuk Redux store
        const initialFilterData = {
            idClient: '',
            idDivisi: '',
            status: '',
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

export default TenderFilter
