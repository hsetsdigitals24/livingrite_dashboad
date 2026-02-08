'use client';

import { X } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  basePrice: number | null;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ServiceViewProps {
  service: Service;
  onClose: () => void;
}

export default function ServiceView({ service, onClose }: ServiceViewProps) {
  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Service Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title
              </label>
              <p className="text-lg text-gray-900">{service.title}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Slug
              </label>
              <p className="text-lg font-mono text-gray-900 bg-gray-50 px-3 py-1 rounded w-fit">
                {service.slug}
              </p>
            </div>
          </div>

          {/* Description */}
          {service.description && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <p className="text-gray-700 whitespace-pre-wrap">{service.description}</p>
            </div>
          )}

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Base Price
              </label>
              <p className="text-lg text-gray-900">
                {service.basePrice ? service.basePrice.toFixed(2) : 'N/A'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Currency
              </label>
              <p className="text-lg text-gray-900">{service.currency}</p>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <div className="flex gap-2">
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  service.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {service.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          {/* Timestamps */}
          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Created
                </label>
                <p className="text-sm text-gray-600">
                  {new Date(service.createdAt).toLocaleDateString()} at{' '}
                  {new Date(service.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Updated
                </label>
                <p className="text-sm text-gray-600">
                  {new Date(service.updatedAt).toLocaleDateString()} at{' '}
                  {new Date(service.updatedAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>

          {/* Service ID */}
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Service ID
            </label>
            <p className="font-mono text-xs text-gray-700 break-all">{service.id}</p>
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 font-medium py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
