"use client";

import { useState, useEffect } from "react";
import { AlertCircle, Plus, Edit2, Trash2, X, Star } from "lucide-react";

interface Testimonial {
  id: string;
  clientName: string;
  clientTitle?: string | null;
  clientLocation?: string | null;
  clientImage?: string | null;
  rating: number;
  content: string;
  shortQuote?: string | null;
  videoUrl?: string | null;
  serviceId?: string | null;
  featured: boolean;
  showOnWidget: boolean;
  status: string;
  displayOrder?: number | null;
  service?: { id: string; title: string } | null;
  createdAt: string;
  updatedAt: string;
}

interface Service {
  id: string;
  title: string;
}

interface FormData {
  id?: string;
  clientName: string;
  clientTitle: string;
  clientLocation: string;
  clientImage: string;
  rating: string;
  content: string;
  shortQuote: string;
  videoUrl: string;
  serviceId: string;
  featured: boolean;
  showOnWidget: boolean;
  status: string;
  displayOrder: string;
}

const INITIAL_FORM_STATE: FormData = {
  clientName: "",
  clientTitle: "",
  clientLocation: "",
  clientImage: "",
  rating: "5",
  content: "",
  shortQuote: "",
  videoUrl: "",
  serviceId: "",
  featured: false,
  showOnWidget: false,
  status: "APPROVED",
  displayOrder: "",
};

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selected, setSelected] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
  const [showModal, setShowModal] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [widgetFilter, setWidgetFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  // Loading & Error
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchTestimonials();
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter, serviceFilter, widgetFilter]);

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
      });

      if (statusFilter !== "all") params.append("status", statusFilter);
      if (serviceFilter !== "all") params.append("serviceId", serviceFilter);
      if (widgetFilter === "true") params.append("showOnWidget", "true");
      if (widgetFilter === "false") params.append("showOnWidget", "false");

      const response = await fetch(`/api/admin/testimonials?${params}`);
      if (!response.ok) throw new Error("Failed to fetch testimonials");

      const data = await response.json();
      setTestimonials(data.data);
      setTotalPages(data.pagination.pages || 1);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch testimonials");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services");
      if (!response.ok) throw new Error("Failed to fetch services");
      const data = await response.json();
      setServices(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Failed to fetch services:", err);
    }
  };

  // Downscale + compress the chosen image entirely in the browser, then store it
  // as a base64 data URI directly on the testimonial (saved to the DB with the
  // rest of the data — no R2 upload). Keeping the longest side <= 400px and
  // JPEG quality at 0.8 yields a small string (tens of KB), well under request
  // body limits and cheap to query.
  const MAX_DIMENSION = 400;
  const JPEG_QUALITY = 0.8;

  const fileToCompressedDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error("Failed to load image"));
        img.onload = () => {
          const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
          const width = Math.round(img.width * scale);
          const height = Math.round(img.height * scale);

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Canvas not supported"));
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file");
      return;
    }
    try {
      setUploadingImage(true);
      const dataUrl = await fileToCompressedDataUrl(file);
      setFormData((prev) => ({ ...prev, clientImage: dataUrl }));
    } catch (err) {
      alert("Failed to process image: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleOpenForm = (t?: Testimonial) => {
    if (t) {
      setFormData({
        id: t.id,
        clientName: t.clientName,
        clientTitle: t.clientTitle || "",
        clientLocation: t.clientLocation || "",
        clientImage: t.clientImage || "",
        rating: t.rating.toString(),
        content: t.content,
        shortQuote: t.shortQuote || "",
        videoUrl: t.videoUrl || "",
        serviceId: t.serviceId || "",
        featured: t.featured,
        showOnWidget: t.showOnWidget,
        status: t.status,
        displayOrder: t.displayOrder?.toString() || "",
      });
      setSelected(t);
    } else {
      setFormData(INITIAL_FORM_STATE);
      setSelected(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData(INITIAL_FORM_STATE);
    setSelected(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clientName.trim() || !formData.content.trim()) {
      alert("Client name and testimonial content are required");
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        clientName: formData.clientName,
        clientTitle: formData.clientTitle || null,
        clientLocation: formData.clientLocation || null,
        clientImage: formData.clientImage || null,
        rating: parseInt(formData.rating) || 5,
        content: formData.content,
        shortQuote: formData.shortQuote || null,
        videoUrl: formData.videoUrl || null,
        serviceId: formData.serviceId || null,
        featured: formData.featured,
        showOnWidget: formData.showOnWidget,
        status: formData.status,
        displayOrder: formData.displayOrder ? parseInt(formData.displayOrder) : null,
      };

      const url = selected
        ? `/api/admin/testimonials?id=${selected.id}`
        : "/api/admin/testimonials";
      const method = selected ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save testimonial");
      }

      await fetchTestimonials();
      handleCloseModal();
      alert(selected ? "Testimonial updated successfully" : "Testimonial created successfully");
    } catch (err) {
      alert("Error: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      const response = await fetch(`/api/admin/testimonials?id=${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete testimonial");
      await fetchTestimonials();
      alert("Testimonial deleted successfully");
    } catch (err) {
      alert("Error: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "FEATURED":
        return "bg-blue-100 text-blue-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "ARCHIVED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const approvedCount = testimonials.filter((t) => t.status === "APPROVED").length;
  const widgetCount = testimonials.filter((t) => t.showOnWidget).length;
  const featuredCount = testimonials.filter((t) => t.featured).length;

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
            Manage client testimonials shown on the widget and testimonials page
          </p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Testimonial
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg shadow p-3 sm:p-6">
          <p className="text-xs sm:text-sm text-gray-600 font-medium">Approved</p>
          <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1 sm:mt-2">{approvedCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-6">
          <p className="text-xs sm:text-sm text-gray-600 font-medium">On Widget</p>
          <p className="text-2xl sm:text-3xl font-bold text-cyan-600 mt-1 sm:mt-2">{widgetCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-6">
          <p className="text-xs sm:text-sm text-gray-600 font-medium">Featured</p>
          <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-1 sm:mt-2">{featuredCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-3 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
            <select
              value={serviceFilter}
              onChange={(e) => {
                setServiceFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
            >
              <option value="all">All Services</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Widget</label>
            <select
              value={widgetFilter}
              onChange={(e) => {
                setWidgetFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
            >
              <option value="all">All</option>
              <option value="true">On Widget</option>
              <option value="false">Not On Widget</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-8 sm:p-12 text-center">
            <p className="text-sm sm:text-base text-gray-600">Loading testimonials...</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <p className="text-gray-600">No testimonials found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Client</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Service</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Rating</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Featured</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">On Widget</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {testimonials.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-3">
                          {t.clientImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={t.clientImage} alt={t.clientName} className="w-9 h-9 rounded-full object-cover" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold">
                              {t.clientName.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{t.clientName}</p>
                            {(t.clientTitle || t.clientLocation) && (
                              <p className="text-xs text-gray-500">
                                {[t.clientTitle, t.clientLocation].filter(Boolean).join(" · ")}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{t.service?.title || "-"}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className="inline-flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          {t.rating}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(t.status)}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${t.featured ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>
                          {t.featured ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${t.showOnWidget ? "bg-cyan-100 text-cyan-800" : "bg-gray-100 text-gray-800"}`}>
                          {t.showOnWidget ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenForm(t)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-teal-600 text-white"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">
                {selected ? "Edit Testimonial" : "New Testimonial"}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title / Relation</label>
                  <input
                    type="text"
                    value={formData.clientTitle}
                    onChange={(e) => setFormData({ ...formData, clientTitle: e.target.value })}
                    placeholder="e.g. Patient, Family Member"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.clientLocation}
                    onChange={(e) => setFormData({ ...formData, clientLocation: e.target.value })}
                    placeholder="e.g. Lagos, Nigeria"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                  <select
                    value={formData.serviceId}
                    onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  >
                    <option value="">Select a service</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  placeholder="The full testimonial quote"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Quote (widget preview)</label>
                <input
                  type="text"
                  value={formData.shortQuote}
                  onChange={(e) => setFormData({ ...formData, shortQuote: e.target.value })}
                  placeholder="Optional one-line version shown in the widget"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
              </div>

              {/* Media */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-medium text-gray-900 mb-4">Media</h3>

                {/* Photo upload */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client Photo</label>
                  <div className="flex gap-2 mb-2 items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                      disabled={uploadingImage}
                      className="flex-1"
                    />
                    {uploadingImage && <span className="text-sm text-gray-600">Processing...</span>}
                  </div>
                  {formData.clientImage && (
                    <div className="flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={formData.clientImage} alt="Client" className="w-20 h-20 object-cover rounded-full" />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, clientImage: "" })}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Video URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Video Testimonial Link</label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://youtube.com/watch?v=... or a direct video URL"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Settings */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-medium text-gray-900 mb-4">Settings</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                    <select
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                    >
                      {[5, 4, 3, 2, 1].map((r) => (
                        <option key={r} value={r}>
                          {r} Star{r !== 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                    >
                      <option value="APPROVED">Approved</option>
                      <option value="PENDING">Pending</option>
                      <option value="REJECTED">Rejected</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                    placeholder="Lower numbers show first"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  />
                </div>

                <div className="mt-4 flex flex-col gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showOnWidget}
                      onChange={(e) => setFormData({ ...formData, showOnWidget: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Show on widget (homepage &amp; about page)
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-700">Featured (pinned to top)</span>
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="border-t border-gray-200 pt-4 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || uploadingImage}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : selected ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
