'use client'

interface ErrorModalProps {
  title: string
  message: string
  onClose: () => void
}

export default function ErrorModal({ title, message, onClose }: ErrorModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-2xl">✕</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-text-dark mb-2">{title}</h3>
              <p className="text-text-medium">{message}</p>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="btn-primary"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
