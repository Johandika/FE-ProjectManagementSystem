import { useEffect, useState, useRef, useMemo } from 'react'

import { Button, DatePicker, FormItem, Drawer, Select } from '@/components/ui'
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik'
import * as Yup from 'yup'

import BasicBarVertical from '@/components/custom/BasicBarVertical'
import Holding from '@/components/custom/Holding'
import SimplePie from '@/components/custom/SimplePie'
import { Loading } from '@/components/shared'
import {
    getDashboard,
    getSelectClient,
    getSelectDivisi,
    RootState, // Pastikan ini di-dispatch untuk mendapatkan data klien
    useAppDispatch,
    useAppSelector,
} from '@/store'
import dayjs from 'dayjs'
import { HiOutlineFilter } from 'react-icons/hi'
import TableDataProyekDashboard from '@/components/custom/TableDataProyekDashboard'

const BastpSchema = Yup.object().shape({
    tanggal_awal: Yup.string().required('Wajib diisi'),
    tanggal_akhir: Yup.string().required('Wajib diisi'),
    idClient: Yup.string().nullable(),
    idDivisi: Yup.string().nullable(),
})

interface FilterFormValues {
    tanggal_awal: string
    tanggal_akhir: string
    idClient: string
    idDivisi: string
}

const Dashboard = () => {
    const dispatch = useAppDispatch()
    const {
        dataDashboard,
        loadingDashboard,
        selectClient,
        selectDivisi,
        loadingSelectClient,
        loadingSelectDivisi,
    } = useAppSelector((state: RootState) => state.base.common)

    const formikRef = useRef<FormikProps<FilterFormValues>>(null)
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    const defaultStartDate = dayjs().startOf('year').format('YYYY-MM-DD')
    const defaultEndDate = dayjs().endOf('year').format('YYYY-MM-DD')

    // Buat state untuk menyimpan filter yang aktif ##
    const [activeFilters, setActiveFilters] = useState({
        tanggal_awal: defaultStartDate,
        tanggal_akhir: defaultEndDate,
        idClient: '',
        idDivisi: '',
    })

    const dataAwal = dataDashboard?.data

    const clientOptions = useMemo(() => {
        // Akses data dengan aman menggunakan optional chaining (?.) dan beri nilai default array kosong.
        if (!selectClient?.data) {
            return []
        }
        return selectClient.data.map(
            (client: { id: string; nama: string }) => ({
                value: client.id,
                label: client.nama,
            })
        )
    }, [selectClient]) // Dependensi: hanya kalkulasi ulang saat `selectClient` berubah.

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

    const handleFilter = (values: FilterFormValues) => {
        const params: {
            tanggal_awal: string
            tanggal_akhir: string
            idClient?: string
            idDivisi?: string
        } = {
            tanggal_awal: values.tanggal_awal,
            tanggal_akhir: values.tanggal_akhir,
        }

        if (values.idClient) {
            params.idClient = values.idClient
        }

        if (values.idDivisi) {
            params.idDivisi = values.idDivisi
        }

        dispatch(getDashboard(params))
        setActiveFilters(values) // Simpan filter yang baru disubmit
        setIsFilterOpen(false)
    }

    const fetchInitialData = () => {
        // Panggil data dashboard dengan filter awal
        dispatch(
            getDashboard({
                tanggal_awal: activeFilters.tanggal_awal, // Gunakan state filter
                tanggal_akhir: activeFilters.tanggal_akhir, // Gunakan state filter
            })
        )
        // Panggil data untuk select klien
        dispatch(getSelectClient())
        dispatch(getSelectDivisi())
    }

    useEffect(() => {
        fetchInitialData()
    }, [])

    const openFilterDrawer = () => setIsFilterOpen(true)
    const closeFilterDrawer = () => setIsFilterOpen(false)

    // GANTI FUNGSI LAMA DENGAN INI
    const handleResetFilter = () => {
        const defaultFilters = {
            tanggal_awal: defaultStartDate,
            tanggal_akhir: defaultEndDate,
            idClient: '',
            idDivisi: '',
        }

        setActiveFilters(defaultFilters) // Reset state filter ke default

        dispatch(
            getDashboard({
                tanggal_awal: defaultStartDate,
                tanggal_akhir: defaultEndDate,
            })
        )
        closeFilterDrawer()
    }

    const FilterFooter = (
        <div className="flex justify-between w-full">
            <Button size="sm" variant="default" onClick={handleResetFilter}>
                Reset
            </Button>
            <div className="text-right">
                <Button size="sm" className="mr-2" onClick={closeFilterDrawer}>
                    Batal
                </Button>
                <Button
                    size="sm"
                    variant="solid"
                    type="submit"
                    form="filter-form"
                >
                    Search
                </Button>
            </div>
        </div>
    )

    return (
        <div>
            <div className="flex flex-col justify-between md:flex-row gap-4 mb-6">
                <div className="lg:mb-0">
                    <h3>Dashboard</h3>
                    <p>Ringkasan data proyek</p>
                </div>
                <div>
                    <Button
                        variant="default"
                        icon={<HiOutlineFilter />}
                        onClick={openFilterDrawer}
                        size="sm"
                    >
                        Filter Data
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <Loading loading={loadingDashboard}>
                    {/* Baris 1 Holding */}
                    <Holding dataAwal={dataAwal} />

                    {/* Tabel Data Proyek */}
                    <div className=" rounded-lg p-4 border">
                        <TableDataProyekDashboard dataAwal={dataAwal} />
                    </div>
                </Loading>
            </div>

            {/* filter */}
            <Drawer
                title="Filter Dashboard"
                isOpen={isFilterOpen}
                footer={FilterFooter}
                onClose={closeFilterDrawer}
                onRequestClose={closeFilterDrawer}
            >
                <Formik<FilterFormValues>
                    enableReinitialize
                    innerRef={formikRef}
                    initialValues={activeFilters}
                    validationSchema={BastpSchema}
                    onSubmit={handleFilter}
                >
                    {({ errors, touched }) => (
                        <Form id="filter-form" className="flex flex-col gap-4">
                            {/* Filter Klien */}
                            <FormItem
                                label="Klien"
                                invalid={
                                    !!(errors.idClient && touched.idClient)
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
                                                isMulti // Tambahkan prop ini
                                                isClearable
                                                placeholder="Semua Klien"
                                                options={clientOptions}
                                                isLoading={loadingSelectClient}
                                                value={selectedOptions}
                                                onChange={(selected) => {
                                                    const values = selected
                                                        ? selected.map(
                                                              (option: any) =>
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
                                    !!(errors.idDivisi && touched.idDivisi)
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
                                                isMulti // Tambahkan prop ini
                                                isClearable
                                                placeholder="Semua Divisi"
                                                options={divisiOptions}
                                                isLoading={loadingSelectDivisi}
                                                value={selectedOptions}
                                                onChange={(selected) => {
                                                    const values = selected
                                                        ? selected.map(
                                                              (option: any) =>
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

                            {/* ... FormItem untuk DatePicker tetap sama ... */}
                            <FormItem
                                label="Tanggal Awal"
                                invalid={
                                    !!(
                                        errors.tanggal_awal &&
                                        touched.tanggal_awal
                                    )
                                }
                                errorMessage={errors.tanggal_awal}
                            >
                                <Field name="tanggal_awal">
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
                                                // Cukup panggil setFieldValue dari Formik
                                                form.setFieldValue(
                                                    field.name,
                                                    formattedDate
                                                )
                                            }}
                                        />
                                    )}
                                </Field>
                            </FormItem>
                            <FormItem
                                label="Tanggal Akhir"
                                invalid={
                                    !!(
                                        errors.tanggal_akhir &&
                                        touched.tanggal_akhir
                                    )
                                }
                                errorMessage={errors.tanggal_akhir}
                            >
                                <Field name="tanggal_akhir">
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
                                                // Cukup panggil setFieldValue dari Formik
                                                form.setFieldValue(
                                                    field.name,
                                                    formattedDate
                                                )
                                            }}
                                        />
                                    )}
                                </Field>
                            </FormItem>
                        </Form>
                    )}
                </Formik>
            </Drawer>
        </div>
    )
}

export default Dashboard
