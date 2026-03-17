'use client'
import React from 'react'
import { createPortal } from 'react-dom'
import classNames from 'classnames'
import styles from './Modal.module.scss'
import Close from '../CloseButton'
import { useModal } from '@shared/hooks/useModal'

export type ModalProps = {
    isOpen: boolean
    children: React.ReactNode
    className?: string
    onClose?: () => void
    showCloseButton?: boolean
}

const Modal: React.FC<ModalProps> = ({ 
    isOpen, 
    children, 
    className, 
    onClose, 
    showCloseButton = true 
}) => {
    useModal(isOpen, onClose)

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && onClose) {
            onClose()
        }
    }

    if (!isOpen) return null
    if (typeof document === 'undefined') return null

    return createPortal(
        <div className={styles.backdrop} onClick={handleBackdropClick}>
            <div className={classNames(styles.modal, className)}>
                {showCloseButton && onClose && (
                    <Close 
                        className={styles.closeButton} 
                        onClick={onClose} 
                        color='rgba(175, 173, 181, 1)' 
                    />
                )}
                {children}
            </div>
        </div>,
        document.body
    )
}

export default Modal