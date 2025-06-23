export const formatDate = (isoDate: string) => {
    if (!isoDate) return ''

    try {
        const date = new Date(isoDate)
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()

        return `${day}-${month}-${year}`
    } catch (error) {
        console.error('Error formatting date:', error)
        return ''
    }
}

export const formatWaktuNotifikasi = (createdAt) => {
    const now: any = new Date()
    const created: any = new Date(createdAt)
    const diffInMs = now - created
    const diffInMinutes = Math.floor(diffInMs / 60000) // 1000 * 60
    const diffInHours = Math.floor(diffInMs / 3600000) // 1000 * 60 * 60
    const diffInDays = Math.floor(diffInMs / 86400000) // 1000 * 60 * 60 * 24

    if (diffInMinutes < 1) {
        return 'baru saja'
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes} menit yang lalu`
    } else if (diffInHours < 24) {
        return `${diffInHours} jam yang lalu`
    } else if (diffInDays === 1) {
        return 'kemarin'
    } else {
        const dd = String(created.getDate()).padStart(2, '0')
        const mm = String(created.getMonth() + 1).padStart(2, '0') // Januari = 0
        const yyyy = created.getFullYear()
        return `${dd}/${mm}/${yyyy}`
    }
}

export const formatDateWithTime = (isoString: string): string => {
    const tanggal = new Date(isoString)

    const jam = tanggal.getHours() // -> 18
    const menit = tanggal.getMinutes() // -> 59
    const hari = tanggal.getDate() // -> 21
    const bulan = tanggal.getMonth() + 1 // -> 6
    const tahun = tanggal.getFullYear() // -> 2025

    const jamString = String(jam).padStart(2, '0')
    const menitString = String(menit).padStart(2, '0')
    const hariString = String(hari).padStart(2, '0')
    const bulanString = String(bulan).padStart(2, '0')

    const waktuFormatted = `${jamString}.${menitString} WIB`
    const tanggalFormatted = `${hariString}-${bulanString}-${tahun}`

    return `${waktuFormatted}, ${tanggalFormatted}`
}
