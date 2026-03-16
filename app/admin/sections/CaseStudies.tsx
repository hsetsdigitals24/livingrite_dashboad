"use client";

import { useState, useEffect } from "react";
import { AlertCircle, Plus, Edit2, Trash2, X, Upload } from "lucide-react";

interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  clientName: string;
  serviceId?: string | null;
  challenge: string;
  solution: string;
  outcome: string;
  narrative: string;
  heroImage?: string | null;
  beforeImage?: string | null;
  afterImage?: string | null;
  images: string[];
  videoUrl?: string | null;
  rating?: number | null;
  timeline?: string | null;
  keyResults?: any;
  status: string;
  featured: boolean;
  displayOrder?: number | null;
  service?: { id: string; title: string } | null;
  approver?: { id: string; name: string; email: string } | null;
  createdAt: string;
  updatedAt: string;
}

interface Service {
  id: string;
  title: string;
}

interface FormData {
  id?: string;
  title: string;
  clientName: string;
  slug: string;
  serviceId: string;
  challenge: string;
  solution: string;
  outcome: string;
  narrative: string;
  heroImage: string;
  beforeImage: string;
  afterImage: string;
  images: string[];
  videoUrl: string;
  rating: string;
  timeline: string;
  keyResults: string;
  status: string;
  featured: boolean;
  displayOrder: string;
}

const INITIAL_FORM_STATE: FormData = {
  title: "",
  clientName: "",
  slug: "",
  serviceId: "",
  challenge: "",
  solution: "",
  outcome: "",
  narrative: "",
  heroImage: "",
  beforeImage: "",
  afterImage: "",
  images: [],
  videoUrl: "",
  rating: "",
  timeline: "",
  keyResults: "",
  status: "PENDING",
  featured: false,
  displayOrder: "",
};

