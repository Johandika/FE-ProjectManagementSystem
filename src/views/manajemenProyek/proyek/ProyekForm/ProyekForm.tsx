import { forwardRef, useState } from 'react'
import { FormContainer } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import StickyFooter from '@/components/shared/StickyFooter'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { Form, Formik, FormikProps } from 'formik'
import BasicInformationFields from './BasicInformationFields'
import cloneDeep from 'lodash/cloneDeep'
import { HiOutlineTrash } from 'react-icons/hi'
import { AiOutlineSave } from 'react-icons/ai'
import * as Yup from 'yup'
import LocationFields from './LocationFields'
import TerminFields from './TerminFields'
import SubkontraktorFields from './SubkontraktorFields'
import ItemFields from './ItemFields'
import { useLocation } from 'react-router-dom'

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
type FormikRef = FormikProps<any>

type InitialData = {
    pekerjaan?: string
    klien?: string
    idClient?: string
    pic?: string
    nomor_kontrak?: string
    tanggal_service_po?: string
    tanggal_kontrak?: string
    tanggal_delivery?: string
    nilai_kontrak?: number
    uang_muka?: number
    persen_retensi?: number
    timeline_awal?: string
    timeline_akhir?: string
    keterangan?: string
    idUser?: string
    berkas?: string[]
    lokasi?: { lokasi: string; longitude: number; latitude: number }[]
    termin?: { keterangan: string; persen: number }[]
    item?: {
        item: string
        detail: {
            uraian: string
            satuan: string
            volume: number
            harga_satuan_material: number
            harga_satuan_jasa: number
            jumlah_harga_material: number
            jumlah_harga_jasa: number
            jumlah: number
        }[]
    }[]
    subkontraktor?: {
        nama: string
        nilai_subkontrak: number
        nomor_surat: string
        id: string
        waktu_mulai_pelaksanaan: string
        waktu_selesai_pelaksanaan: string
        keterangan: string
    }[]
}

type InitialDataEdit = {
    pekerjaan?: string
    pic?: string
    nomor_kontrak?: string
    tanggal_service_po?: string
    tanggal_kontrak?: string
    tanggal_delivery?: string
    nilai_kontrak?: number
    idClient?: string
    timeline?: number
    keterangan?: string
}

export type FormModel = InitialData

export type SetSubmitting = (isSubmitting: boolean) => void

export type OnDeleteCallback = React.Dispatch<React.SetStateAction<boolean>>

type OnDelete = (callback: OnDeleteCallback) => void

type ProyekForm = {
    initialData?: InitialData
    initialDataEdit?: InitialDataEdit
    type: 'edit' | 'new'
    onDiscard?: () => void
    onDelete?: OnDelete
    onFormSubmit: (formData: FormModel, setSubmitting: SetSubmitting) => void
    kliensList?: { id: string; nama: string; keterangan: string }[]
    berkasesList?: { id: string; nama: string }[]
    subkontraktorsList?: {
        nama: string
        nilai_subkontrak: number
        nomor_surat: string
        id: string
        waktu_mulai_pelaksanaan: string
        waktu_selesai_pelaksanaan: string
        keterangan: string
    }[]
    satuansList?: {
        id: string
        satuan: string
    }[]
    terminsList?: {
        id: string
        persen: number
        tanggal: string
        status: string
        idProject: string
        idFakturPajak: string
        keterangan: string
    }[]
}

const validationSchemaNew = Yup.object().shape({
    pekerjaan: Yup.string().required('Pekerjaan wajib diisi'),
    timeline_awal: Yup.string().required('Timeline awal wajib diisi'),
    timeline_akhir: Yup.string().required('Timeline akhir wajib diisi'),
    idClient: Yup.string().required('Klien wajib diisi'),
    pic: Yup.string().required('PIC wajib diisi'),
})

const validationSchemaEdit = Yup.object().shape({
    pekerjaan: Yup.string().required('Pekerjaan wajib diisi'),
    idClient: Yup.string().required('Klien wajib diisi'),
    pic: Yup.string().required('PIC wajib diisi'),
})

