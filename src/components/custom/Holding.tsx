// import { Button, DatePicker, FormItem } from '../ui'
// import { Field, FieldProps, Form, Formik } from 'formik'
// import * as Yup from 'yup'
// import dayjs from 'dayjs'
// import SimplePieMini from './SimplePieMini'

// const BastpSchema = Yup.object().shape({
//     tanggal_awal: Yup.string().required('Wajib diisi'),
//     tanggal_akhir: Yup.string().required('Wajib diisi'),
// })

// export default function Holding({
//     dataAwal,
//     tanggalAwal,
//     tanggalAkhir,
//     setTanggalAwal,
//     setTanggalAkhir,
//     handleFilter,
// }: any) {
//     // Format number to currency (IDR)
//     const formatCurrency = (value: number) => {
//         return new Intl.NumberFormat('id-ID', {
//             style: 'currency',
//             currency: 'IDR',
//             minimumFractionDigits: 0,
//             maximumFractionDigits: 0,
//         }).format(value)
//     }

//     console.log('data awal', dataAwal)

//     return (
//         <div>
//             {/* Filter Tanggal */}
//             <Formik
//                 initialValues={{
//                     tanggal_awal: tanggalAwal,
//                     tanggal_akhir: tanggalAkhir,
//                 }}
//                 validationSchema={BastpSchema}
//                 onSubmit={(values) => {
//                     handleFilter(values)
//                 }}
//                 enableReinitialize
//             >
//                 {({ errors, touched }) => (
//                     <Form className="flex flex-col justify-between md:flex-row gap-0 md:gap-4 mt-0 md:mt-4  sm:mb-0">
//                         <div className=" lg:mb-0">
//                             <h3>Dashboard</h3>
//                             <p>Ringkasan data proyek</p>
//                         </div>

//                         <div className="flex flex-row gap-4">
//                             {/* Tanggal Awal */}
//                             <FormItem
//                                 label="Tanggal Awal"
//                                 invalid={
//                                     (errors.tanggal_awal &&
//                                         touched.tanggal_awal) as boolean
//                                 }
//                                 errorMessage={errors.tanggal_awal}
//                             >
//                                 <Field name="tanggal_awal">
//                                     {({ field, form }: FieldProps) => (
//                                         <DatePicker
//                                             placeholder="Pilih Tanggal"
//                                             size="sm"
//                                             value={
//                                                 field.value
//                                                     ? new Date(field.value)
//                                                     : null
//                                             }
//                                             inputFormat="DD-MM-YYYY"
//                                             onChange={(date) => {
//                                                 const formattedDate = date
//                                                     ? dayjs(date).format(
//                                                           'YYYY-MM-DD'
//                                                       )
//                                                     : ''
//                                                 form.setFieldValue(
//                                                     field.name,
//                                                     formattedDate
//                                                 )
//                                                 setTanggalAwal(formattedDate)
//                                             }}
//                                         />
//                                     )}
//                                 </Field>
//                             </FormItem>

//                             {/* Tanggal Akhir */}
//                             <FormItem
//                                 label="Tanggal Akhir"
//                                 invalid={
//                                     (errors.tanggal_akhir &&
//                                         touched.tanggal_akhir) as boolean
//                                 }
//                                 errorMessage={errors.tanggal_akhir}
//                             >
//                                 <Field name="tanggal_akhir">
//                                     {({ field, form }: FieldProps) => (
//                                         <DatePicker
//                                             size="sm"
//                                             placeholder="Pilih Tanggal"
//                                             value={
//                                                 field.value
//                                                     ? new Date(field.value)
//                                                     : null
//                                             }
//                                             inputFormat="DD-MM-YYYY"
//                                             onChange={(date) => {
//                                                 const formattedDate = date
//                                                     ? dayjs(date).format(
//                                                           'YYYY-MM-DD'
//                                                       )
//                                                     : ''
//                                                 form.setFieldValue(
//                                                     field.name,
//                                                     formattedDate
//                                                 )
//                                                 setTanggalAkhir(formattedDate)
//                                             }}
//                                         />
//                                     )}
//                                 </Field>
//                             </FormItem>

//                             <Button
//                                 size="sm"
//                                 type="submit"
//                                 variant="default"
//                                 className="mt-[21px]"
//                             >
//                                 Search
//                             </Button>
//                             <Button
//                                 size="sm"
//                                 type="button"
//                                 variant="default"
//                                 className="mt-[21px]"
//                             >
//                                 Filter
//                             </Button>
//                         </div>
//                     </Form>
//                 )}
//             </Formik>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg mt-4">
//                 {/* Card 2: Total Nilai Kontrak */}
//                 <div className=" rounded-lg p-4 border">
//                     <div>
//                         <p className="text-sm">Total Proyek</p>

//                         <p className="text-xl font-bold text-slate-900 mt-2">
//                             {dataAwal?.total_proyek}
//                         </p>
//                     </div>
//                     <div className="mt-4">
//                         <p className="text-sm">Total Nilai Kontrak</p>
//                         <p className="text-xl font-bold text-slate-900 mt-2">
//                             {formatCurrency(dataAwal?.total_nilai_kontrak)}
//                         </p>
//                         <div className="mt-2 flex flex-col ">
//                             <div>
//                                 <span className="text-green-600">
//                                     Sudah Dibayar:{' '}
//                                 </span>
//                                 <span>
//                                     {formatCurrency(
//                                         dataAwal?.nilai_sudah_dibayar
//                                     )}
//                                 </span>
//                             </div>
//                             <div>
//                                 <span className="text-indigo-600">
//                                     Sudah Ditagih:{' '}
//                                 </span>
//                                 <span>
//                                     {formatCurrency(
//                                         dataAwal?.nilai_sudah_ditagih
//                                     )}
//                                 </span>
//                             </div>
//                             <div>
//                                 <span className="text-rose-600">
//                                     Belum Dibayar:{' '}
//                                 </span>
//                                 <span>
//                                     {formatCurrency(
//                                         dataAwal?.total_nilai_kontrak -
//                                             dataAwal?.nilai_sudah_dibayar
//                                     )}
//                                 </span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Card 3: Total Faktur Pajak */}
//                 <div className=" rounded-lg p-4 border">
//                     <SimplePieMini dataAwal={dataAwal} />
//                 </div>