export default function CaseStudiesSection() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
  const [showModal, setShowModal] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  // Loading & Error
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  useEffect(() => {
    fetchCaseStudies();
    fetchServices();
  }, [currentPage, statusFilter, serviceFilter, featuredFilter]);

  const fetchCaseStudies = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
      });

      if (statusFilter !== "all") params.append("status", statusFilter);
      if (serviceFilter !== "all") params.append("serviceId", serviceFilter);
      if (featuredFilter === "true") params.append("featured", "true");
      if (featuredFilter === "false") params.append("featured", "false");

      const response = await fetch(`/api/admin/case-studies?${params}`);
      if (!response.ok) throw new Error("Failed to fetch case studies");

      const data = await response.json();
      setCaseStudies(data.data);
      setTotalPages(data.pagination.pages);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch case studies"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services");
      if (!response.ok) throw new Error("Failed to fetch services");
      const data = await response.json();
      setServices(data);
    } catch (err) {
      console.error("Failed to fetch services:", err);
    }
  };

  const handleImageUpload = async (file: File, fieldName: string) => {
    try {
      setUploadingImage(fieldName);
      const formDataObj = new FormData();
      formDataObj.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataObj,
      });

      if (!response.ok) throw new Error("Failed to upload image");
      const data = await response.json();

      setFormData((prev) => ({
        ...prev,
        [fieldName]: data.url,
      }));
    } catch (err) {
      alert("Failed to upload image: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setUploadingImage(null);
    }
  };

  const handleAddImageUrl = (url: string) => {
    if (url) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, url],
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleOpenForm = (caseStudy?: CaseStudy) => {
    if (caseStudy) {
      setFormData({
        id: caseStudy.id,
        title: caseStudy.title,
        clientName: caseStudy.clientName,
        slug: caseStudy.slug,
        serviceId: caseStudy.serviceId || "",
        challenge: caseStudy.challenge,
        solution: caseStudy.solution,
        outcome: caseStudy.outcome,
        narrative: caseStudy.narrative,
        heroImage: caseStudy.heroImage || "",
        beforeImage: caseStudy.beforeImage || "",
        afterImage: caseStudy.afterImage || "",
        images: caseStudy.images || [],
        videoUrl: caseStudy.videoUrl || "",
        rating: caseStudy.rating?.toString() || "",
        timeline: caseStudy.timeline || "",
        keyResults: typeof caseStudy.keyResults === "string" ? caseStudy.keyResults : JSON.stringify(caseStudy.keyResults || ""),
        status: caseStudy.status,
        featured: caseStudy.featured,
        displayOrder: caseStudy.displayOrder?.toString() || "",
      });
      setSelectedCaseStudy(caseStudy);
    } else {
      setFormData(INITIAL_FORM_STATE);
      setSelectedCaseStudy(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData(INITIAL_FORM_STATE);
    setSelectedCaseStudy(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.clientName || !formData.slug) {
      alert("Title, client name, and slug are required");
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        title: formData.title,
        clientName: formData.clientName,
        slug: formData.slug,
        serviceId: formData.serviceId || null,
        challenge: formData.challenge,
        solution: formData.solution,
        outcome: formData.outcome,
        narrative: formData.narrative,
        heroImage: formData.heroImage || null,
        beforeImage: formData.beforeImage || null,
        afterImage: formData.afterImage || null,
        images: formData.images,
        videoUrl: formData.videoUrl || null,
        rating: formData.rating ? parseInt(formData.rating) : null,
        timeline: formData.timeline || null,
        keyResults: formData.keyResults ? JSON.parse(formData.keyResults) : null,
        status: formData.status,
        featured: formData.featured,
        displayOrder: formData.displayOrder ? parseInt(formData.displayOrder) : null,
      };

      const url = selectedCaseStudy
        ? `/api/admin/case-studies?id=${selectedCaseStudy.id}`
        : "/api/admin/case-studies";

      const method = selectedCaseStudy ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save case study");
      }

      await fetchCaseStudies();
      handleCloseModal();
      alert(selectedCaseStudy ? "Case study updated successfully" : "Case study created successfully");
    } catch (err) {
      alert("Error: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this case study?")) return;

    try {
      const response = await fetch(`/api/admin/case-studies?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete case study");

      await fetchCaseStudies();
      alert("Case study deleted successfully");
    } catch (err) {
      alert("Error: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const approvedCount = caseStudies.filter((cs) => cs.status === "APPROVED").length;
  const pendingCount = caseStudies.filter((cs) => cs.status === "PENDING").length;
  const featuredCount = caseStudies.filter((cs) => cs.featured).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Case Studies</h1>
          <p className="text-gray-600 mt-2">Manage case studies and client success stories</p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Case Study
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Approved</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{approvedCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Pending</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Featured</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{featuredCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Featured</label>
            <select
              value={featuredFilter}
              onChange={(e) => {
                setFeaturedFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
            >
              <option value="all">All</option>
              <option value="true">Featured Only</option>
              <option value="false">Not Featured</option>
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
          <div className="p-12 text-center">
            <p className="text-gray-600">Loading case studies...</p>
          </div>
        ) : caseStudies.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-600">No case studies found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Client</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Service</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Rating</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Featured</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Created</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {caseStudies.map((caseStudy) => (
                    <tr key={caseStudy.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{caseStudy.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{caseStudy.clientName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{caseStudy.service?.title || "-"}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(caseStudy.status)}`}>
                          {caseStudy.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{caseStudy.rating || "-"}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${caseStudy.featured ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>
                          {caseStudy.featured ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(caseStudy.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenForm(caseStudy)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(caseStudy.id)}
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
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedCaseStudy ? "Edit Case Study" : "New Case Study"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Challenge</label>
                <textarea
                  value={formData.challenge}
                  onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Solution</label>
                <textarea
                  value={formData.solution}
                  onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Outcome</label>
                <textarea
                  value={formData.outcome}
                  onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Narrative (800-1500 words)</label>
                <textarea
                  value={formData.narrative}
                  onChange={(e) => setFormData({ ...formData, narrative: e.target.value })}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                />
              </div>

              {/* Images */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-medium text-gray-900 mb-4">Media</h3>

                {/* Hero Image */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, "heroImage");
                      }}
                      disabled={uploadingImage === "heroImage"}
                      className="flex-1"
                    />
                    {uploadingImage === "heroImage" && <span className="text-sm text-gray-600">Uploading...</span>}
                  </div>
                  {formData.heroImage && (
                    <div className="flex items-center gap-2">
                      <img src={formData.heroImage} alt="Hero" className="w-20 h-20 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, heroImage: "" })}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Before Image */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Before Image</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, "beforeImage");
                      }}
                      disabled={uploadingImage === "beforeImage"}
                      className="flex-1"
                    />
                    {uploadingImage === "beforeImage" && <span className="text-sm text-gray-600">Uploading...</span>}
                  </div>
                  {formData.beforeImage && (
                    <div className="flex items-center gap-2">
                      <img src={formData.beforeImage} alt="Before" className="w-20 h-20 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, beforeImage: "" })}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* After Image */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">After Image</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, "afterImage");
                      }}
                      disabled={uploadingImage === "afterImage"}
                      className="flex-1"
                    />
                    {uploadingImage === "afterImage" && <span className="text-sm text-gray-600">Uploading...</span>}
                  </div>
                  {formData.afterImage && (
                    <div className="flex items-center gap-2">
                      <img src={formData.afterImage} alt="After" className="w-20 h-20 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, afterImage: "" })}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Video URL */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  />
                </div>

                {/* Gallery Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Paste image URL here"
                      id="imageUrl"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const urlInput = document.getElementById("imageUrl") as HTMLInputElement;
                        if (urlInput.value) {
                          handleAddImageUrl(urlInput.value);
                          urlInput.value = "";
                        }
                      }}
                      className="px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img src={img} alt={`Gallery ${idx}`} className="w-full h-20 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-medium text-gray-900 mb-4">Metrics</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timeline (e.g., "6 months")</label>
                    <input
                      type="text"
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Key Results (JSON)</label>
                  <textarea
                    value={formData.keyResults}
                    onChange={(e) => setFormData({ ...formData, keyResults: e.target.value })}
                    rows={3}
                    placeholder='[{"metric": "Revenue", "value": "50%"}]'
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status & Workflow */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-medium text-gray-900 mb-4">Status & Workflow</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                    <input
                      type="number"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-700">Featured</span>
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
                  disabled={isSaving}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : selectedCaseStudy ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