const DeleteProyekButton = ({ onDelete }: { onDelete: OnDelete }) => {
    const [dialogOpen, setDialogOpen] = useState(false)

    const onConfirmDialogOpen = () => {
        setDialogOpen(true)
    }

    const onConfirmDialogClose = () => {
        setDialogOpen(false)
    }

    const handleConfirm = () => {
        onDelete?.(setDialogOpen)
    }

    return (
        <>
            <Button
                className="text-red-600"
                variant="plain"
                size="sm"
                icon={<HiOutlineTrash />}
                type="button"
                onClick={onConfirmDialogOpen}
            >
                Hapus
            </Button>
            <ConfirmDialog
                isOpen={dialogOpen}
                type="danger"
                title="Hapus proyek"
                confirmButtonColor="red-600"
                onClose={onConfirmDialogClose}
                onRequestClose={onConfirmDialogClose}
                onCancel={onConfirmDialogClose}
                onConfirm={handleConfirm}
            >
                <p>Apakah Anda yakin ingin menghapus proyek ini?</p>
            </ConfirmDialog>
        </>
    )
}

const ProyekForm = forwardRef<FormikRef, ProyekForm>((props, ref) => {
    const location = useLocation()
    const stateFromTender = location.state

    const {
        type,
        initialData = {
            pekerjaan: stateFromTender?.pekerjaan || '',
            nilai_kontrak: stateFromTender?.nilai_kontrak || 0,
            idClient: stateFromTender?.idClient || '',
            idTender: stateFromTender?.idTender || null,
            pic: '',
            nomor_kontrak: '',
            timeline_awal: '',
            timeline_akhir: '',
            tanggal_service_po: '',
            tanggal_kontrak: '',
            is_retensi: false,
            persen_retensi: 0,
            jatuh_tempo_retensi: null,
            tanggal_delivery: '',
            uang_muka: 0,
            timeline: 0,
            keterangan: '',
            berkas: [],
            item: [],
            lokasi: [],
            termin: [],
            subkontraktor: [],
        },
        initialDataEdit = {
            pekerjaan: '',
            pic: '',
            nomor_kontrak: '',
            tanggal_service_po: '',
            tanggal_kontrak: '',
            tanggal_delivery: '',
            nilai_kontrak: 0,
            timeline: 0,
            keterangan: '',
            idClient: '',
        },
        onFormSubmit,
        onDiscard,
        onDelete,
        kliensList = [],
        berkasesList = [],
        satuansList = [],
        subkontraktorsList = [],
        terminsList = [],
    } = props

    return (
        <>
            <Formik
                innerRef={ref}
                initialValues={
                    type === 'new'
                        ? {
                              ...initialData,
                          }
                        : { ...initialDataEdit }
                }
                validationSchema={
                    type === 'new' ? validationSchemaNew : validationSchemaEdit
                }
                onSubmit={(values: FormModel, { setSubmitting }) => {
                    const formData = cloneDeep(values)

                    //COCOKKAN DATA PADA BERKAS DENGAN DATA PADA PROYEK.BERKAS

                    onFormSubmit?.(formData, setSubmitting)
                }}
            >
                {({ touched, errors, isSubmitting }) => {
                    return (
                        <Form>
                            <FormContainer>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    <div className="lg:col-span-2">
                                        <BasicInformationFields
                                            type={type}
                                            touched={touched}
                                            errors={errors}
                                            kliensList={kliensList}
                                            berkasesList={berkasesList}
                                            initialData={initialData}
                                        />

                                        {type === 'new' && (
                                            <>
                                                <LocationFields
                                                    touched={touched}
                                                    errors={errors}
                                                />
                                                <SubkontraktorFields
                                                    touched={touched}
                                                    errors={errors}
                                                    subkontraktorsList={
                                                        subkontraktorsList.length >
                                                        0
                                                            ? subkontraktorsList
                                                            : []
                                                    }
                                                />
                                                <ItemFields
                                                    touched={touched}
                                                    errors={errors}
                                                    satuansList={satuansList}
                                                />
                                                <TerminFields
                                                    touched={touched}
                                                    errors={errors}
                                                    terminsList={terminsList}
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>
                                <StickyFooter
                                    className="-mx-8 px-8 flex items-center justify-between py-4"
                                    stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                >
                                    <div>
                                        {type === 'edit' && (
                                            <DeleteProyekButton
                                                onDelete={onDelete as OnDelete}
                                            />
                                        )}
                                    </div>
                                    <div className="md:flex items-center">
                                        <Button
                                            size="sm"
                                            className="ltr:mr-3 rtl:ml-3"
                                            type="button"
                                            onClick={() => onDiscard?.()}
                                        >
                                            Batal
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="solid"
                                            loading={isSubmitting}
                                            icon={<AiOutlineSave />}
                                            type="submit"
                                        >
                                            Simpan
                                        </Button>
                                    </div>
                                </StickyFooter>
                            </FormContainer>
                        </Form>
                    )
                }}
            </Formik>
        </>
    )
})

ProyekForm.displayName = 'ProyekForm'

export default ProyekForm
