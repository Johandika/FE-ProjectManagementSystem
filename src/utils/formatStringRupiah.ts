export function formatRupiah(numberString: string) {
    // Pastikan input berupa string angka, hapus karakter non-digit jika ada
    const cleanNumber = numberString.replace(/\D/g, '')

    // Gunakan regex untuk sisipkan titik setiap tiga digit dari belakang
    return cleanNumber.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}