//                 {/* Card 6: Total Tender */}
//                 <div className=" rounded-lg p-4 border">
//                     <div>
//                         <p className="text-sm">Total Faktur Pajak</p>
//                         <p className="text-xl font-bold text-slate-900 mt-2">
//                             {dataAwal?.total_faktur_pajak}
//                         </p>
//                     </div>
//                     <div className="mt-4">
//                         <p className="text-sm">Total Tender</p>
//                         <p className="text-xl font-bold text-slate-900 mt-2">
//                             {dataAwal?.total_tender}
//                         </p>
//                         <div className="mt-2 ">
//                             <div>
//                                 <span className="text-green-600">
//                                     Diterima:{' '}
//                                 </span>
//                                 <span>{dataAwal?.total_tender_diterima}</span>
//                             </div>
//                             <div>
//                                 <span className="text-red-600">Ditolak: </span>
//                                 <span>{dataAwal?.total_tender_ditolak}</span>
//                             </div>
//                             <div>
//                                 <span className="text-indigo-600">
//                                     Dalam Proses:{' '}
//                                 </span>
//                                 <span>{dataAwal?.total_tender_pengajuan}</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// ==============

// @/components/custom/Holding.tsx (atau path yang sesuai)

// 1. Hapus import yang tidak lagi digunakan
// import { Button, DatePicker, FormItem } from '../ui'
// import { Field, FieldProps, Form, Formik } from 'formik'
// import * as Yup from 'yup'
import SimplePieMini from './SimplePieMini'

// dayjs tidak lagi dibutuhkan jika hanya untuk format tanggal di form
// import dayjs from 'dayjs'

// 2. Sederhanakan props, hanya terima 'dataAwal'
export default function Holding({ dataAwal }: any) {
    // Fungsi format mata uang tetap di sini karena digunakan untuk tampilan
    const formatCurrency = (value: number) => {
        if (typeof value !== 'number') return 'Rp 0' // Penjagaan jika data belum ada
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value)
    }

    console.log('data awal di holding', dataAwal)

    return (
        <div>
            {/* 3. Hapus seluruh bagian <Formik> ... </Formik> dari sini */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg mt-4">
                {/* Card 2: Total Nilai Kontrak */}
                <div className=" rounded-lg p-4 border">
                    <div>
                        <p className="text-sm">Total Proyek</p>
                        <p className="text-xl font-bold text-slate-900 mt-2">
                            {dataAwal?.total_proyek || 0}
                        </p>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm">Total Nilai Kontrak</p>
                        <p className="text-xl font-bold text-slate-900 mt-2">
                            {formatCurrency(dataAwal?.total_nilai_kontrak)}
                        </p>
                        <div className="mt-2 flex flex-col ">
                            <div>
                                <span className="text-green-600">
                                    Sudah Dibayar:{' '}
                                </span>
                                <span>
                                    {formatCurrency(
                                        dataAwal?.nilai_sudah_dibayar
                                    )}
                                </span>
                            </div>
                            <div>
                                <span className="text-indigo-600">
                                    Sudah Ditagih:{' '}
                                </span>
                                <span>
                                    {formatCurrency(
                                        dataAwal?.nilai_sudah_ditagih
                                    )}
                                </span>
                            </div>
                            <div>
                                <span className="text-rose-600">
                                    Belum Dibayar:{' '}
                                </span>
                                <span>
                                    {formatCurrency(
                                        (dataAwal?.total_nilai_kontrak || 0) -
                                            (dataAwal?.nilai_sudah_dibayar || 0)
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 3: Total Faktur Pajak */}
                <div className=" rounded-lg p-4 border">
                    <SimplePieMini dataAwal={dataAwal} />
                </div>

                {/* Card 6: Total Tender */}
                <div className=" rounded-lg p-4 border">
                    <div>
                        <p className="text-sm">Total Faktur Pajak</p>
                        <p className="text-xl font-bold text-slate-900 mt-2">
                            {dataAwal?.total_faktur_pajak || 0}
                        </p>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm">Total Tender</p>
                        <p className="text-xl font-bold text-slate-900 mt-2">
                            {dataAwal?.total_tender || 0}
                        </p>
                        <div className="mt-2 ">
                            <div>
                                <span className="text-green-600">
                                    Diterima:{' '}
                                </span>
                                <span>
                                    {dataAwal?.total_tender_diterima || 0}
                                </span>
                            </div>
                            <div>
                                <span className="text-red-600">Ditolak: </span>
                                <span>
                                    {dataAwal?.total_tender_ditolak || 0}
                                </span>
                            </div>
                            <div>
                                <span className="text-indigo-600">
                                    Dalam Proses:{' '}
                                </span>
                                <span>
                                    {dataAwal?.total_tender_pengajuan || 0}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
