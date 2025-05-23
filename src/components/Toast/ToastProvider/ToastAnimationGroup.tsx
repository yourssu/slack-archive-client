'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useContext } from 'react'
import { createPortal } from 'react-dom'

import { Toast } from '@/components/Toast'
import { ToastContext } from '@/components/Toast/ToastProvider/context'

const variants = {
  hidden: (index: number) => ({ opacity: 0, scale: 0.9, x: '-50%', y: index * 80 + 48 }),
  visible: (index: number) => ({ opacity: 1, scale: 1, x: '-50%', y: index * 80 + 48 }),
}

export const ToastAnimationGroup = () => {
  const { toasts } = useContext(ToastContext)

  return createPortal(
    <AnimatePresence>
      {toasts.map(({ id, text }, index) => {
        return (
          <motion.div
            animate="visible"
            className="fixed top-0 left-1/2 z-50"
            custom={toasts.length - index - 1}
            exit="hidden"
            initial="hidden"
            key={id}
            transition={{
              duration: 0.3,
              ease: 'easeInOut',
            }}
            variants={variants}
          >
            <Toast>{text}</Toast>
          </motion.div>
        )
      })}
    </AnimatePresence>,
    document.body
  )
}
