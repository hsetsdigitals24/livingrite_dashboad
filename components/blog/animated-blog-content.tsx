'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedBlogContentProps {
  children: ReactNode
  delay?: number
}

export default function AnimatedBlogContent({ children, delay = 0 }: AnimatedBlogContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: delay,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  )
}
