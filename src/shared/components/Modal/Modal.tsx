'use client'
import React, { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import classNames from 'classnames'
import styles from './Modal.module.scss'
import Close from '../CloseButton'

export type ModalProps = {
    isOpen: boolean
    children: React.ReactNode
    className?: string
    onClose?: () => void
    showCloseButton?: boolean
}

const Modal: React.FC<ModalProps> = ({ isOpen, children, className, onClose, showCloseButton = true }) => {
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape' && onClose) {
            onClose()
        }
    }, [onClose])

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
            window.addEventListener('keydown', handleKeyDown)
        }
        return () => {
            document.body.style.overflow = ''
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [isOpen, handleKeyDown])

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && onClose) {
            onClose()
        }
    }

    if (!isOpen) return null

    return createPortal(
        <div className={styles.backdrop} onClick={handleBackdropClick}>
            <div className={classNames(styles.modal, className)}>
                {showCloseButton && onClose && (
                    <Close className={styles.closeButton} onClick={onClose} color='rgba(175, 173, 181, 1)'/>
                )}
                {children}
            </div>
        </div>,
        document.body
    )
}

export default Modal
