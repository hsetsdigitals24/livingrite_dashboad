import { Edit, Eye, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import ServiceForm from "../../components/ServiceForm";
import ServiceView from "../../components/ServiceView";

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


type ServiceModalMode = 'create' | 'edit' | 'view' | null;

const ServicesSection = () => {
// Service modal states
  const [serviceModalMode, setServiceModalMode] = useState<ServiceModalMode>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

      // Fetch services
      const fetchServices = async () => {
        try {
          setLoading(true);
          const response = await fetch('/api/admin/services');
          const result = await response.json();
          console.log({"result": result});
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
     
      useEffect(() => {
        fetchServices();
      }, []);
      
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
    
    return (
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
            <>
              {/* Desktop Table */}
              <div className="hidden md:block border border-gray-200 rounded-lg overflow-x-auto">
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
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        No services found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              </div>

              {/* Mobile Card Layout */}
              <div className="md:hidden space-y-3">
                {services.length > 0 ? (
                  services.map((service) => (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm">{service.title}</p>
                          <p className="text-xs text-gray-500 truncate">{service.slug}</p>
                        </div>
                        <span className={`flex-shrink-0 px-2 py-1 rounded text-xs font-medium ${
                          service.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {service.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-gray-500">Price</p>
                          <p className="font-semibold text-gray-900">{service.currency} {service.basePrice || '0'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Created</p>
                          <p className="font-semibold text-gray-900">{new Date(service.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2 border-t">
                        <button onClick={() => handleViewService(service.id)} className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50">
                          View
                        </button>
                        <button onClick={() => handleEditService(service.id)} className="flex-1 px-3 py-1.5 text-xs border border-blue-300 text-blue-600 rounded hover:bg-blue-50">
                          Edit
                        </button>
                        <button onClick={() => handleToggleService(service)} className="flex-1 px-3 py-1.5 text-xs border border-orange-300 text-orange-600 rounded hover:bg-orange-50">
                          {service.isActive ? 'Disable' : 'Enable'}
                        </button>
                        <button onClick={() => handleDeleteService(service.id)} className="flex-1 px-3 py-1.5 text-xs border border-red-300 text-red-600 rounded hover:bg-red-50">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No services found</p>
                )}
              </div>
            </>
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
        </div>
    )
}
    export default ServicesSection;