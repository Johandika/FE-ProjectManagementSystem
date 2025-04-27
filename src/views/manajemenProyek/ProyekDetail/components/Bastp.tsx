import {
    Button,
    Checkbox,
    Dialog,
    FormItem,
    Input,
    Notification,
    Select,
    toast,
} from '@/components/ui'
import { ChangeEvent, useEffect, useState } from 'react'
import * as Yup from 'yup'

import reducer, {
    useAppDispatch,
    getProyek,
    selectBerkas,
    useAppSelector,
    updateBerkasProyekStatus,
    // Add these new actions:
} from '../../ProyekEdit/store'
import { injectReducer } from '@/store'
import { Loading, ConfirmDialog } from '@/components/shared'
import { isEmpty } from 'lodash'
import { Field, FieldProps, Form, Formik } from 'formik'
import {
    apiCreateBerkasProyek,
    apiDeleteBerkasProyek,
    apiUpdateStatusBerkasProyek,
} from '@/services/BerkasProyekService'
import { HiOutlineTrash } from 'react-icons/hi'

injectReducer('proyekEdit', reducer)

// Schema validation for form
const BastpSchema = Yup.object().shape({
    idBerkas: Yup.string().required('Required'),
})

// Interface for form initial values
interface BastpFormValues {
    idProject: string
    keterangan: string
    idBerkas: string
}

// Interface for API request
interface BastpFormModel {
    idProject: string
    keterangan: string
    idBerkas: string
    // Add any other properties needed for the API
}

