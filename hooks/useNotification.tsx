'use client'

import { useState, useCallback } from 'react'
import Notification, { NotificationType } from '@/components/Notification'
import ErrorModal from '@/components/ErrorModal'
import ConfirmModal from '@/components/ConfirmModal'

interface NotificationState {
  message: string
  type: NotificationType
  id: number
}

interface ErrorModalState {
  title: string
  message: string
}

interface ConfirmModalState {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  onConfirm: () => void
}

export function useNotification() {
  const [notifications, setNotifications] = useState<NotificationState[]>([])
  const [errorModal, setErrorModal] = useState<ErrorModalState | null>(null)
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState | null>(null)

  const showNotification = useCallback((message: string, type: NotificationType = 'info') => {
    const id = Date.now()
    setNotifications(prev => [...prev, { message, type, id }])
  }, [])

  const showSuccess = useCallback((message: string) => {
    showNotification(message, 'success')
  }, [showNotification])

  const showError = useCallback((message: string) => {
    showNotification(message, 'error')
  }, [showNotification])

  const showWarning = useCallback((message: string) => {
    showNotification(message, 'warning')
  }, [showNotification])

  const showInfo = useCallback((message: string) => {
    showNotification(message, 'info')
  }, [showNotification])

  const showErrorModal = useCallback((title: string, message: string) => {
    setErrorModal({ title, message })
  }, [])

  const showConfirmModal = useCallback((
    title: string,
    message: string,
    onConfirm: () => void,
    options?: {
      confirmText?: string
      cancelText?: string
      variant?: 'danger' | 'warning' | 'info'
    }
  ) => {
    setConfirmModal({
      title,
      message,
      onConfirm,
      confirmText: options?.confirmText,
      cancelText: options?.cancelText,
      variant: options?.variant,
    })
  }, [])

  const removeNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const NotificationContainer = useCallback(() => (
    <>
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
      {errorModal && (
        <ErrorModal
          title={errorModal.title}
          message={errorModal.message}
          onClose={() => setErrorModal(null)}
        />
      )}
      {confirmModal && (
        <ConfirmModal
          title={confirmModal.title}
          message={confirmModal.message}
          confirmText={confirmModal.confirmText}
          cancelText={confirmModal.cancelText}
          variant={confirmModal.variant}
          onConfirm={() => {
            confirmModal.onConfirm()
            setConfirmModal(null)
          }}
          onCancel={() => setConfirmModal(null)}
        />
      )}
    </>
  ), [notifications, errorModal, confirmModal, removeNotification])

  return {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showErrorModal,
    showConfirmModal,
    NotificationContainer,
  }
}
