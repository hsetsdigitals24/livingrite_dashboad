'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Document {
  id: string;
  name: string;
  category: 'prescription' | 'test_result' | 'medical_record' | 'insurance' | 'other';
  uploadedDate: Date;
  size: string;
}

const mockDocuments: Document[] = [
  { id: '1', name: 'Blood Test Results - Jan 2024.pdf', category: 'test_result', uploadedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), size: '2.4 MB' },
  { id: '2', name: 'Prescription - Medication List.pdf', category: 'prescription', uploadedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), size: '0.8 MB' },
  { id: '3', name: 'Medical Records Summary.pdf', category: 'medical_record', uploadedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), size: '1.2 MB' },
  { id: '4', name: 'Insurance Card Scan.pdf', category: 'insurance', uploadedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), size: '3.1 MB' },
  { id: '5', name: 'Lab Work Request.pdf', category: 'other', uploadedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), size: '0.5 MB' },
];

const categoryIcons: Record<Document['category'], string> = {
  prescription: '💊',
  test_result: '🔬',
  medical_record: '📋',
  insurance: '🏥',
  other: '📄',
};

const categoryColors: Record<Document['category'], string> = {
  prescription: 'bg-red-100 text-red-700',
  test_result: 'bg-blue-100 text-blue-700',
  medical_record: 'bg-green-100 text-green-700',
  insurance: 'bg-purple-100 text-purple-700',
  other: 'bg-gray-100 text-gray-700',
};

export default function DocumentsPage() {
  const [selectedCategory, setSelectedCategory] = useState<Document['category'] | 'all'>('all');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filteredDocs = selectedCategory === 'all' 
    ? mockDocuments 
    : mockDocuments.filter(doc => doc.category === selectedCategory);

  const categories: { value: Document['category'] | 'all'; label: string }[] = [
    { value: 'all', label: 'All Documents' },
    { value: 'prescription', label: 'Prescriptions' },
    { value: 'test_result', label: 'Test Results' },
    { value: 'medical_record', label: 'Medical Records' },
    { value: 'insurance', label: 'Insurance' },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Document Library</h1>
        <p className="text-gray-600 mb-8">Secure storage for your important medical documents</p>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8 flex flex-wrap gap-2"
      >
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              selectedCategory === cat.value
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-400'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </motion.div>

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-8 border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50 hover:border-blue-500 transition-colors cursor-pointer"
      >
        <p className="text-2xl mb-2">📁</p>
        <p className="font-semibold text-gray-900">Drag documents here or click to upload</p>
        <p className="text-sm text-gray-600">PDF, images, and documents up to 10 MB</p>
      </motion.div>

      {/* Documents Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {filteredDocs.map((doc, idx) => (
          <motion.div
            key={doc.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: idx * 0.05 }}
            onMouseEnter={() => setHoveredId(doc.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-lg transition-all duration-300 group cursor-pointer overflow-hidden"
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-4xl">{categoryIcons[doc.category]}</span>
              <motion.div
                animate={{ opacity: hoveredId === doc.id ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex gap-1"
              >
                <button className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors">
                  ⬇️
                </button>
                <button className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors">
                  🗑️
                </button>
              </motion.div>
            </div>

            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
              {doc.name}
            </h3>

            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`px-2 py-1 rounded text-xs font-medium ${categoryColors[doc.category]}`}>
                {doc.category.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
              <p>Size: {doc.size}</p>
              <p>
                Uploaded:{' '}
                {new Date(doc.uploadedDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredDocs.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-gray-500 text-lg">No documents in this category</p>
        </motion.div>
      )}
    </div>
  );
}
