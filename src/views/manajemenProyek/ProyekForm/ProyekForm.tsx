import { forwardRef, useState } from 'react'
import { FormContainer } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import hooks from '@/components/ui/hooks'
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

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
type FormikRef = FormikProps<any>

type InitialData = {
    id?: string
    pekerjaan?: string
    klien?: string
    idKlien?: string
    pic?: string
    nomor_spk?: string
    nomor_spj?: string
    nomor_spo?: string
    tanggal_service_po?: string
    tanggal_delivery?: string
    nilai_kontrak?: number
    realisasi?: number
    progress?: number
    sisa_waktu?: number
    keterangan?: string
    status?: string
    idUser?: string
    berkas?: string[]
    lokasi?: string[]
    termin?: { keterangan: string; persen: number }[]
}

export type FormModel = InitialData

export type SetSubmitting = (isSubmitting: boolean) => void

export type OnDeleteCallback = React.Dispatch<React.SetStateAction<boolean>>

type OnDelete = (callback: OnDeleteCallback) => void

type ProyekForm = {
    initialData?: InitialData
    type: 'edit' | 'new'
    onDiscard?: () => void
    onDelete?: OnDelete
    onFormSubmit: (formData: FormModel, setSubmitting: SetSubmitting) => void
    kliensList?: { id: string; nama: string; keterangan: string }[]
    berkasesList?: { id: string; nama: string }[]
}

const { useUniqueId } = hooks

const validationSchema = Yup.object().shape({
    pekerjaan: Yup.string().required('Pekerjaan wajib diisi'),
    idKlien: Yup.string().required('Klien wajib diisi'),
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
    const {
        type,
        initialData = {
            id: '',
            pekerjaan: '',
            klien: '',
            idKlien: '',
            pic: '',
            nomor_spk: '',
            nomor_spj: '',
            nomor_spo: '',
            tanggal_service_po: '',
            tanggal_delivery: '',
            nilai_kontrak: 0,
            realisasi: 0,
            progress: 0,
            sisa_waktu: 0,
            keterangan: '',
            status: 'Dalam Pengerjaan',
            berkas: [],
            lokasi: [],
            termin: [],
        },
        onFormSubmit,
        onDiscard,
        onDelete,
        kliensList = [],
        berkasesList = [],
    } = props

    const newId = useUniqueId('proyek-')

    return (
        <>
            <Formik
                innerRef={ref}
                initialValues={{
                    ...initialData,
                }}
                validationSchema={validationSchema}
                onSubmit={(values: FormModel, { setSubmitting }) => {
                    const formData = cloneDeep(values)
                    if (type === 'new') {
                        formData.id = newId
                    }

                    // Ensure client name is updated from the selected client ID
                    const selectedKlien = kliensList.find(
                        (client) => client.id === formData.idKlien
                    )
                    if (selectedKlien) {
                        formData.klien = selectedKlien.nama
                    }

                    //OCOKKAN DATA PADA BERKAS DENGAN DATA PADA PROYEK.BERKAS

                    onFormSubmit?.(formData, setSubmitting)
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div className="lg:col-span-2">
                                    <BasicInformationFields
                                        touched={touched}
                                        errors={errors}
                                        kliensList={kliensList}
                                        berkasesList={berkasesList}
                                    />
                                    {/* Location Fields */}
                                    <LocationFields
                                        touched={touched}
                                        errors={errors}
                                    />

                                    {/* Payment Terms Fields */}
                                    <TerminFields
                                        touched={touched}
                                        errors={errors}
                                    />
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
                )}
            </Formik>
        </>
    )
})

ProyekForm.displayName = 'ProyekForm'

export default ProyekForm
