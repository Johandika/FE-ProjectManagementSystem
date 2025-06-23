import Table from '@/components/ui/Table/Table'
import React, { useEffect, useState } from 'react'
import DescriptionSection from './DesriptionSection'
import THead from '@/components/ui/Table/THead'
import Tr from '@/components/ui/Table/Tr'
import Th from '@/components/ui/Table/Th'
import TBody from '@/components/ui/Table/TBody'
import Td from '@/components/ui/Table/Td'
import { formatDateWithTime } from '@/utils/formatDate'
import { HiOutlinePencil, HiOutlineTrash, HiPlusCircle } from 'react-icons/hi'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { Link } from 'react-router-dom'
import {
    Button,
    Dialog,
    FormItem,
    Input,
    Notification,
    toast,
} from '@/components/ui'
import { injectReducer, useAppDispatch } from '@/store'
import * as Yup from 'yup'
import reducer, {
    getKeterangan,
    getProyek,
    setSelectedKeterangan,
    toggleDeleteConfirmationKeterangan,
    useAppSelector,
} from '../../ProyekEdit/store'
import KeteranganDeleteConfirmation from './KeteranganDeleteConfirmation'
import { Field, Form, Formik } from 'formik'
import {
    apiCreateKeterangan,
    apiPutKeterangan,
} from '@/services/KeteranganService'

interface KeteranganFormValues {
    idProject?: string
    keterangan: string
}

const KeteranganSchema = Yup.object().shape({
    keterangan: Yup.string().required('Keterangan tidak boleh kosong'),
})

injectReducer('proyekEdit', reducer)

