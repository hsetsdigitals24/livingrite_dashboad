'use client'

import { PortableText, PortableTextProps } from '@portabletext/react'
import { motion } from 'framer-motion'

const portableTextComponents = {
  block: {
    h1: ({ children }: any) => (
      <motion.h1
        className="text-4xl font-bold text-gray-900 mt-10 mb-6 first:mt-0 leading-tight"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        {children}
      </motion.h1>
    ),
    h2: ({ children }: any) => (
      <motion.h2
        className="text-3xl font-bold text-gray-900 mt-10 mb-6 leading-tight"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        {children}
      </motion.h2>
    ),
    h3: ({ children }: any) => (
      <motion.h3
        className="text-2xl font-bold text-gray-900 mt-8 mb-4 leading-tight"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        {children}
      </motion.h3>
    ),
    h4: ({ children }: any) => (
      <motion.h4
        className="text-xl font-bold text-gray-900 mt-6 mb-3 leading-tight"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        {children}
      </motion.h4>
    ),
    normal: ({ children }: any) => (
      <motion.p
        className="text-gray-700 leading-8 mb-6 text-base md:text-lg first-letter:font-semibold first-letter:text-primary"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        {children}
      </motion.p>
    ),
    blockquote: ({ children }: any) => (
      <motion.blockquote
        className="relative border-l-4 border-primary pl-6 py-4 my-8 text-lg text-gray-800 italic bg-gradient-to-r from-primary/5 to-transparent p-6 rounded-r-xl shadow-sm"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <span className="absolute left-0 top-0 text-primary/20 text-6xl leading-none">"</span>
        <div className="relative z-10">
          {children}
        </div>
      </motion.blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <motion.ul
        className="list-disc list-inside space-y-3 my-6 ml-2 text-gray-700"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        {children}
      </motion.ul>
    ),
    number: ({ children }: any) => (
      <motion.ol
        className="list-decimal list-inside space-y-3 my-6 ml-2 text-gray-700"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        {children}
      </motion.ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => (
      <li className="text-gray-700 leading-7 marker:text-primary marker:font-bold">
        {children}
      </li>
    ),
    number: ({ children }: any) => (
      <li className="text-gray-700 leading-7 marker:text-primary marker:font-bold">
        {children}
      </li>
    ),
  },
  marks: {
    strong: ({ children }: any) => (
      <strong className="font-bold text-gray-900 bg-gradient-to-r from-primary/20 to-transparent px-1 rounded">
        {children}
      </strong>
    ),
    em: ({ children }: any) => <em className="italic text-gray-800 font-semibold">{children}</em>,
    code: ({ children }: any) => (
      <code className="bg-gray-100 px-3 py-1 rounded-md text-sm font-mono text-red-600 border border-gray-200">
        {children}
      </code>
    ),
    link: ({ value, children }: any) => (
      <motion.a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:text-primary/80 underline font-semibold transition-colors relative group"
        whileHover={{ scale: 1.02 }}
      >
        {children}
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
      </motion.a>
    ),
  },
  types: {
    image: ({ value }: any) => (
      <motion.figure
        className="my-10 rounded-2xl overflow-hidden shadow-2xl border border-gray-100"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="relative bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden group">
          <motion.img
            src={value.asset.url}
            alt={value.alt || 'Article image'}
            className="w-full h-auto group-hover:scale-110 transition-transform duration-700"
            whileHover={{ scale: 1.05 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/0 to-black/0 group-hover:from-black/20 transition-all duration-300" />
        </div>
        {value.caption && (
          <figcaption className="text-base text-gray-600 p-6 bg-gradient-to-r from-gray-50 to-white text-center italic font-medium border-t border-gray-100">
            {value.caption}
          </figcaption>
        )}
      </motion.figure>
    ),
  },
}

export default function StyledPortableText(props: PortableTextProps) {
  return <PortableText {...props} components={portableTextComponents} />
}
