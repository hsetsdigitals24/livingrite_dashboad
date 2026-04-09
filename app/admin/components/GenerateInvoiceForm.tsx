"use client";

import { useState, useEffect } from "react";
import { AlertCircle, X, Plus, Trash2 } from "lucide-react";

interface Client {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
}

interface Service {
  id: string;
  title: string;
  basePrice: number | null;
}

interface ServiceLineItem {
  serviceId: string;
  title: string;
  amount: number;
}

interface GenerateInvoiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function GenerateInvoiceForm({ isOpen, onClose, onSuccess }: GenerateInvoiceFormProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [lineItems, setLineItems] = useState<ServiceLineItem[]>([{ serviceId: "", title: "", amount: 0 }]);
  const [tax, setTax] = useState("0");
  const [discount, setDiscount] = useState("0");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [error, setError] = useState("");

  const subtotal = lineItems.reduce((sum, item) => sum + (item.amount || 0), 0);
  const taxNum = parseFloat(tax) || 0;
  const discountNum = parseFloat(discount) || 0;
  const totalAmount = Math.max(0, subtotal + taxNum - discountNum);

  useEffect(() => {
    if (isOpen) {
      loadData();
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setSelectedClientId("");
    setSelectedClient(null);
    setLineItems([{ serviceId: "", title: "", amount: 0 }]);
    setTax("0");
    setDiscount("0");
    setNotes("");
    setError("");
  };

  const loadData = async () => {
    setIsLoadingData(true);
    setError("");
    try {
      const [clientsRes, servicesRes] = await Promise.all([
        fetch("/api/admin/clients?limit=200"),
        fetch("/api/services"),
      ]);
      if (!clientsRes.ok) throw new Error("Failed to load clients");
      if (!servicesRes.ok) throw new Error("Failed to load services");
      const clientsData = await clientsRes.json();
      const servicesData = await servicesRes.json();
      setClients(Array.isArray(clientsData) ? clientsData : clientsData.clients || []);
      setServices(Array.isArray(servicesData) ? servicesData : servicesData.services || []);
    } catch (err) {
      setError("Failed to load clients or services");
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
    setSelectedClient(clients.find((c) => c.id === clientId) || null);
  };

  const handleServiceSelect = (index: number, serviceId: string) => {
    const service = services.find((s) => s.id === serviceId);
    setLineItems((prev) => {
      const updated = [...prev];
      updated[index] = {
        serviceId,
        title: service?.title || "",
        amount: service?.basePrice || 0,
      };
      return updated;
    });
  };

  const handleAmountChange = (index: number, value: string) => {
    setLineItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], amount: parseFloat(value) || 0 };
      return updated;
    });
  };

  const addLineItem = () => {
    setLineItems((prev) => [...prev, { serviceId: "", title: "", amount: 0 }]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length === 1) return;
    setLineItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedClientId) { setError("Please select a client"); return; }
    if (lineItems.some((item) => !item.serviceId)) { setError("Please select a service for each line item"); return; }
    if (subtotal <= 0) { setError("Total amount must be greater than 0"); return; }
    if (discountNum >= subtotal) { setError("Discount cannot be equal to or greater than the subtotal"); return; }

    setIsLoading(true);
    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: selectedClientId,
          services: lineItems.map((item) => ({
            serviceId: item.serviceId,
            title: item.title,
            amount: item.amount,
          })),
          amount: subtotal,
          tax: taxNum,
          discount: discountNum,
          notes: notes || undefined,
          currency: "NGN",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate invoice");
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate invoice");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Generate Invoice</h3>
            <p className="text-sm text-gray-500 mt-0.5">Select a client and services to bill</p>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 flex gap-2 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Client Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Client <span className="text-red-500">*</span>
            </label>
            {isLoadingData ? (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 text-sm">
                Loading clients...
              </div>
            ) : clients.length === 0 ? (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
                No clients found
              </div>
            ) : (
              <select
                value={selectedClientId}
                onChange={(e) => handleClientSelect(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              >
                <option value="">— Select a client —</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name || "Unnamed"} {client.email ? `(${client.email})` : ""}
                  </option>
                ))}
              </select>
            )}
            {selectedClient && (
              <div className="mt-2 px-3 py-2 bg-teal-50 border border-teal-200 rounded-lg text-sm text-teal-800">
                <strong>{selectedClient.name}</strong>
                {selectedClient.email && <span className="ml-2 text-teal-600">{selectedClient.email}</span>}
                {selectedClient.phone && <span className="ml-2 text-teal-600">{selectedClient.phone}</span>}
              </div>
            )}
          </div>

          {/* Service Line Items */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">
                Services <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={addLineItem}
                className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                Add service
              </button>
            </div>

            <div className="space-y-2">
              {lineItems.map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <select
                    value={item.serviceId}
                    onChange={(e) => handleServiceSelect(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  >
                    <option value="">— Select service —</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}{s.basePrice ? ` — ₦${s.basePrice.toLocaleString()}` : ""}
                      </option>
                    ))}
                  </select>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₦</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.amount || ""}
                      onChange={(e) => handleAmountChange(index, e.target.value)}
                      placeholder="0.00"
                      className="w-32 pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                    />
                  </div>
                  {lineItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLineItem(index)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tax & Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tax (₦)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={tax}
                onChange={(e) => setTax(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Discount (₦)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Notes <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes for the client..."
              rows={2}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm resize-none"
            />
          </div>

          {/* Total Summary */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
            {taxNum > 0 && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax</span>
                <span>+₦{taxNum.toLocaleString()}</span>
              </div>
            )}
            {discountNum > 0 && (
              <div className="flex justify-between text-sm text-red-600">
                <span>Discount</span>
                <span>-₦{discountNum.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-gray-300">
              <span className="font-bold text-gray-900">Total Due</span>
              <span className="text-xl font-bold text-teal-600">
                ₦{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
            📧 An invoice email with LivingRite's bank account details will be sent to the client automatically.
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !selectedClientId || lineItems.some((i) => !i.serviceId) || subtotal <= 0}
              className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium text-sm transition"
            >
              {isLoading ? "Generating..." : "Generate & Send Invoice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
