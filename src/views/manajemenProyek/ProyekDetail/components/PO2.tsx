;<Formik
    enableReinitialize
    initialValues={initialDetailValues}
    validationSchema={detailItemValidationSchema}
    onSubmit={() => {
        // Form submission is handled by save button
    }}
>
    {(detailFormikProps) => {
        const {
            values: detailValues,
            errors: detailErrors,
            touched: detailTouched,
            setFieldValue: setDetailField,
        } = detailFormikProps

        // Function to calculate values in real-time
        const calculateValues = () => {
            // Extract numeric values from formatted strings
            const volume = extractNumberFromString(detailValues.tempVolume) || 0
            const hargaSatuanMaterial =
                extractNumberFromString(detailValues.tempHargaSatuanMaterial) ||
                0
            const hargaSatuanJasa =
                extractNumberFromString(detailValues.tempHargaSatuanJasa) || 0

            // Calculate values
            const jumlahHargaMaterial = hargaSatuanMaterial * volume
            const jumlahHargaJasa = hargaSatuanJasa * volume
            const total = jumlahHargaMaterial + jumlahHargaJasa

            // Update form fields
            setDetailField(
                'tempJumlahHargaMaterial',
                jumlahHargaMaterial.toString()
            )
            setDetailField('tempJumlahHargaJasa', jumlahHargaJasa.toString())
            setDetailField('tempJumlah', total.toString())
        }

        // Call calculateValues whenever relevant fields change
        useEffect(() => {
            calculateValues()
        }, [
            detailValues.tempVolume,
            detailValues.tempHargaSatuanMaterial,
            detailValues.tempHargaSatuanJasa,
        ])

        const handleAddDetail = (itemIndex: number) => {
            if (itemsByProyekData) {
                setCurrentItemIndex(itemIndex)
                setShowDetailForm(true)
                setEditDetailIndex(null)
                setShowItemForm(false)

                // Set the item ID for the detail
                setDetailField('tempIdItem', itemsByProyekData[itemIndex].id)

                // Reset other temp values
                setDetailField('tempUraian', '')
                setDetailField('tempSatuan', '')
                setDetailField('tempVolume', '')
                setDetailField('tempHargaSatuanMaterial', '')
                setDetailField('tempHargaSatuanJasa', '')
                setDetailField('tempJumlahHargaMaterial', '0')
                setDetailField('tempJumlahHargaJasa', '0')
                setDetailField('tempJumlah', '0')
            }
        }

        const handleSaveDetail = async () => {
            // Validate fields
            if (
                !detailErrors.tempUraian &&
                !detailErrors.tempSatuan &&
                !detailErrors.tempVolume &&
                !detailErrors.tempHargaSatuanMaterial &&
                !detailErrors.tempHargaSatuanJasa
            ) {
                setIsSubmitting(true)

                const requestData = {
                    uraian: detailValues.tempUraian,
                    idSatuan: detailValues.tempSatuan,
                    volume: extractNumberFromString(detailValues.tempVolume),
                    harga_satuan_material: extractNumberFromString(
                        detailValues.tempHargaSatuanMaterial
                    ),
                    harga_satuan_jasa: extractNumberFromString(
                        detailValues.tempHargaSatuanJasa
                    ),
                    jumlah_harga_material: extractNumberFromString(
                        detailValues.tempJumlahHargaMaterial
                    ),
                    jumlah_harga_jasa: extractNumberFromString(
                        detailValues.tempJumlahHargaJasa
                    ),
                    jumlah: extractNumberFromString(detailValues.tempJumlah),
                    idItemProject: detailValues.tempIdItem,
                }

                try {
                    let result

                    if (
                        editDetailIndex !== null &&
                        currentItemIndex !== null &&
                        itemsByProyekData
                    ) {
                        // Handle edit with API call
                        const detailId =
                            itemsByProyekData[currentItemIndex]
                                .DetailItemProjects[editDetailIndex].id

                        result = await apiUpdateDetailItem({
                            id: detailId,
                            ...requestData,
                        })
                    } else {
                        result = await apiCreateDetailItem(requestData)
                    }

                    setIsSubmitting(false)

                    if (
                        result &&
                        result.data?.statusCode >= 200 &&
                        result.data?.statusCode < 300
                    ) {
                        // Refresh data
                        dispatch(
                            getItemsByProyek({
                                id: projectId,
                            })
                        )

                        // Show success notification
                        popNotification(
                            editDetailIndex !== null
                                ? 'diperbarui'
                                : 'ditambahkan'
                        )

                        // Reset form and close
                        setDetailField('tempUraian', '')
                        setDetailField('tempSatuan', '')
                        setDetailField('tempVolume', '')
                        setDetailField('tempHargaSatuanMaterial', '')
                        setDetailField('tempHargaSatuanJasa', '')
                        setDetailField('tempJumlahHargaMaterial', '0')
                        setDetailField('tempJumlahHargaJasa', '0')
                        setDetailField('tempJumlah', '0')
                        setShowDetailForm(false)
                        setEditDetailIndex(null)
                    } else {
                        // Show error notification
                        toast.push(
                            <Notification
                                title="Error"
                                type="danger"
                                duration={2500}
                            >
                                {result
                                    ? result.data?.message
                                    : 'Gagal menambahkan detail item'}
                            </Notification>,
                            {
                                placement: 'top-center',
                            }
                        )
                    }
                } catch (error) {
                    setIsSubmitting(false)
                    console.error('Error:', error)

                    // Show generic error notification
                    toast.push(
                        <Notification
                            title="Error"
                            type="danger"
                            duration={2500}
                        >
                            Terjadi kesalahan saat memproses permintaan
                        </Notification>,
                        {
                            placement: 'top-center',
                        }
                    )
                }
            }
        }

        // ... (keep all other existing functions unchanged)

        return (
            <>
                {/* Form untuk input detail item */}
                {showDetailForm && (
                    <div className="mb-4 border bg-slate-50 rounded-md p-4">
                        <h6 className="mb-3">
                            {editDetailIndex !== null
                                ? 'Edit Detail Item'
                                : 'Tambah Detail Item Baru'}
                        </h6>

                        <FormContainer>
                            <div className="grid grid-cols-2 gap-4">
                                {/* Uraian */}
                                <FormItem
                                    label="Uraian"
                                    errorMessage={
                                        detailErrors.tempUraian &&
                                        detailTouched.tempUraian
                                            ? detailErrors.tempUraian
                                            : ''
                                    }
                                    invalid={
                                        !!(
                                            detailErrors.tempUraian &&
                                            detailTouched.tempUraian
                                        )
                                    }
                                >
                                    <Field
                                        type="text"
                                        autoComplete="off"
                                        name="tempUraian"
                                        placeholder="Masukkan uraian"
                                        component={Input}
                                    />
                                </FormItem>

                                {/* Satuan */}
                                <FormItem
                                    label="Satuan"
                                    errorMessage={
                                        detailErrors.tempSatuan &&
                                        detailTouched.tempSatuan
                                            ? detailErrors.tempSatuan
                                            : ''
                                    }
                                    invalid={
                                        !!(
                                            detailErrors.tempSatuan &&
                                            detailTouched.tempSatuan
                                        )
                                    }
                                >
                                    <Field name="tempSatuan">
                                        {({ field, form }: FieldProps) => {
                                            const selectedSatuan = field.value
                                                ? satuansData.data?.find(
                                                      (satuan) =>
                                                          satuan.id ===
                                                          field.value
                                                  )
                                                : null

                                            const satuanOptions =
                                                satuansData.data?.map(
                                                    (satuan) => ({
                                                        value: satuan.id,
                                                        label: `${satuan.satuan}`,
                                                    })
                                                )

                                            return (
                                                <Select
                                                    field={field}
                                                    form={form}
                                                    options={satuanOptions}
                                                    value={
                                                        selectedSatuan
                                                            ? {
                                                                  value: selectedSatuan.id,
                                                                  label: `${selectedSatuan.satuan}`,
                                                              }
                                                            : null
                                                    }
                                                    placeholder="Pilih satuan"
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

                                {/* Harga Satuan Material */}
                                <FormItem
                                    label="Harga Satuan Material"
                                    errorMessage={
                                        detailErrors.tempHargaSatuanMaterial &&
                                        detailTouched.tempHargaSatuanMaterial
                                            ? detailErrors.tempHargaSatuanMaterial
                                            : ''
                                    }
                                    invalid={
                                        !!(
                                            detailErrors.tempHargaSatuanMaterial &&
                                            detailTouched.tempHargaSatuanMaterial
                                        )
                                    }
                                >
                                    <Field name="tempHargaSatuanMaterial">
                                        {({ field, form }: FieldProps) => (
                                            <NumericFormat
                                                thousandSeparator="."
                                                decimalSeparator=","
                                                prefix="Rp "
                                                placeholder="Masukkan harga satuan material"
                                                customInput={Input}
                                                {...field}
                                                onValueChange={(values) => {
                                                    const { value } = values
                                                    form.setFieldValue(
                                                        field.name,
                                                        value
                                                    )
                                                    calculateValues()
                                                }}
                                            />
                                        )}
                                    </Field>
                                </FormItem>

                                {/* Jumlah Harga Material */}
                                <FormItem label="Jumlah Harga Material">
                                    <Field name="tempJumlahHargaMaterial">
                                        {({ field }: FieldProps) => (
                                            <NumericFormat
                                                disabled
                                                thousandSeparator="."
                                                decimalSeparator=","
                                                prefix="Rp "
                                                placeholder="Jumlah harga material"
                                                customInput={Input}
                                                {...field}
                                                readOnly
                                                value={field.value || '0'}
                                            />
                                        )}
                                    </Field>
                                </FormItem>

                                {/* Harga Satuan Jasa */}
                                <FormItem
                                    label="Harga Satuan Jasa"
                                    errorMessage={
                                        detailErrors.tempHargaSatuanJasa &&
                                        detailTouched.tempHargaSatuanJasa
                                            ? detailErrors.tempHargaSatuanJasa
                                            : ''
                                    }
                                    invalid={
                                        !!(
                                            detailErrors.tempHargaSatuanJasa &&
                                            detailTouched.tempHargaSatuanJasa
                                        )
                                    }
                                >
                                    <Field name="tempHargaSatuanJasa">
                                        {({ field, form }: FieldProps) => (
                                            <NumericFormat
                                                thousandSeparator="."
                                                decimalSeparator=","
                                                prefix="Rp "
                                                placeholder="Masukkan harga satuan jasa"
                                                customInput={Input}
                                                {...field}
                                                onValueChange={(values) => {
                                                    const { value } = values
                                                    form.setFieldValue(
                                                        field.name,
                                                        value
                                                    )
                                                    calculateValues()
                                                }}
                                            />
                                        )}
                                    </Field>
                                </FormItem>

                                {/* Jumlah Harga Jasa */}
                                <FormItem label="Jumlah Harga Jasa">
                                    <Field name="tempJumlahHargaJasa">
                                        {({ field }: FieldProps) => (
                                            <NumericFormat
                                                disabled
                                                thousandSeparator="."
                                                decimalSeparator=","
                                                prefix="Rp "
                                                placeholder="Jumlah harga jasa"
                                                customInput={Input}
                                                {...field}
                                                readOnly
                                                value={field.value || '0'}
                                            />
                                        )}
                                    </Field>
                                </FormItem>

                                {/* Volume */}
                                <FormItem
                                    label="Volume"
                                    errorMessage={
                                        detailErrors.tempVolume &&
                                        detailTouched.tempVolume
                                            ? detailErrors.tempVolume
                                            : ''
                                    }
                                    invalid={
                                        !!(
                                            detailErrors.tempVolume &&
                                            detailTouched.tempVolume
                                        )
                                    }
                                >
                                    <Field name="tempVolume">
                                        {({ field, form }: FieldProps) => (
                                            <NumericFormat
                                                thousandSeparator="."
                                                decimalSeparator=","
                                                placeholder="Masukkan volume"
                                                customInput={Input}
                                                {...field}
                                                onValueChange={(values) => {
                                                    const { value } = values
                                                    form.setFieldValue(
                                                        field.name,
                                                        value
                                                    )
                                                    calculateValues()
                                                }}
                                            />
                                        )}
                                    </Field>
                                </FormItem>

                                {/* Total */}
                                <FormItem label="Total">
                                    <Field name="tempJumlah">
                                        {({ field }: FieldProps) => (
                                            <NumericFormat
                                                disabled
                                                thousandSeparator="."
                                                decimalSeparator=","
                                                prefix="Rp "
                                                placeholder="Total"
                                                customInput={Input}
                                                {...field}
                                                readOnly
                                                value={field.value || '0'}
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                            </div>

                            <div className="flex justify-end space-x-2 mt-4">
                                <Button
                                    size="sm"
                                    variant="plain"
                                    onClick={handleCancelDetail}
                                    type="button"
                                >
                                    Batal
                                </Button>
                                <Button
                                    size="sm"
                                    variant="solid"
                                    onClick={handleSaveDetail}
                                    type="button"
                                    loading={isSubmitting}
                                >
                                    Simpan
                                </Button>
                            </div>
                        </FormContainer>
                    </div>
                )}

                {/* ... (keep the rest of the code unchanged) */}
            </>
        )
    }}
</Formik>
