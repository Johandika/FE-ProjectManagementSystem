import { useAppDispatch } from '@/store'
import { Field, FieldProps, Form, Formik } from 'formik'
import React from 'react'
import { getTenders, setProgressConfirmation, useAppSelector } from '../store'
import {
    Button,
    Dialog,
    FormItem,
    Input,
    Notification,
    toast,
} from '@/components/ui'
import { NumericFormat } from 'react-number-format'
import * as Yup from 'yup'
import { apiUpdateProgressTender } from '@/services/TenderService'

const ProgressSchema = Yup.object().shape({
    progress: Yup.number()
        .required('Progress wajib diisi')
        .min(0, 'Progress tidak boleh kurang dari 0')
        .max(100, 'Progress tidak boleh lebih dari 100'),
})

export default function TenderUpdateProgress() {
    const dispatch = useAppDispatch()

    const progress = useAppSelector((state) => state.tenderList.data.progress)
    const selectedTender = useAppSelector(
        (state) => state.tenderList.data.selectedTender
    )
    const tableData = useAppSelector((state) => state.tenderList.data.tableData)
    const progressConfirmation = useAppSelector(
        (state) => state.tenderList.data.progressConfirmation
    )

    const progressInitialValue = {
        progress: progress || 0,
    }

    const handleCloseProgress = () => {
        dispatch(setProgressConfirmation(false))
    }
    const handleSubmitProgress = async (values, { setSubmitting }) => {
        setSubmitting(true)
        const success = await apiUpdateProgressTender({
            id: selectedTender,
            progress: values.progress,
        })

        if (success) {
            dispatch(getTenders(tableData))
            dispatch(setProgressConfirmation(false))
            toast.push(
                <Notification
                    title={'Progress Updated'}
                    type="success"
                    duration={2500}
                >
                    Tender progress updated successfully.
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        }
        setSubmitting(false)
    }

    return (
        <Formik
            initialValues={progressInitialValue}
            validationSchema={ProgressSchema}
            enableReinitialize={true}
            onSubmit={handleSubmitProgress}
        >
            {({ errors, touched, isSubmitting, values, setFieldValue }) => (
                <>
                    <Dialog
                        isOpen={progressConfirmation}
                        onClose={handleCloseProgress}
                        onRequestClose={handleCloseProgress}
                    >
                        <Form>
                            <h5 className="mb-4">Update Progress</h5>

                            {/* Nilai Kontrak Sesudah*/}
                            <FormItem
                                label="Progress(%)"
                                invalid={
                                    (errors.progress &&
                                        touched.progress) as boolean
                                }
                                errorMessage={errors.progress}
                            >
                                <Field name="progress">
                                    {({ field, form }: FieldProps) => (
                                        <NumericFormat
                                            {...field}
                                            customInput={Input}
                                            placeholder="0"
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
                                    onClick={handleCloseProgress}
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
    )
}
