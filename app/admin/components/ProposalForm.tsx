'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, AlertCircle } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  basePrice?: number;
  currency?: string;
}

interface ProposalFormProps {
  bookingId: string;
  clientName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProposalForm({
  bookingId,
  clientName,
  onClose,
  onSuccess,
}: ProposalFormProps) {
  const [loading, setLoading] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);
  const [error, setError] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState({
    title: `Proposal for ${clientName}`,
    description: '',
    selectedServices: [] as string[],
    totalAmount: '',
    currency: 'NGN',
    validDays: '30',
    notes: '',
  });

  // Fetch services on mount
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoadingServices(true);
      const response = await fetch('/api/services');
      if (!response.ok) throw new Error('Failed to fetch services');
      const data = await response.json();
      setServices(data.data || data || []);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoadingServices(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter((id) => id !== serviceId)
        : [...prev.selectedServices, serviceId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Proposal title is required');
      return;
    }

    if (!formData.totalAmount.trim()) {
      setError('Total amount is required');
      return;
    }

    setLoading(true);

    try {
      // Build services offered
      const selectedServiceDetails = services.filter((s) =>
        formData.selectedServices.includes(s.id)
      );

      const validUntilDate = new Date();
      validUntilDate.setDate(
        validUntilDate.getDate() + parseInt(formData.validDays)
      );

      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          title: formData.title,
          description: formData.description || null,
          servicesOffered: selectedServiceDetails.length > 0 ? selectedServiceDetails : null,
          totalAmount: parseFloat(formData.totalAmount),
          currency: formData.currency,
          validUntil: validUntilDate.toISOString(),
          notes: formData.notes || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create proposal');
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-lg bg-white max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b p-6 sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">New Proposal</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {error && (
            <div className="flex items-center gap-3 rounded-lg bg-red-50 p-3 text-red-700">
              <AlertCircle size={20} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proposal Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-cyan-500 focus:outline-none"
              placeholder="Proposal title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-cyan-500 focus:outline-none"
              placeholder="Proposal description"
            />
          </div>

          {!loadingServices && services.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Services
              </label>
              <div className="space-y-2 border rounded-lg p-3 bg-gray-50">
                {services.map((service) => (
                  <label key={service.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.selectedServices.includes(service.id)}
                      onChange={() => handleServiceToggle(service.id)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">
                      {service.title}
                      {service.basePrice && (
                        <span className="text-gray-500">
                          {' '}(₦{service.basePrice.toLocaleString()})
                        </span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Amount *
              </label>
              <input
                type="number"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-cyan-500 focus:outline-none"
                placeholder="0.00"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-cyan-500 focus:outline-none"
              >
                <option value="NGN">NGN</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valid For (days)
            </label>
            <input
              type="number"
              name="validDays"
              value={formData.validDays}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-cyan-500 focus:outline-none"
              placeholder="30"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Internal Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-cyan-500 focus:outline-none"
              placeholder="Internal notes"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-cyan-500 text-white hover:bg-cyan-600 disabled:bg-gray-400"
            >
              {loading ? 'Creating...' : 'Create Proposal'}
            </Button>
          </div>
        </form>
      </Card>
    </Card>
  );
}