export default function KeteranganSection({ proyekData }: any) {
    const { textTheme } = useThemeClass()
    const dispatch = useAppDispatch()
    const [keteranganFormInitialValues, setKeteranganFormInitialValues] =
        useState<KeteranganFormValues>({
            keterangan: '',
        })
    const [dialogKeteranganOpen, setDialogKeteranganOpen] = useState(false)
    const [typeDialog, setTypeDialog] = useState('')
    const [idKeterangan, setIdKeterangan] = useState('')

    const dataKeterangan = useAppSelector(
        (state) => state.proyekEdit.data.keteranganData.data
    )

    const onDelete = (id: any) => {
        dispatch(toggleDeleteConfirmationKeterangan(true))
        dispatch(setSelectedKeterangan(id))
    }

    const handleCloseKeterangan = () => {
        setDialogKeteranganOpen(false)
        setKeteranganFormInitialValues({
            keterangan: '',
        })
        setTypeDialog('')
        setIdKeterangan('')
    }

    const popNotification = (keyword: string) => {
        toast.push(
            <Notification
                title={`Successfuly ${keyword}`}
                type="success"
                duration={2500}
            >
                Proyek successfuly {keyword}
            </Notification>,
            {
                placement: 'top-center',
            }
        )
        //refresh
    }

    const handleKeteranganSubmit = async (
        values: KeteranganFormValues,
        { setSubmitting }: any
    ) => {
        setSubmitting(true)

        try {
            if (typeDialog === 'edit') {
                const proceedDataEdit = {
                    ...values,
                    id: idKeterangan,
                }
                // --- LOGIKA UNTUK UPDATE ---
                const result = await apiPutKeterangan(proceedDataEdit) // Panggil API update

                if (result && result.data?.statusCode === 200) {
                    popNotification('berhasil diupdate')
                    handleCloseKeterangan() // Tutup dan reset dialog
                    dispatch(getProyek({ id: proyekData.id })) // Refresh data tabel
                }
            } else {
                // --- LOGIKA UNTUK CREATE (YANG SUDAH ADA) ---
                const proceedData = {
                    ...values,
                    IdProject: proyekData.id,
                }
                const result = await apiCreateKeterangan(proceedData)

                if (result && result.data?.statusCode === 201) {
                    popNotification('berhasil ditambahkan')
                    handleCloseKeterangan() // Tutup dan reset dialog
                    dispatch(getProyek({ id: proyekData.id }))
                }
            }
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger" duration={2500}>
                    {error
                        ? error.response.data?.message
                        : 'Gagal menambahkan Keterangan'}
                </Notification>,
                { placement: 'top-center' }
            )
        } finally {
            setSubmitting(false)
        }
    }

    const handleEditKeterangan = (idKeterangan: string) => {
        // Set state yang diperlukan untuk membuka dialog dalam mode edit
        setIdKeterangan(idKeterangan)
        setTypeDialog('edit')
        setDialogKeteranganOpen(true)

        // Dispatch aksi untuk mengambil data keterangan.
        // Kita tidak perlu 'await' di sini karena useEffect yang akan menanganinya.
        dispatch(getKeterangan({ id: idKeterangan }))
    }

    useEffect(() => {
        // Cek apakah dialog terbuka, dalam mode 'edit', dan dataKeterangan sudah ada (tidak null/undefined)
        if (dialogKeteranganOpen && typeDialog === 'edit' && dataKeterangan) {
            // Jika kondisi terpenuhi, set nilai awal form Formik dengan data yang diterima
            setKeteranganFormInitialValues({
                keterangan: dataKeterangan.keterangan || '', // Ambil nilai 'keterangan'
            })
        }
    }, [dataKeterangan, dialogKeteranganOpen, typeDialog])

    return (
        <div>
            {/* Table */}
            <div className="flex justify-between items-center my-6">
                <DescriptionSection
                    title="Keterangan Tambahan"
                    desc="Informasi keterangan tambahan proyek"
                />
                <div className="block lg:inline-block md:mb-0 mb-4 md:ml-2 ">
                    <Button
                        block
                        variant="solid"
                        size="sm"
                        icon={<HiPlusCircle />}
                        onClick={() => {
                            setKeteranganFormInitialValues({ keterangan: '' })
                            setTypeDialog('add')
                            setDialogKeteranganOpen(true)
                        }}
                    >
                        Tambah Keterangan
                    </Button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <Table className="min-w-max lg:min-w-full table-fixed">
                    <THead>
                        <Tr>
                            <Th className="w-[500px]">Keterangan</Th>
                            <Th className="min-w-[300px]">Waktu</Th>
                            <Th>Aksi</Th>
                        </Tr>
                    </THead>
                    <TBody>
                        {proyekData.KeteranganProjects?.map(
                            (keterangan: any) => (
                                <Tr key={keterangan.id}>
                                    <Td>{keterangan.keterangan}</Td>
                                    <Td>
                                        {formatDateWithTime(keterangan.tanggal)}
                                    </Td>
                                    <Td className="flex  text-lg items-center h-auto ">
                                        <span
                                            className={`cursor-pointer p-2 hover:${textTheme}`}
                                            onClick={() => {
                                                handleEditKeterangan(
                                                    keterangan.id
                                                )
                                            }}
                                        >
                                            <HiOutlinePencil />
                                        </span>
                                        <span
                                            className="cursor-pointer p-2 hover:text-red-500 "
                                            onClick={() =>
                                                onDelete(keterangan.id)
                                            }
                                        >
                                            <HiOutlineTrash />
                                        </span>
                                    </Td>
                                </Tr>
                            )
                        )}
                    </TBody>
                </Table>
            </div>
            <KeteranganDeleteConfirmation idProyek={proyekData.id} />
            {/* Form Keterangan  */}
            <Formik
                initialValues={keteranganFormInitialValues}
                validationSchema={KeteranganSchema}
                enableReinitialize={true}
                onSubmit={handleKeteranganSubmit}
            >
                {({ errors, touched, isSubmitting, values, setFieldValue }) => (
                    <>
                        <Dialog
                            isOpen={dialogKeteranganOpen}
                            onClose={handleCloseKeterangan}
                            onRequestClose={handleCloseKeterangan}
                        >
                            <Form>
                                <h5 className="mb-4">Keterangan </h5>

                                <div className="  gap-0 sm:gap-4">
                                    <FormItem
                                        label="Keterangan"
                                        labelClass="!justify-start"
                                        invalid={
                                            (errors.keterangan &&
                                                touched.keterangan) as boolean
                                        }
                                        errorMessage={errors.keterangan}
                                    >
                                        <Field
                                            textArea
                                            name="keterangan"
                                            placeholder="Masukkan keterangan"
                                            component={Input}
                                        />
                                    </FormItem>
                                </div>

                                {/* Button Dialog Option */}
                                <div className="text-right mt-6">
                                    <Button
                                        className="ltr:mr-2 rtl:ml-2"
                                        variant="plain"
                                        type="button"
                                        disabled={isSubmitting}
                                        onClick={handleCloseKeterangan}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="solid"
                                        type="submit"
                                        loading={isSubmitting}
                                    >
                                        Simpan
                                    </Button>
                                </div>
                            </Form>
                        </Dialog>
                    </>
                )}
            </Formik>
        </div>
    )
}
