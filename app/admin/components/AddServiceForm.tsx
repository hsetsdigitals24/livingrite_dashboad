"use client";

import { useState } from "react";
import { X, Loader, AlertCircle } from "lucide-react";

interface ServiceFormData {
  title: string;
  slug: string;
  description: string;
  basePrice: number;
  currency: string;
  isActive: boolean;
  discountPercentage: number;
  minPrice: number;
  maxPrice: number;
  pricingNotes: string;
  enableForPayments: boolean;
}

interface AddServiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ServiceFormData) => Promise<void>;
  currencies?: string[];
}

const defaultCurrencies = ["USD", "EUR", "GBP", "CAD", "AUD", "INR"];

export function AddServiceForm({
  isOpen,
  onClose,
  onSubmit,
  currencies = defaultCurrencies,
}: AddServiceFormProps) {
  const [formData, setFormData] = useState<ServiceFormData>({
    title: "",
    slug: "",
    description: "",
    basePrice: 0,
    currency: "USD",
    isActive: true,
    discountPercentage: 0,
    minPrice: 0,
    maxPrice: 0,
    pricingNotes: "",
    enableForPayments: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title: newTitle,
      slug: generateSlug(newTitle),
    }));
    if (validationErrors.title) {
      setValidationErrors((prev) => ({ ...prev, title: "" }));
    }
  };

  const handleChange = (
    field: keyof ServiceFormData,
    value: any
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = "Service title is required";
    }
    if (!formData.slug.trim()) {
      errors.slug = "Service slug is required";
    }
    if (formData.basePrice < 0) {
      errors.basePrice = "Price cannot be negative";
    }
    if (formData.minPrice < 0) {
      errors.minPrice = "Minimum price cannot be negative";
    }
    if (formData.maxPrice < 0) {
      errors.maxPrice = "Maximum price cannot be negative";
    }
    if (
      formData.minPrice > 0 &&
      formData.maxPrice > 0 &&
      formData.minPrice > formData.maxPrice
    ) {
      errors.minPrice = "Minimum price cannot exceed maximum price";
    }
    if (formData.discountPercentage < 0 || formData.discountPercentage > 100) {
      errors.discountPercentage = "Discount must be between 0 and 100";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData);
      setFormData({
        title: "",
        slug: "",
        description: "",
        basePrice: 0,
        currency: "USD",
        isActive: true,
        discountPercentage: 0,
        minPrice: 0,
        maxPrice: 0,
        pricingNotes: "",
        enableForPayments: true,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add service");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Add New Service</h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Basic Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g., Web Development"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                  validationErrors.title
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300"
                }`}
              />
              {validationErrors.title && (
                <p className="text-red-600 text-sm mt-1">
                  {validationErrors.title}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
                placeholder="auto-generated from title"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                  validationErrors.slug
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300"
                }`}
              />
              <p className="text-xs text-gray-500 mt-1">
                URL-friendly identifier for the service
              </p>
              {validationErrors.slug && (
                <p className="text-red-600 text-sm mt-1">
                  {validationErrors.slug}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe what this service offers..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => handleChange("isActive", e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Service is active
              </label>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Pricing Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base Price *
                </label>
                <input
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) =>
                    handleChange("basePrice", parseFloat(e.target.value) || 0)
                  }
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                    validationErrors.basePrice
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                />
                {validationErrors.basePrice && (
                  <p className="text-red-600 text-sm mt-1">
                    {validationErrors.basePrice}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency *
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => handleChange("currency", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                >
                  {currencies.map((curr) => (
                    <option key={curr} value={curr}>
                      {curr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Price
                </label>
                <input
                  type="number"
                  value={formData.minPrice}
                  onChange={(e) =>
                    handleChange("minPrice", parseFloat(e.target.value) || 0)
                  }
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                    validationErrors.minPrice
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                />
                {validationErrors.minPrice && (
                  <p className="text-red-600 text-sm mt-1">
                    {validationErrors.minPrice}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Price
                </label>
                <input
                  type="number"
                  value={formData.maxPrice}
                  onChange={(e) =>
                    handleChange("maxPrice", parseFloat(e.target.value) || 0)
                  }
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                    validationErrors.maxPrice
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                />
                {validationErrors.maxPrice && (
                  <p className="text-red-600 text-sm mt-1">
                    {validationErrors.maxPrice}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Percentage (%)
              </label>
              <input
                type="number"
                value={formData.discountPercentage}
                onChange={(e) =>
                  handleChange("discountPercentage", parseFloat(e.target.value) || 0)
                }
                placeholder="0"
                step="0.1"
                min="0"
                max="100"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                  validationErrors.discountPercentage
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300"
                }`}
              />
              {validationErrors.discountPercentage && (
                <p className="text-red-600 text-sm mt-1">
                  {validationErrors.discountPercentage}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pricing Notes
              </label>
              <textarea
                value={formData.pricingNotes}
                onChange={(e) => handleChange("pricingNotes", e.target.value)}
                placeholder="e.g., Volume discounts available, custom pricing for enterprises..."
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="enableForPayments"
                checked={formData.enableForPayments}
                onChange={(e) =>
                  handleChange("enableForPayments", e.target.checked)
                }
                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
              />
              <label
                htmlFor="enableForPayments"
                className="text-sm font-medium text-gray-700"
              >
                Enable for payment processing
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2 font-medium"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Service"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}