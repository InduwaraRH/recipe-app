import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Snackbar({ message, type = 'success', isVisible, onClose, duration = 3000 }) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600 text-white'
      case 'error':
        return 'bg-red-600 text-white'
      case 'warning':
        return 'bg-yellow-600 text-white'
      case 'info':
        return 'bg-blue-600 text-white'
      default:
        return 'bg-green-600 text-white'
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.3 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg ${getTypeStyles()}`}
        >
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">{message}</span>
            <button
              onClick={onClose}
              className="ml-2 text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
