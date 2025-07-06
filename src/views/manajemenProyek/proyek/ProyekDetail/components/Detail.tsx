import reducer, {
    useAppDispatch,
    getProyek,
    useAppSelector,
    getTermins,
    setPekerjaanActive,
    getKeteranganByProject,
} from '../../ProyekEdit/store'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DescriptionSection from './DesriptionSection'
import { injectReducer } from '@/store'
import { formatDate, formatDateWithTime } from '@/utils/formatDate'
import * as Yup from 'yup'
import {
    Button,
    DatePicker,
    Dialog,
    FormItem,
    Input,
    Notification,
    toast,
} from '@/components/ui'
import { apiUpdateStatusRetensi } from '@/services/ProyekService'
import { ConfirmDialog } from '@/components/shared'
import { Field, FieldProps, Form, Formik } from 'formik'
import dayjs from 'dayjs'
import {
    apiCreateAdendumNilaiKontrak,
    apiCreateAdendumTimeline,
} from '@/services/AdendumService'
import { NumericFormat } from 'react-number-format'
import { extractNumberFromString } from '@/utils/extractNumberFromString'
import KeteranganSection from './Keterangan'
import { setUnreadNotification } from '@/views/notifikasi/store'

injectReducer('proyekEdit', reducer)

interface AdendumTimelineFormValues {
    idProject?: string
    timeline_awal_sebelum: string
    timeline_awal_adendum: string
    timeline_akhir_sebelum: string
    timeline_akhir_adendum: string
}

interface AdendumNilaiKontrakFormValues {
    idProject?: string
    nilai_kontrak_sebelum: string
    nilai_kontrak_sesudah: string
}

export interface SetSubmitting {
    (isSubmitting: boolean): void
}

const AdendumTimelineSchema = Yup.object().shape({
    timeline_awal_adendum: Yup.string().required('Timeline awal wajib diisi'),
    timeline_akhir_adendum: Yup.string().required('Timeline akhir wajib diisi'),
})

const AdendumNilaiKontrakSchema = Yup.object().shape({
    nilai_kontrak_sesudah: Yup.string().required(
        'Nilai kontrak awal wajib diisi'
    ),
})

