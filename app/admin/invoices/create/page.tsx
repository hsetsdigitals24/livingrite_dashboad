"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2, Plus, Trash2 } from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string;
}

interface Service {
  id: string;
  title: string;
  basePrice: number;
}

interface InvoiceFormData {
  clientId: string;
  patientId?: string;
  amount: number;
  services: Array<{
    serviceId: string;
    title: string;
    price: number;
  }>;
  tax: number;
  discount: number;
  paymentNote?: string;
  dueAt?: string;
}

export default function CreateInvoicePage() {
  const router = useRouter();
  const [clients, setClients] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { isSubmitting },
  } = useForm<InvoiceFormData>({
    defaultValues: {
      amount: 0,
      tax: 0,
      discount: 0,
      services: [{ serviceId: "", title: "", price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "services",
  });

  const watchAmount = watch("amount") || 0;
  const watchTax = watch("tax") || 0;
  const watchDiscount = watch("discount") || 0;
  const totalAmount = watchAmount + watchTax - watchDiscount;

  // Fetch clients and services
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all clients (users with CLIENT role)
        const clientsResponse = await fetch("/api/admin/clients");
        if (!clientsResponse.ok) throw new Error("Failed to fetch clients");
        const { data: clientsData } = await clientsResponse.json();
        setClients(clientsData);

        // Fetch all services
        const servicesResponse = await fetch("/api/admin/services");
        if (!servicesResponse.ok) throw new Error("Failed to fetch services");
        const { data: servicesData } = await servicesResponse.json();
        setServices(servicesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: InvoiceFormData) => {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          amount: parseFloat(String(data.amount)),
          tax: parseFloat(String(data.tax)),
          discount: parseFloat(String(data.discount)),
          servicesData: data.services,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create invoice");
      }

      const { data: invoice } = await response.json();
      setSuccess(true);
      setTimeout(() => {
        router.push(`/admin/invoices/${invoice.id}`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create invoice");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create Invoice</h1>
        <p className="text-gray-600 mt-2">
          Generate a new invoice for a client.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">
            Invoice created successfully! Redirecting...
          </AlertDescription>
        </Alert>
      )}

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Client Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Client *
            </label>
            <select
              {...register("clientId", { required: "Client is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select a Client --</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} ({client.email})
                </option>
              ))}
            </select>
          </div>

          {/* Services */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium">Services</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({ serviceId: "", title: "", price: 0 })
                }
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </div>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-4">
                  <select
                    {...register(`services.${index}.serviceId`)}
                    onChange={(e) => {
                      const selected = services.find(
                        (s) => s.id === e.target.value
                      );
                      if (selected) {
                        const inputs = document.querySelectorAll(
                          `input[name="services.${index}.title"]`
                        );
                        const priceInputs = document.querySelectorAll(
                          `input[name="services.${index}.price"]`
                        );
                        if (inputs[0]) {
                          (inputs[0] as HTMLInputElement).value =
                            selected.title;
                        }
                        if (priceInputs[0]) {
                          (priceInputs[0] as HTMLInputElement).value = String(
                            selected.basePrice
                          );
                        }
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select service</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                  <Input
                    {...register(`services.${index}.title`)}
                    placeholder="Service title"
                    className="flex-1"
                    readOnly
                  />
                  <Input
                    {...register(`services.${index}.price`, {
                      valueAsNumber: true,
                    })}
                    type="number"
                    placeholder="Price"
                    className="w-24"
                    step="0.01"
                  />
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Subtotal
              </label>
              <Input
                {...register("amount", { valueAsNumber: true })}
                type="number"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tax</label>
              <Input
                {...register("tax", { valueAsNumber: true })}
                type="number"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Discount</label>
              <Input
                {...register("discount", { valueAsNumber: true })}
                type="number"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Total */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600 mb-1">Total Amount Due</p>
            <p className="text-3xl font-bold text-blue-600">
              NGN {totalAmount.toFixed(2)}
            </p>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Due Date (Optional)
            </label>
            <Input
              {...register("dueAt")}
              type="date"
              className="w-full"
            />
          </div>

          {/* Payment Note */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Payment Instructions (Optional)
            </label>
            <textarea
              {...register("paymentNote")}
              placeholder="Special instructions for this invoice..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Invoice"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
