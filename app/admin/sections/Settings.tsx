'use client';

import { Edit, Eye, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import ServiceForm from '../components/ServiceForm';
import ServiceView from '../components/ServiceView';
import PopupForm from '../components/PopupForm';

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

interface InvitationCode {
  id: string;
  code: string;
  createdAt: string;
  expiresAt: string;
  isUsed: boolean;
  usedBy: string | null;
  usedAt: string | null;
}

interface Popup {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  actionButtonText: string;
  actionButtonUrl: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

type Tab = 'services' | 'codes' | 'popups';
type ServiceModalMode = 'create' | 'edit' | 'view' | null;

export default function SettingsSection() {
  const [activeTab, setActiveTab] = useState<Tab>('services');
  const [services, setServices] = useState<Service[]>([]);
  const [codes, setCodes] = useState<InvitationCode[]>([]);
  const [popups, setPopups] = useState<Popup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [generatingCode, setGeneratingCode] = useState(false);
  const [expiryDays, setExpiryDays] = useState(30);
  
  // Service modal states
  const [serviceModalMode, setServiceModalMode] = useState<ServiceModalMode>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [popupModalMode, setPopupModalMode] = useState<'create' | 'edit' | null>(null);
  const [selectedPopup, setSelectedPopup] = useState<Popup | null>(null);

  // Fetch services
  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/services');
      const result = await response.json();
      if (Array.isArray(result)) {
        setServices(result);
      } else if (result.error) {
        setError('Failed to load services');
      } else {
        setServices(result);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('An error occurred while fetching services');
    } finally {
      setLoading(false);
    }
  };

  // Fetch invitation codes
  const fetchCodes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/codes');
      const result = await response.json();
      setCodes(result);
      setError(null);
    } catch (err) {
      console.error('Error fetching codes:', err);
      setError('An error occurred while fetching codes');
    } finally {
      setLoading(false);
    }
  };

  // Fetch popups
  const fetchPopups = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/popups');
      const result = await response.json();
      setPopups(result);
      setError(null);
    } catch (err) {
      console.error('Error fetching popups:', err);
      setError('An error occurred while fetching popups');
    } finally {
      setLoading(false);
    }
  };

  // Generate new invitation code
  const handleGenerateCode = async () => {
    try {
      setGeneratingCode(true);
      const response = await fetch('/api/admin/codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expiryDays }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate code');
      }

      const newCode = await response.json();
      setCodes([newCode, ...codes]);
      setSuccessMessage('Invitation code generated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error generating code:', err);
      setError('Failed to generate invitation code');
    } finally {
      setGeneratingCode(false);
    }
  };
  const handleDeleteCode = async (codeId: string) => {
    if (!confirm('Are you sure you want to delete this code? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/codes/${codeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete code');
      }

      setCodes(codes.filter((c) => c.id !== codeId));
      setSuccessMessage('Invitation code deleted successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error deleting code:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete code');
    }
  }

  // Delete service
  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete service');
      }

      setServices(services.filter((s) => s.id !== serviceId));
      setSuccessMessage('Service deleted successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error deleting service:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete service');
    }
  };

  // Toggle service active status
  const handleToggleService = async (service: Service) => {
    try {
      const response = await fetch(`/api/admin/services/${service.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !service.isActive }),
      });

      if (!response.ok) {
        throw new Error('Failed to update service');
      }

      setServices(
        services.map((s) =>
          s.id === service.id ? { ...s, isActive: !s.isActive } : s
        )
      );
    } catch (err) {
      console.error('Error updating service:', err);
      setError('Failed to update service');
    }
  };

  const handleViewService = (serviceId: string) => {
    try {
      const service = services.find((s) => s.id === serviceId);
      if (!service) {
        throw new Error('Service not found');
      }
      setSelectedService(service);
      setServiceModalMode('view');
    } catch (err) {
      console.error('Error viewing service:', err);
      setError(err instanceof Error ? err.message : 'Failed to view service');
    }
  };

  const handleEditService = (serviceId: string) => {
    try {
      const service = services.find((s) => s.id === serviceId);
      if (!service) {
        throw new Error('Service not found');
      }
      setSelectedService(service);
      setServiceModalMode('edit');
    } catch (err) {
      console.error('Error editing service:', err);
      setError(err instanceof Error ? err.message : 'Failed to edit service');
    }
  };

  const handleCreateService = () => {
    setSelectedService(null);
    setServiceModalMode('create');
  };

  const handleServiceFormClose = () => {
    setServiceModalMode(null);
    setSelectedService(null);
  };

  const handleServiceFormSuccess = (updatedService: Service) => {
    if (serviceModalMode === 'create') {
      setServices([updatedService, ...services]);
      setSuccessMessage('Service created successfully!');
    } else if (serviceModalMode === 'edit') {
      setServices(
        services.map((s) => (s.id === updatedService.id ? updatedService : s))
      );
      setSuccessMessage('Service updated successfully!');
    }
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Popup handlers
  const handleCreatePopup = () => {
    setSelectedPopup(null);
    setPopupModalMode('create');
  };

  const handleEditPopup = (popupId: string) => {
    const popup = popups.find((p) => p.id === popupId);
    if (popup) {
      setSelectedPopup(popup);
      setPopupModalMode('edit');
    }
  };

  const handleDeletePopup = async (popupId: string) => {
    if (!confirm('Are you sure you want to delete this popup?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/popups/${popupId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete popup');
      }

      setPopups(popups.filter((p) => p.id !== popupId));
      setSuccessMessage('Popup deleted successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error deleting popup:', err);
      setError('Failed to delete popup');
    }
  };

  const handleTogglePopup = async (popup: Popup) => {
    try {
      const response = await fetch(`/api/admin/popups/${popup.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !popup.isActive }),
      });

      if (!response.ok) {
        throw new Error('Failed to update popup');
      }

      setPopups(
        popups.map((p) =>
          p.id === popup.id ? { ...p, isActive: !p.isActive } : p
        )
      );
    } catch (err) {
      console.error('Error updating popup:', err);
      setError('Failed to update popup');
    }
  };

  const handlePopupFormClose = () => {
    setPopupModalMode(null);
    setSelectedPopup(null);
  };

  const handlePopupFormSuccess = (updatedPopup: Popup) => {
    if (popupModalMode === 'create') {
      setPopups([updatedPopup, ...popups]);
      setSuccessMessage('Popup created successfully!');
    } else if (popupModalMode === 'edit') {
      setPopups(
        popups.map((p) => (p.id === updatedPopup.id ? updatedPopup : p))
      );
      setSuccessMessage('Popup updated successfully!');
    }
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  useEffect(() => {
    if (activeTab === 'services') {
      fetchServices();
    } else if (activeTab === 'codes') {
      fetchCodes();
    } else if (activeTab === 'popups') {
      fetchPopups();
    }
  }, [activeTab]);

  return (
    
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-600 mt-1">Manage services and invitation codes</p>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-2 text-red-600 hover:text-red-800 font-medium"
            >
              ✕
            </button>
          </div>
        )}

        {successMessage && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
            {successMessage}
            <button
              onClick={() => setSuccessMessage(null)}
              className="ml-2 text-green-600 hover:text-green-800 font-medium"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('services')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'services'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Services
            </button>
            <button
              onClick={() => setActiveTab('codes')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'codes'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Invitation Codes
            </button>
            <button
              onClick={() => setActiveTab('popups')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'popups'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Landing Page Popups
            </button>
          </div>
        </div>

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Services</h2>
            <button
              onClick={handleCreateService}
              className="bg-primary text-white pointer font-medium px-4 py-2 rounded-lg hover:bg-primary/70 transition-colors"
            >
              + Create Service
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Loading services...</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Slug
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {services.length > 0 ? (
                    services.map((service) => (
                      <tr
                        key={service.id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                          {service.title}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                            {service.slug}
                          </code>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {service.basePrice
                            ? `${service.basePrice} ${service.currency}`
                            : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => handleToggleService(service)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              service.isActive
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            {service.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(service.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm flex">
                          <button
                            onClick={() => handleDeleteService(service.id)}
                            className="text-red-600 hover:text-red-800 font-medium transition-colors"
                          >
                            <Trash2 className='h-4 w-4'/>
                          </button>

                          <button
                            onClick={() => handleViewService(service.id)}
                            className="ml-4 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                          >
                            <Eye className='h-4 w-4'/>
                          </button>

                          <button
                            onClick={() => handleEditService(service.id)}
                            className="ml-4 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                          >
                            <Edit className='h-4 w-4'/>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No services found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Invitation Codes Tab */}
      {activeTab === 'codes' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Invitation Codes</h2>
            <div className="flex gap-3">
              <div className="flex items-center gap-2">
                <label htmlFor="expiry" className="text-sm font-medium text-gray-700">
                  Expires in (days):
                </label>
                <input
                  id="expiry"
                  type="number"
                  min="1"
                  max="365"
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(parseInt(e.target.value))}
                  className="w-16 px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleGenerateCode}
                disabled={generatingCode}
                className="bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {generatingCode ? 'Generating...' : '+ Generate Code'}
              </button>
            </div>
          </div>

            {/* Code Statistics */}
          {codes.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">Active Codes</p>
                <p className="text-2xl font-bold text-green-600">
                  {codes.filter((c) => !c.isUsed && new Date(c.expiresAt) > new Date()).length}
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">Used Codes</p>
                <p className="text-2xl font-bold text-blue-600">{codes.filter((c) => c.isUsed).length}</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">Expired Codes</p>
                <p className="text-2xl font-bold text-red-600">
                  {codes.filter((c) => !c.isUsed && new Date(c.expiresAt) < new Date()).length}
                </p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Loading codes...</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Expires
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Used By
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Used At
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Created
                    </th>
                    <th>
                        <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {codes.length > 0 ? (
                    codes.map((code) => {
                      const isExpired = new Date(code.expiresAt) < new Date();
                      return (
                        <tr
                          key={code.id}
                          className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm font-mono text-gray-900 font-medium">
                            {code.code}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                                code.isUsed
                                  ? 'bg-blue-100 text-blue-800'
                                  : isExpired
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {code.isUsed ? 'Used' : isExpired ? 'Expired' : 'Active'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(code.expiresAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {code.usedBy || '—'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {code.usedAt ? new Date(code.usedAt).toLocaleDateString() : '—'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(code.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <button
                              onClick={() => handleDeleteCode(code.id)}
                              className="text-red-600 hover:text-red-800 font-medium transition-colors"
                            >
                              <Trash2 className='h-4 w-4'/>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No invitation codes found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Popups Tab */}
      {activeTab === 'popups' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Landing Page Popups</h2>
            <button
              onClick={handleCreatePopup}
              className="bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Create Popup
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Loading popups...</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Button Text
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {popups.length > 0 ? (
                    popups
                      .sort((a, b) => a.displayOrder - b.displayOrder)
                      .map((popup) => (
                        <tr
                          key={popup.id}
                          className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                            {popup.title}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {popup.actionButtonText}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <button
                              onClick={() => handleTogglePopup(popup)}
                              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                popup.isActive
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              }`}
                            >
                              {popup.isActive ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {popup.displayOrder}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(popup.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm flex gap-2">
                            <button
                              onClick={() => handleEditPopup(popup.id)}
                              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeletePopup(popup.id)}
                              className="text-red-600 hover:text-red-800 font-medium transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No popups found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {(serviceModalMode === 'create' || serviceModalMode === 'edit') && (
        <ServiceForm
          service={selectedService}
          onClose={handleServiceFormClose}
          onSuccess={handleServiceFormSuccess}
        />
      )}

      {serviceModalMode === 'view' && selectedService && (
        <ServiceView service={selectedService} onClose={handleServiceFormClose} />
      )}

      {(popupModalMode === 'create' || popupModalMode === 'edit') && (
        <PopupForm
          popup={selectedPopup}
          onClose={handlePopupFormClose}
          onSuccess={handlePopupFormSuccess}
        />
      )}
    </div>
  );
}