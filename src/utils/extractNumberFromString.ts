// Fungsi untuk mengekstrak nilai numerik dari berbagai format string
export const extractNumberFromString = (
    value: string | number | undefined
): number => {
    // Jika undefined atau null, kembalikan 0
    if (value === undefined || value === null) {
        return 0
    }

    // Jika sudah number, langsung kembalikan
    if (typeof value === 'number') {
        return value
    }

    // Konversi ke string untuk memastikan
    const strValue = String(value)

    // Hapus semua karakter non-numerik kecuali titik dan koma
    // Ganti koma dengan titik untuk format desimal standar
    const cleanedValue = strValue
        .replace(/[^\d.,]/g, '') // Hapus semua kecuali angka, titik, dan koma
        .replace(/\./g, '') // Hapus titik (pemisah ribuan)
        .replace(/,/g, '.') // Ganti koma dengan titik (untuk desimal)

    // Konversi ke number
    const result = parseFloat(cleanedValue)

    // Jika NaN, kembalikan 0
    return isNaN(result) ? 0 : result
}

// Fungsi untuk mengekstrak nilai numerik murni (tanpa desimal) dari berbagai format
export const extractIntegerFromStringAndFloat = (
    value: string | number | undefined
): number => {
    if (value === undefined || value === null) {
        return 0
    }
    // Langkah 1: Ubah float menjadi string
    const stringValue: string = value.toString()
    // Langkah 2: Hilangkan semua titik dan koma
    const cleanedString: string = stringValue.replace(/[.,]/g, '')

    // Langkah 3: Ubah kembali menjadi number
    const formattedNumber = Number(cleanedString)
    return formattedNumber
}