export default function Bastp() {
    const dispatch = useAppDispatch()
    const [dialogIsOpen, setIsOpen] = useState(false)
    const [selectedBastp, setSelectedBastp] = useState<string | null>(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

    const proyekData = useAppSelector(
        (state) => state.proyekEdit.data.proyekData
    )
    const selectBerkasData = useAppSelector(
        (state) => state.proyekEdit.data.selectBerkasData.data
    )

    const loading = useAppSelector((state) => state.proyekEdit.data.loading)

    const loadingSelectBerkas = useAppSelector(
        (state) => state.proyekEdit.data.loadingSelectBerkas
    )

    // Initial values for form
    const initialValues: BastpFormValues = {
        idProject: '',
        keterangan: '',
        idBerkas: '',
    }

    // Fungsi handler untuk checkbox
    const onCheck =
        (item: any) =>
        async (checked: boolean, e: ChangeEvent<HTMLInputElement>) => {
            // Buat objek baru dengan status yang diperbarui
            const updatedItem = {
                ...item,
                status: checked,
            }

            const data = { id: updatedItem.id, status: updatedItem.status }

            // Dispatch action untuk update
            await dispatch(updateBerkasProyekStatus(data))
        }

    const fetchData = (data: { id: string }) => {
        dispatch(getProyek(data))
        dispatch(selectBerkas())
    }

    const openDialog = () => {
        setIsOpen(true)
    }

    const onDialogClose = (e: React.MouseEvent) => {
        console.log('onDialogClose', e)
        setIsOpen(false)
    }

    const openDeleteDialog = (id: string) => {
        setSelectedBastp(id)
        setDeleteDialogOpen(true)
    }

    const onDeleteDialogClose = () => {
        setDeleteDialogOpen(false)
        setSelectedBastp(null)
    }

    const onDelete = async () => {
        if (!selectedBastp) return

        try {
            const success = await apiDeleteBerkasProyek<boolean>({
                id: selectedBastp,
            })

            if (success) {
                // Get the project ID from the URL
                const path = location.pathname.substring(
                    location.pathname.lastIndexOf('/') + 1
                )

                popNotification('deleted')
                // Refresh data to show updated list
                fetchData({ id: path })
            }
        } catch (error) {
            console.error('Error deleting BASTP:', error)
            toast.push(
                <Notification
                    title="Error deleting BASTP"
                    type="danger"
                    duration={2500}
                >
                    An error occurred while deleting the BASTP
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        } finally {
            setDeleteDialogOpen(false)
            setSelectedBastp(null)
        }
    }

    const popNotification = (keyword: string) => {
        toast.push(
            <Notification
                title={`Successfully ${keyword}`}
                type="success"
                duration={2500}
            >
                BASTP successfully {keyword}
            </Notification>,
            {
                placement: 'top-center',
            }
        )
    }

    const handleSubmit = async (
        values: BastpFormValues,
        { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
    ) => {
        setSubmitting(true)

        try {
            // Get the project ID from the URL
            const path = location.pathname.substring(
                location.pathname.lastIndexOf('/') + 1
            )

            // Create a new object with the form values and add the idProject
            const requestData = {
                ...values,
                idProject: path,
            }
            console.log('requestData', requestData)

            const successCreateBerkasProyek = await apiCreateBerkasProyek<
                boolean,
                BastpFormModel
            >(requestData)

            if (successCreateBerkasProyek) {
                popNotification('added')
                // Refresh data to show new BASTP
                fetchData({ id: path })
            }
        } catch (error) {
            console.error('Error creating BASTP:', error)
        } finally {
            setSubmitting(false)
            setIsOpen(false)
        }
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
        <Loading loading={loading}>
            <>
                <div className="flex flex-col gap-4  py-6">
                    {!isEmpty(proyekData) && (
                        <>
                            {proyekData.BerkasProjects.length > 0 ? (
                                proyekData.BerkasProjects?.map((item: any) => (
                                    <div
                                        key={item.id}
                                        className="flex flex-row justify-between items-center"
                                    >
                                        <Checkbox
                                            defaultChecked={item.status}
                                            onChange={(checked, e) =>
                                                onCheck(item)(checked, e)
                                            }
                                        >
                                            {item.nama}
                                        </Checkbox>
                                        <Button
                                            size="xs"
                                            variant="solid"
                                            color="red"
                                            onClick={() =>
                                                openDeleteDialog(item.id)
                                            }
                                            className="flex flex-row items-center gap-2 text-red-500"
                                        >
                                            <HiOutlineTrash />
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <div>Tidak ada data berkas BASTP</div>
                            )}
                        </>
                    )}
                </div>
                <div className="w-full flex justify-end">
                    <Button size="sm" variant="solid" onClick={openDialog}>
                        Tambah BASTP
                    </Button>
                </div>

                {/* Delete Confirmation Dialog */}
                <ConfirmDialog
                    isOpen={deleteDialogOpen}
                    onClose={onDeleteDialogClose}
                    onRequestClose={onDeleteDialogClose}
                    type="danger"
                    title="Delete BASTP"
                    onConfirm={onDelete}
                >
                    <p>Apakah kamu yakin ingin menghapus berkas BASTP ini?</p>
                </ConfirmDialog>

                {/* Dialog Form for adding BASTP */}
                <Formik
                    initialValues={initialValues}
                    validationSchema={BastpSchema}
                    onSubmit={handleSubmit}
                >
                    {({ errors, touched, isSubmitting }) => (
                        <Dialog
                            isOpen={dialogIsOpen}
                            onClose={onDialogClose}
                            onRequestClose={onDialogClose}
                        >
                            <Form>
                                <h5 className="mb-4">Tambah BASTP</h5>

                                {/* Form */}
                                <div className="flex flex-col max-h-[60vh] border-b-[1px] pb-4 ">
                                    {/* Nama */}

                                    <FormItem
                                        label="Pilih Berkas BASTP"
                                        invalid={
                                            (errors.idBerkas &&
                                                touched.idBerkas) as boolean
                                        }
                                        errorMessage={errors.idBerkas}
                                    >
                                        <Field name="idBerkas">
                                            {({ field, form }: FieldProps) => {
                                                // Find the selected client based on current idClient value
                                                const selectedBerkas =
                                                    field.value
                                                        ? selectBerkasData.find(
                                                              (berkas) =>
                                                                  berkas.id ===
                                                                  field.value
                                                          )
                                                        : null

                                                // Map clients to options format required by Select component
                                                const berkasOption =
                                                    selectBerkasData.map(
                                                        (berkas) => ({
                                                            value: berkas.id,
                                                            label: `${berkas.nama}`,
                                                        })
                                                    )

                                                return (
                                                    <Select
                                                        field={field}
                                                        form={form}
                                                        options={berkasOption}
                                                        value={
                                                            selectedBerkas
                                                                ? {
                                                                      value: selectedBerkas.id,
                                                                      label: `${selectedBerkas.nama}`,
                                                                  }
                                                                : null
                                                        }
                                                        placeholder="Pilih berkas"
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
                                </div>

                                {/* Button Dialog Option */}
                                <div className="text-right mt-6">
                                    <Button
                                        className="ltr:mr-2 rtl:ml-2"
                                        variant="plain"
                                        onClick={onDialogClose}
                                        type="button"
                                        disabled={isSubmitting}
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
                    )}
                </Formik>
            </>
        </Loading>
    )
}