export default function Detail() {
    const dispatch = useAppDispatch()
    const location = useLocation()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [statusChangeDialogOpen, setStatusChangeDialogOpen] = useState(false)
    const [dialogAdendumNilaiKontrakOpen, setDialogAdendumNilaiKontrakOpen] =
        useState(false)
    const [dialogAdendumTimelineOpen, setDialogAdendumTimelineOpen] =
        useState(false)
    const [statusChangeItem, setStatusChangeItem] = useState(null)
    const [
        adendumNilaiKontrakFormInitialValues,
        setAdendumNilaiKontrakFormInitialValues,
    ] = useState<AdendumNilaiKontrakFormValues>({
        nilai_kontrak_sebelum: '',
        nilai_kontrak_sesudah: '',
    })
    const [
        adendumTimelineFormInitialValues,
        setAdendumTimelineFormInitialValues,
    ] = useState<AdendumTimelineFormValues>({
        timeline_awal_adendum: '',
        timeline_akhir_adendum: '',
        timeline_awal_sebelum: '',
        timeline_akhir_sebelum: '',
    })

    const { proyekData } = useAppSelector((state) => state.proyekEdit.data)

    const fetchData = (data: { id: string }) => {
        dispatch(getProyek(data))
            .unwrap()
            .then((result) => {
                // Only set pekerjaanActive after proyekData is loaded
                if (result && result.pekerjaan) {
                    dispatch(setPekerjaanActive(result.pekerjaan))
                }
            })
        dispatch(getTermins(data))
        // dispatch(getKeteranganByProject(data))
    }

    const handleOpenStatusChangeDialog = (typeDialog: string) => {
        if (typeDialog === 'Ubah Status') {
            setStatusChangeItem({
                id: proyekData.id,
                newStatus: !proyekData.status_retensi,
                nama: proyekData.pekerjaan,
            })
            setStatusChangeDialogOpen(true)
        }
        if (typeDialog === 'Adendum Nilai Kontrak') {
            setAdendumNilaiKontrakFormInitialValues({
                ...adendumTimelineFormInitialValues,
                nilai_kontrak_sebelum: proyekData.nilai_kontrak || '',
            })
            setDialogAdendumNilaiKontrakOpen(true)
        }
        if (typeDialog === 'Timeline') {
            setAdendumTimelineFormInitialValues({
                ...adendumTimelineFormInitialValues,
                timeline_awal_sebelum: proyekData.timeline_awal || '',
                timeline_akhir_sebelum: proyekData.timeline_akhir || '',
            })
            setDialogAdendumTimelineOpen(true)
        }
    }

    const confirmStatusChange = async () => {
        setStatusChangeDialogOpen(false)
        setIsSubmitting(true)

        try {
            const result = await apiUpdateStatusRetensi({
                id: statusChangeItem.id,
                status_retensi: statusChangeItem.newStatus,
            })
            if (
                result &&
                result.data?.statusCode >= 200 &&
                result.data?.statusCode < 300
            ) {
                await dispatch(getProyek({ id: statusChangeItem.id })).unwrap()
                toast.push(
                    <Notification
                        title="Status berhasil diperbarui"
                        type="success"
                        duration={2500}
                    >
                        Status Retensi berhasil di update
                    </Notification>,
                    { placement: 'top-center' }
                )
            } else {
                toast.push(
                    <Notification title="Error" type="danger" duration={2500}>
                        {result ? result?.message : 'Gagal memperbarui status'}
                    </Notification>,
                    { placement: 'top-center' }
                )
            }
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger" duration={2500}>
                    {error?.response?.data?.message ||
                        'Gagal memperbarui status'}
                </Notification>,
                { placement: 'top-center' }
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const cancelStatusChange = () => {
        setStatusChangeDialogOpen(false)
    }

    // Success notification helper
    const popNotification = (keyword: string) => {
        toast.push(
            <Notification
                title={`Berhasil ${keyword}`}
                type="success"
                duration={2500}
            >
                Data Adendum {keyword}
            </Notification>,
            {
                placement: 'top-center',
            }
        )
    }

    const handleAdendumTimelineSubmit = async (
        values: AdendumTimelineFormValues,
        { setSubmitting }: { setSubmitting: SetSubmitting }
    ) => {
        setSubmitting(true)
        const projectId = proyekData.id

        const processedData = {
            ...values,
            idProject: projectId || '',
        }

        try {
            let result = await apiCreateAdendumTimeline(processedData)

            if (result && result.data?.statusCode === 201) {
                dispatch(setUnreadNotification(true))
                popNotification('berhasil ditambahkan')

                setAdendumTimelineFormInitialValues({
                    timeline_awal_adendum: '',
                    timeline_akhir_adendum: '',
                    timeline_awal_sebelum: '',
                    timeline_akhir_sebelum: '',
                })

                setDialogAdendumTimelineOpen(false)

                // Refresh
                dispatch(getProyek({ id: projectId }))
            }
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger" duration={2500}>
                    {error
                        ? error.response.data?.message
                        : 'Gagal menambahkan BASTP'}
                </Notification>,
                { placement: 'top-center' }
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleAdendumNilaiKontrakSubmit = async (
        values: AdendumNilaiKontrakFormValues,
        { setSubmitting }: { setSubmitting: SetSubmitting }
    ) => {
        setSubmitting(true)
        const projectId = proyekData.id

        const processedData = {
            ...values,
            nilai_kontrak_sebelum: extractNumberFromString(
                values.nilai_kontrak_sebelum
            ),
            nilai_kontrak_sesudah: extractNumberFromString(
                values.nilai_kontrak_sesudah
            ),
            idProject: projectId || '',
        }

        try {
            let result = await apiCreateAdendumNilaiKontrak(processedData)

            if (result && result.data?.statusCode === 201) {
                dispatch(setUnreadNotification(true))

                popNotification('berhasil ditambahkan')

                setAdendumNilaiKontrakFormInitialValues({
                    nilai_kontrak_sebelum: '',
                    nilai_kontrak_sesudah: '',
                })

                setDialogAdendumNilaiKontrakOpen(false)

                // Refresh
                dispatch(getProyek({ id: projectId }))
            }
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger" duration={2500}>
                    {error
                        ? error.response.data?.message
                        : 'Gagal menambahkan BASTP'}
                </Notification>,
                { placement: 'top-center' }
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCloseAdendum = () => {
        setDialogAdendumTimelineOpen(false)
        setDialogAdendumNilaiKontrakOpen(false)
        setAdendumNilaiKontrakFormInitialValues({
            nilai_kontrak_sebelum: '',
            nilai_kontrak_sesudah: '',
        })
        setAdendumTimelineFormInitialValues({
            timeline_awal_adendum: '',
            timeline_akhir_adendum: '',
            timeline_awal_sebelum: '',
            timeline_akhir_sebelum: '',
        })
    }

    useEffect(() => {
        const path = location.pathname.substring(
            location.pathname.lastIndexOf('/') + 1
        )
        const rquestParam = { id: path }
        fetchData(rquestParam)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname])
    return (
        <section className=" ">
            <div>
                {/* Informasi Dasar */}
                <div className="flex flex-col gap-4  border-gray-200 py-6">
                    <DescriptionSection
                        title="Informasi Dasar"
                        desc="Informasi dasar proyek"
                    />
                    <div>
                        <div className="flex flex-col gap-0 border-b py-4 ">
                            <div className="text-sm">Nama Pekerjaan :</div>
                            <div className="text-base font-semibold text-neutral-500">
                                {proyekData.pekerjaan}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2">
                            <div className="flex flex-col gap-0 border-b py-4">
                                <div className="text-sm">Klien :</div>
                                <div className="text-base font-semibold text-neutral-500">
                                    {proyekData.Client?.nama}
                                </div>
                            </div>
                            <div className="flex flex-col gap-0 border-b py-4">
                                <div className="text-sm">PIC :</div>
                                <div className="text-base font-semibold text-neutral-500">
                                    {proyekData.pic}
                                </div>
                            </div>
                            <div className="flex flex-col gap-0 border-b py-4">
                                <div className="text-sm">Nomor Kontrak :</div>
                                <div className="text-base font-semibold text-neutral-500">
                                    {proyekData.nomor_kontrak || '-'}
                                </div>
                            </div>
                            <div className="flex flex-col gap-0 border-b py-4">
                                <div className="text-sm">Tgl. Kontrak :</div>
                                <div className="text-base font-semibold text-neutral-500">
                                    {formatDate(
                                        proyekData.tanggal_kontrak || '-'
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-0 border-b py-4">
                                <div className="text-sm">Status :</div>
                                <div className="text-base font-semibold text-neutral-500">
                                    {proyekData.status || '-'}
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4  border-b py-4 items-start sm:items-center">
                                <div>
                                    <div className="text-sm">
                                        Nilai Kontrak :
                                    </div>
                                    <div className="text-base font-semibold text-neutral-500">
                                        {proyekData.nilai_kontrak?.toLocaleString(
                                            'id-ID'
                                        ) || '-'}
                                    </div>
                                </div>
                                <Button
                                    size="xs"
                                    variant="solid"
                                    onClick={() =>
                                        handleOpenStatusChangeDialog(
                                            'Adendum Nilai Kontrak'
                                        )
                                    }
                                >
                                    Adendum Nilai Kontrak
                                </Button>
                            </div>
                            <div className="flex flex-col gap-0 border-b py-4">
                                <div className="text-sm">Uang Muka :</div>
                                <div className="text-base font-semibold text-neutral-500">
                                    {proyekData.uang_muka?.toLocaleString(
                                        'id-ID'
                                    ) || '-'}
                                </div>
                            </div>
                            <div className="flex flex-col gap-0 border-b py-4">
                                <div className="text-sm">Progress (%) :</div>
                                <div className="text-base font-semibold text-neutral-500">
                                    {proyekData.progress}
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 border-b py-4 items-start sm:items-center">
                                <div>
                                    <div className="text-sm">Timeline</div>
                                    <div className="text-base font-semibold text-neutral-500">
                                        {formatDate(
                                            proyekData.timeline_awal || '-'
                                        )}{' '}
                                        /{' '}
                                        {formatDate(
                                            proyekData.timeline_akhir || '-'
                                        )}
                                    </div>
                                </div>
                                <Button
                                    size="xs"
                                    variant="solid"
                                    onClick={() =>
                                        handleOpenStatusChangeDialog('Timeline')
                                    }
                                >
                                    Adendum Timeline
                                </Button>
                            </div>

                            {/* Retensi */}
                            <div className="flex flex-col gap-0 border-b py-4">
                                <div className="text-sm">Retensi :</div>
                                <div className="text-base font-semibold text-neutral-500">
                                    {proyekData.is_retensi ? 'Ya' : 'Tidak'}
                                </div>
                            </div>
                            {proyekData.is_retensi === true && (
                                <>
                                    <div className="flex flex-col gap-0 border-b py-4">
                                        <div className="text-sm">
                                            Persen Retensi :
                                        </div>
                                        <div className="text-base font-semibold text-neutral-500">
                                            {`${proyekData.persen_retensi}%` ||
                                                '-'}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-0 border-b py-4">
                                        <div className="text-sm">
                                            Tgl. Jatuh Tempo Retensi :
                                        </div>
                                        <div className="text-base font-semibold text-neutral-500">
                                            {formatDate(
                                                proyekData.jatuh_tempo_retensi
                                            ) || '-'}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-0  border-b  py-4">
                                        <div className="text-sm">
                                            Status Retensi :
                                        </div>
                                        <div className="text-base font-semibold text-neutral-500">
                                            {!isSubmitting &&
                                                (proyekData.status_retensi ===
                                                true ? (
                                                    <div className="flex flex-col sm:flex-row  sm:items-center items-start gap-2">
                                                        <div className="text-green-500">
                                                            Sudah Dibayar
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col sm:flex-row  sm:items-center items-start gap-2">
                                                        <div className="text-rose-500">
                                                            Belum Bayar
                                                        </div>
                                                        <Button
                                                            size="xs"
                                                            variant="solid"
                                                            onClick={() =>
                                                                handleOpenStatusChangeDialog(
                                                                    'Ubah Status'
                                                                )
                                                            }
                                                        >
                                                            Ubah Status
                                                        </Button>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Divisi */}
                            <div className="flex flex-col gap-0 border-b py-4">
                                <div className="text-sm">Divisi :</div>
                                <div className="text-base font-semibold text-neutral-500">
                                    {proyekData.Divisi?.name}
                                </div>
                            </div>
                        </div>
                        {/* batas */}
                        <div className="flex flex-col gap-0  py-4">
                            <div className="text-sm">Keterangan :</div>
                            <div className="text-base font-semibold text-neutral-500">
                                {proyekData.keterangan || '-'}
                            </div>
                        </div>
                    </div>
                </div>
                <KeteranganSection proyekData={proyekData} />
            </div>

            {/* Dialog update status */}
            <ConfirmDialog
                isOpen={statusChangeDialogOpen}
                onClose={cancelStatusChange}
                onRequestClose={cancelStatusChange}
                onCancel={cancelStatusChange}
                type="warning"
                title="Ubah Status"
                onConfirm={confirmStatusChange}
            >
                <p>
                    Apakah kamu yakin ingin mengubah status retensi berkas
                    menjadi{' '}
                    <strong>
                        {statusChangeItem?.newStatus
                            ? 'sudah dibayar'
                            : 'belum dibayar'}
                    </strong>
                    ?
                </p>
            </ConfirmDialog>

            {/* Form Adendum Timeline */}
            <Formik
                initialValues={adendumTimelineFormInitialValues}
                validationSchema={AdendumTimelineSchema}
                enableReinitialize={true}
                onSubmit={handleAdendumTimelineSubmit}
            >
                {({ errors, touched, isSubmitting, values, setFieldValue }) => (
                    <>
                        <Dialog
                            isOpen={dialogAdendumTimelineOpen}
                            onClose={handleCloseAdendum}
                            onRequestClose={handleCloseAdendum}
                        >
                            <Form>
                                <h5 className="mb-4">Adendum Timeline</h5>

                                <div className="flex flex-col sm:flex-row gap-0 sm:gap-4">
                                    {/* Timeline Awal Sebelum*/}
                                    <FormItem
                                        label="Timeline Awal Sebelum"
                                        invalid={
                                            (errors.timeline_awal_sebelum &&
                                                touched.timeline_awal_sebelum) as boolean
                                        }
                                        errorMessage={
                                            errors.timeline_awal_sebelum
                                        }
                                    >
                                        <Field name="timeline_awal_sebelum">
                                            {({ field, form }: FieldProps) => (
                                                <DatePicker
                                                    disabled
                                                    placeholder="Pilih Tanggal"
                                                    value={
                                                        field.value
                                                            ? new Date(
                                                                  field.value
                                                              )
                                                            : null
                                                    }
                                                    inputFormat="DD-MM-YYYY"
                                                    onChange={(date) => {
                                                        const formattedDate =
                                                            date
                                                                ? dayjs(
                                                                      date
                                                                  ).format(
                                                                      'YYYY-MM-DD'
                                                                  )
                                                                : ''
                                                        form.setFieldValue(
                                                            field.name,
                                                            formattedDate
                                                        )
                                                    }}
                                                />
                                            )}
                                        </Field>
                                    </FormItem>
                                    {/* Timeline Awal Adendum*/}
                                    <FormItem
                                        label="Timeline Awal Adendum"
                                        invalid={
                                            (errors.timeline_awal_adendum &&
                                                touched.timeline_awal_adendum) as boolean
                                        }
                                        errorMessage={
                                            errors.timeline_awal_adendum
                                        }
                                    >
                                        <Field name="timeline_awal_adendum">
                                            {({ field, form }: FieldProps) => (
                                                <DatePicker
                                                    placeholder="Pilih Tanggal"
                                                    value={
                                                        field.value
                                                            ? new Date(
                                                                  field.value
                                                              )
                                                            : null
                                                    }
                                                    inputFormat="DD-MM-YYYY"
                                                    onChange={(date) => {
                                                        const formattedDate =
                                                            date
                                                                ? dayjs(
                                                                      date
                                                                  ).format(
                                                                      'YYYY-MM-DD'
                                                                  )
                                                                : ''
                                                        form.setFieldValue(
                                                            field.name,
                                                            formattedDate
                                                        )
                                                    }}
                                                />
                                            )}
                                        </Field>
                                    </FormItem>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-0 sm:gap-4">
                                    {/* Timeline Akhir Sebelum*/}
                                    <FormItem
                                        label="Timeline Akhir Sebelum"
                                        invalid={
                                            (errors.timeline_akhir_sebelum &&
                                                touched.timeline_akhir_sebelum) as boolean
                                        }
                                        errorMessage={
                                            errors.timeline_akhir_sebelum
                                        }
                                    >
                                        <Field name="timeline_akhir_sebelum">
                                            {({ field, form }: FieldProps) => (
                                                <DatePicker
                                                    disabled
                                                    placeholder="Pilih Tanggal"
                                                    value={
                                                        field.value
                                                            ? new Date(
                                                                  field.value
                                                              )
                                                            : null
                                                    }
                                                    inputFormat="DD-MM-YYYY"
                                                    onChange={(date) => {
                                                        const formattedDate =
                                                            date
                                                                ? dayjs(
                                                                      date
                                                                  ).format(
                                                                      'YYYY-MM-DD'
                                                                  )
                                                                : ''
                                                        form.setFieldValue(
                                                            field.name,
                                                            formattedDate
                                                        )
                                                    }}
                                                />
                                            )}
                                        </Field>
                                    </FormItem>
                                    {/* Timeline Akhir Adendum*/}
                                    <FormItem
                                        label="Timeline Akhir Adendum"
                                        invalid={
                                            (errors.timeline_akhir_adendum &&
                                                touched.timeline_akhir_adendum) as boolean
                                        }
                                        errorMessage={
                                            errors.timeline_akhir_adendum
                                        }
                                    >
                                        <Field name="timeline_akhir_adendum">
                                            {({ field, form }: FieldProps) => (
                                                <DatePicker
                                                    placeholder="Pilih Tanggal"
                                                    value={
                                                        field.value
                                                            ? new Date(
                                                                  field.value
                                                              )
                                                            : null
                                                    }
                                                    inputFormat="DD-MM-YYYY"
                                                    onChange={(date) => {
                                                        const formattedDate =
                                                            date
                                                                ? dayjs(
                                                                      date
                                                                  ).format(
                                                                      'YYYY-MM-DD'
                                                                  )
                                                                : ''
                                                        form.setFieldValue(
                                                            field.name,
                                                            formattedDate
                                                        )
                                                    }}
                                                />
                                            )}
                                        </Field>
                                    </FormItem>
                                </div>

                                {/* Button Dialog Option */}
                                <div className="text-right mt-6">
                                    <Button
                                        className="ltr:mr-2 rtl:ml-2"
                                        variant="plain"
                                        type="button"
                                        disabled={isSubmitting}
                                        onClick={handleCloseAdendum}
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

            {/* Form Adendum Nilai Kontrak*/}
            <Formik
                initialValues={adendumNilaiKontrakFormInitialValues}
                validationSchema={AdendumNilaiKontrakSchema}
                enableReinitialize={true}
                onSubmit={handleAdendumNilaiKontrakSubmit}
            >
                {({ errors, touched, isSubmitting, values, setFieldValue }) => (
                    <>
                        <Dialog
                            isOpen={dialogAdendumNilaiKontrakOpen}
                            onClose={handleCloseAdendum}
                            onRequestClose={handleCloseAdendum}
                        >
                            <Form>
                                <h5 className="mb-4">Adendum Nilai Kontrak</h5>

                                {/* Nilai Kontrak Sebelum*/}
                                <FormItem
                                    label="Nilai Kontrak Awal Sebelum"
                                    invalid={
                                        (errors.nilai_kontrak_sebelum &&
                                            touched.nilai_kontrak_sebelum) as boolean
                                    }
                                    errorMessage={errors.nilai_kontrak_sebelum}
                                >
                                    <Field name="nilai_kontrak_sebelum">
                                        {({ field, form }: FieldProps) => (
                                            <NumericFormat
                                                {...field}
                                                disabled
                                                customInput={Input}
                                                placeholder="Nilai Kontrak"
                                                thousandSeparator="."
                                                decimalSeparator=","
                                                onValueChange={(values) => {
                                                    form.setFieldValue(
                                                        field.name,
                                                        values.value
                                                    )
                                                }}
                                            />
                                        )}
                                    </Field>
                                </FormItem>

                                {/* Nilai Kontrak Sesudah*/}
                                <FormItem
                                    label="Nilai Kontrak Sesudah"
                                    invalid={
                                        (errors.nilai_kontrak_sesudah &&
                                            touched.nilai_kontrak_sesudah) as boolean
                                    }
                                    errorMessage={errors.nilai_kontrak_sesudah}
                                >
                                    <Field name="nilai_kontrak_sesudah">
                                        {({ field, form }: FieldProps) => (
                                            <NumericFormat
                                                {...field}
                                                customInput={Input}
                                                placeholder="0"
                                                thousandSeparator="."
                                                decimalSeparator=","
                                                onValueChange={(values) => {
                                                    form.setFieldValue(
                                                        field.name,
                                                        values.value
                                                    )
                                                }}
                                            />
                                        )}
                                    </Field>
                                </FormItem>

                                {/* Button Dialog Option */}
                                <div className="text-right mt-6">
                                    <Button
                                        className="ltr:mr-2 rtl:ml-2"
                                        variant="plain"
                                        type="button"
                                        disabled={isSubmitting}
                                        onClick={handleCloseAdendum}
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
        </section>
    )
}
