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
    getAllBerkasesByTermin,
    getAllBerkasByProyek,
} from '../../ProyekEdit/store'
import { injectReducer } from '@/store'
import { Loading, ConfirmDialog, AdaptableCard } from '@/components/shared'
import { isEmpty } from 'lodash'
import { Field, FieldProps, Form, Formik } from 'formik'
import {
    apiCreateBerkasMultiple,
    apiDeleteBerkasProyek,
} from '@/services/BerkasProyekService'
import { HiOutlineTrash } from 'react-icons/hi'
import DescriptionSection from './DesriptionSection'
import { IoIosAdd } from 'react-icons/io'

injectReducer('proyekEdit', reducer)

// Schema validation for form
const BerkasTagihanSchema = Yup.object().shape({
    // idBerkas: Yup.string().required('Required'),
})

// Interface for form initial values
interface BerkasTagihanFormValues {
    idProject: string | null
    berkas: string[]
    idTerminProject: string | null
}

// Interface for API request
interface BastpFormModel {
    idProject: string
    keterangan: string
    idBerkas: string
    // Add any other properties needed for the API
}

// Interface for status change confirmation
interface StatusChangeItem {
    id: string
    nama: string
    status: boolean
    newStatus: boolean
}

export default function BerkasTagihan() {
    const dispatch = useAppDispatch()
    const [dialogIsOpen, setIsOpen] = useState(false)
    const [selectedBerkasTagihan, setSelectedBerkasTagihan] = useState<
        string | null
    >(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [isEditBerkasTagihanMode, setIsEditBerkasTagihanMode] =
        useState(false)
    const [selectedBerkasTagihanToEdit, setSelectedBerkasTagihanToEdit] =
        useState<any>(null)
    const [berkasTagihanDialogIsOpen, setBerkasTagihanDialogIsOpen] =
        useState(false)
    const [berkasTagihanFormInitialValues, setBerkasTagihanFormInitialValues] =
        useState<BerkasTagihanFormValues>({
            berkas: [],
            idTerminProject: null,
            idProject: null,
        })
    const user = useAppSelector((state) => state.auth.user)
    // New state for status change confirmation
    const [statusChangeDialogOpen, setStatusChangeDialogOpen] = useState(false)
    const [statusChangeItem, setStatusChangeItem] =
        useState<StatusChangeItem | null>(null)

    const {
        proyekData,
        terminsData,
        selectBerkasData,
        getAllBerkasByProyekData,
    } = useAppSelector((state) => state.proyekEdit.data)

    const {
        loading,
        loadingTermins,
        loadingSelectBerkas,
        loadingGetAllBerkasByProyek,
    } = useAppSelector((state) => state.proyekEdit.data)

    // Initial values for form
    const initialValues: BerkasTagihanFormValues = {
        idProject: '',
        keterangan: '',
        idBerkas: '',
    }

    // Updated onCheck function to open confirmation dialog
    const onCheck =
        (item: any) => (checked: boolean, e: ChangeEvent<HTMLInputElement>) => {
            // Set the item and new status to be confirmed
            setStatusChangeItem({
                id: item.id,
                nama: item.nama,
                status: item.status,
                newStatus: checked,
            })

            // Open the confirmation dialog
            setStatusChangeDialogOpen(true)

            // Prevent default checkbox behavior to wait for confirmation
            e.preventDefault()
        }

    // Function to handle status change confirmation
    const confirmStatusChange = async () => {
        if (!statusChangeItem) return

        try {
            const data = {
                id: statusChangeItem.id,
                status: statusChangeItem.newStatus,
            }

            // Dispatch action to update
            const result = await dispatch(updateBerkasProyekStatus(data))

            // Show success notification if update was successful
            if (result.payload.statusCode === 200) {
                popNotification('updated')
            } else {
                toast.push(
                    <Notification
                        title="Error updating status"
                        type="danger"
                        duration={2500}
                    >
                        {result.payload.message}
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
            }
        } catch (error) {
            console.error('Error updating status:', error)

            // Show error notification
            toast.push(
                <Notification
                    title="Error updating status"
                    type="danger"
                    duration={2500}
                >
                    An error occurred while updating the status
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        } finally {
            // Close dialog and reset state
            setStatusChangeDialogOpen(false)
            setStatusChangeItem(null)

            // Refresh data to show updated list
            const path = location.pathname.substring(
                location.pathname.lastIndexOf('/') + 1
            )
            fetchData({ id: path })
        }
    }

    // Function to cancel status change
    const cancelStatusChange = () => {
        setStatusChangeDialogOpen(false)
        setStatusChangeItem(null)
    }

    const fetchData = (data: { id: string }) => {
        dispatch(getProyek(data))
        dispatch(selectBerkas())
        dispatch(getAllBerkasByProyek(data))
    }

    const openDialog = () => {
        setIsOpen(true)
    }

    const onDialogClose = (e: React.MouseEvent) => {
        setIsOpen(false)
    }

    const openDeleteDialog = (id: string) => {
        setSelectedBerkasTagihan(id)
        setDeleteDialogOpen(true)
    }

    const onDeleteDialogClose = () => {
        setDeleteDialogOpen(false)
        setSelectedBerkasTagihan(null)
    }

    const onBerkasTagihanDialogClose = () => {
        setBerkasTagihanDialogIsOpen(false)
        // setIsEditBerkasTagihanMode(false)
        setSelectedBerkasTagihanToEdit(null)
    }

    const onDelete = async () => {
        if (!selectedBerkasTagihan) return

        try {
            const success = await apiDeleteBerkasProyek<boolean>({
                id: selectedBerkasTagihan,
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
            setSelectedBerkasTagihan(null)
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

    const handleBerkasTagihanSubmit = async (
        values: BerkasTagihanFormValues,
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
                berkas: values.berkas,
                idTerminProject: berkasTagihanFormInitialValues.idTerminProject,
                idProject: path,
            }

            const successCreateBerkasProyek = await apiCreateBerkasMultiple<
                boolean,
                BastpFormModel
            >(requestData)

            if (successCreateBerkasProyek) {
                popNotification('added')
                fetchData({ id: path })
            }
        } catch (error) {
            console.error('Error creating BASTP:', error)
        } finally {
            setSubmitting(false)
            setBerkasTagihanDialogIsOpen(false)
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

    const handleOpenDialog = (idTermin: string) => {
        setIsEditBerkasTagihanMode(idTermin)
        setSelectedBerkasTagihanToEdit(idTermin)

        setBerkasTagihanFormInitialValues({
            ...berkasTagihanFormInitialValues,
            idTerminProject: idTermin, // Simpan ID termin yang dipilih
        })

        setBerkasTagihanDialogIsOpen(true)
    }

    return (
        <Loading
            loading={
                loading ||
                loadingTermins ||
                loadingSelectBerkas ||
                loadingGetAllBerkasByProyek
            }
        >
            <>
                <AdaptableCard divider className="border-none">
                    <div className="flex justify-between items-center ">
                        <DescriptionSection
                            title="Informasi berkas Tagihan"
                            desc="Informasi berkas tagihan proyek"
                        />
                    </div>
                </AdaptableCard>
                <div className="flex flex-col">
                    {!isEmpty(terminsData) && (
                        <>
                            {terminsData?.length > 0 ? (
                                terminsData.map((item: any, index) => {
                                    const berkasProyekPerTermin =
                                        getAllBerkasByProyekData?.data?.filter(
                                            (data) =>
                                                data.idTerminProject === item.id
                                        ) ?? []

                                    return (
                                        <div
                                            key={item.id}
                                            className={`flex flex-row justify-between bg-indigo-50 items-center  p-4
                                        ${
                                            index === terminsData?.length - 1
                                                ? 'rounded-b-md border border-indigo-400'
                                                : index === 0
                                                ? 'rounded-t-md border-t border-x border-indigo-400'
                                                : 'border-t border-x border-indigo-400'
                                        }
                                            `}
                                        >
                                            <div className="flex flex-col space-y-1">
                                                <div className="text-gray-900 dark:text-gray-100 font-semibold">
                                                    Termin {index + 1}
                                                </div>
                                                {berkasProyekPerTermin.length >
                                                0 ? (
                                                    berkasProyekPerTermin.map(
                                                        (itemBerkas: any) => (
                                                            <div
                                                                key={
                                                                    itemBerkas.id
                                                                }
                                                                className="flex flex-row items-center "
                                                            >
                                                                {user.authority !==
                                                                'Owner' ? (
                                                                    <>
                                                                        <Checkbox
                                                                            checked={
                                                                                itemBerkas.status
                                                                            }
                                                                            onChange={(
                                                                                checked,
                                                                                e
                                                                            ) =>
                                                                                onCheck(
                                                                                    itemBerkas
                                                                                )(
                                                                                    checked,
                                                                                    e
                                                                                )
                                                                            }
                                                                            className="flex items-center"
                                                                        >
                                                                            <div>
                                                                                {
                                                                                    itemBerkas.nama
                                                                                }
                                                                            </div>
                                                                        </Checkbox>
                                                                        <Button
                                                                            type="button"
                                                                            shape="circle"
                                                                            variant="plain"
                                                                            size="xs"
                                                                            className="text-red-500"
                                                                            icon={
                                                                                <HiOutlineTrash />
                                                                            }
                                                                            onClick={() =>
                                                                                openDeleteDialog(
                                                                                    itemBerkas.id
                                                                                )
                                                                            }
                                                                        />
                                                                    </>
                                                                ) : (
                                                                    <div>
                                                                        {
                                                                            itemBerkas.nama
                                                                        }
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )
                                                    )
                                                ) : (
                                                    <div>-</div>
                                                )}
                                            </div>
                                            {/* anchor */}
                                            {user.authority !== 'Owner' && (
                                                <div>
                                                    <Button
                                                        type="button"
                                                        shape="circle"
                                                        variant="solid"
                                                        size="sm"
                                                        className="w-fit text-xs text-indigo-500"
                                                        icon={<IoIosAdd />}
                                                        onClick={() =>
                                                            handleOpenDialog(
                                                                item.id
                                                            )
                                                        }
                                                    >
                                                        Tambah Berkas
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })
                            ) : (
                                <div>Tidak ada data berkas Tagihan</div>
                            )}
                        </>
                    )}
                </div>

                {/* Delete Confirmation Dialog */}
                <ConfirmDialog
                    isOpen={deleteDialogOpen}
                    onClose={onDeleteDialogClose}
                    onRequestClose={onDeleteDialogClose}
                    onCancel={onDeleteDialogClose}
                    type="danger"
                    title="Delete BASTP"
                    onConfirm={onDelete}
                >
                    <p>Apakah kamu yakin ingin menghapus berkas Tagihan ini?</p>
                </ConfirmDialog>

                {/* Status Change Confirmation Dialog */}
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
                        Apakah kamu yakin ingin mengubah status berkas "
                        {statusChangeItem?.nama}" menjadi{' '}
                        <strong>
                            {statusChangeItem?.newStatus
                                ? 'aktif'
                                : 'tidak aktif'}
                        </strong>
                        ?
                    </p>
                </ConfirmDialog>

                {/* Dialog Form for adding berkas tagihan */}
                <Formik
                    initialValues={berkasTagihanFormInitialValues}
                    validationSchema={BerkasTagihanSchema}
                    onSubmit={handleBerkasTagihanSubmit}
                    enableReinitialize={true}
                >
                    {({
                        errors,
                        touched,
                        isSubmitting,
                        values,
                        setFieldValue,
                    }) => (
                        <>
                            <Dialog
                                isOpen={berkasTagihanDialogIsOpen}
                                onClose={onBerkasTagihanDialogClose}
                                onRequestClose={onBerkasTagihanDialogClose}
                            >
                                <Form>
                                    <h5 className="mb-4">Pilih Berkas</h5>

                                    {/* Form Bastp Tanggal Pembayaran */}
                                    <FormItem
                                        label="Pilih Berkas Tagihan"
                                        invalid={
                                            (errors.berkas &&
                                                touched.berkas) as boolean
                                        }
                                        errorMessage={errors.berkas}
                                    >
                                        <Field name="berkas">
                                            {({ field, form }: FieldProps) => {
                                                // Ubah format data dari API menjadi format yang bisa digunakan oleh react-select
                                                const options =
                                                    selectBerkasData?.data?.map(
                                                        (item: any) => ({
                                                            value: item.id,
                                                            label: item.nama,
                                                        })
                                                    )
                                                return (
                                                    <Select
                                                        isMulti
                                                        placeholder="Please Select"
                                                        defaultValue={[]}
                                                        options={options}
                                                        value={options.filter(
                                                            (option: any) =>
                                                                field.value?.includes(
                                                                    option.value
                                                                )
                                                        )}
                                                        onChange={(
                                                            selectedOptions: any
                                                        ) => {
                                                            const values =
                                                                selectedOptions.map(
                                                                    (
                                                                        option: any
                                                                    ) =>
                                                                        option.value
                                                                )
                                                            form.setFieldValue(
                                                                'berkas',
                                                                values
                                                            )
                                                        }}
                                                    />
                                                )
                                            }}
                                        </Field>
                                    </FormItem>

                                    {/* Button Dialog Option */}
                                    <div className="text-right mt-6">
                                        <Button
                                            className="ltr:mr-2 rtl:ml-2"
                                            variant="plain"
                                            onClick={onBerkasTagihanDialogClose}
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
                                            {'Simpan'}
                                        </Button>
                                    </div>
                                </Form>
                            </Dialog>
                        </>
                    )}
                </Formik>
            </>
        </Loading>
    )
}
