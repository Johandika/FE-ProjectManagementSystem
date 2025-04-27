import React, { ReactNode } from 'react'
import { Button } from '@/components/ui'

interface CustomDialogProps {
    isOpen: boolean
    onClose: (e: React.MouseEvent) => void
    onRequestClose: (e: React.MouseEvent) => void
    className?: string
    children: ReactNode
}

// Backdrop overlay untuk dialog
const DialogBackdrop: React.FC<{
    isOpen: boolean
    onClick: (e: React.MouseEvent) => void
}> = ({ isOpen, onClick }) => {
    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center"
            onClick={onClick}
        />
    )
}

// Komponen Dialog utama
const CustomDialog: React.FC<CustomDialogProps> = ({
    isOpen,
    onClose,
    onRequestClose,
    className = '',
    children,
}) => {
    if (!isOpen) return null

    // Handler untuk klik pada backdrop
    const handleBackdropClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        onRequestClose(e)
    }

    // Handler untuk klik pada konten dialog (menghentikan propagasi)
    const handleDialogClick = (e: React.MouseEvent) => {
        e.stopPropagation()
    }

    return (
        <>
            {/* Backdrop overlay */}
            <DialogBackdrop isOpen={isOpen} onClick={handleBackdropClick} />

            {/* Dialog content */}
            <div
                className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-xl p-6 overflow-hidden flex flex-col ${className}`}
                onClick={handleDialogClick}
            >
                {/* Tombol close opsional */}
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                {/* Konten dialog */}
                <div className="flex-grow overflow-auto">{children}</div>
            </div>
        </>
    )
}

export default CustomDialog
