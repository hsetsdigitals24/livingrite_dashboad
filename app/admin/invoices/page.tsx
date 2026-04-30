"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mail,
  Download,
  Eye,
  Edit2,
  DollarSign,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  client: {
    email: string;
    name: string;
  };
  patientId?: string;
  patient?: {
    firstName: string;
    lastName: string;
  };
  amount: number;
  tax: number;
  discount: number;
  totalAmount: number;
  currency: string;
  status: string;
  servicesData?: any;
  sentAt?: string;
  paidAt?: string;
  dueAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Status colors
  const statusColors: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-800",
    GENERATED: "bg-blue-100 text-blue-800",
    SENT: "bg-yellow-100 text-yellow-800",
    VIEWED: "bg-purple-100 text-purple-800",
    PAID: "bg-green-100 text-green-800",
    OVERDUE: "bg-red-100 text-red-800",
    CANCELLED: "bg-gray-100 text-gray-600",
  };

  // Fetch invoices
  useEffect(() => {
    fetchInvoices();
  }, [filter]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter) params.append("status", filter);
      params.append("limit", "50");

      const response = await fetch(`/api/admin/invoices?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch invoices");

      const { data } = await response.json();
      setInvoices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvoice = async (invoiceId: string) => {
    setActionLoading(`send-${invoiceId}`);
    try {
      const response = await fetch(`/api/admin/invoices/${invoiceId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send" }),
      });

      if (!response.ok) throw new Error("Failed to send invoice");

      const { data } = await response.json();
      setInvoices(
        invoices.map((inv) => (inv.id === invoiceId ? data : inv))
      );
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send invoice");
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkAsPaid = async (invoiceId: string) => {
    setActionLoading(`paid-${invoiceId}`);
    try {
      const response = await fetch(`/api/admin/invoices/${invoiceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PAID" }),
      });

      if (!response.ok) throw new Error("Failed to mark as paid");

      const { data } = await response.json();
      setInvoices(
        invoices.map((inv) => (inv.id === invoiceId ? data : inv))
      );
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mark as paid");
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewInvoice = async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/admin/invoices/${invoiceId}`);
      if (!response.ok) throw new Error("Failed to fetch invoice");

      const { data } = await response.json();
      setSelectedInvoice(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load invoice");
    }
  };

  const handleCreateInvoice = (): void => {
    // Navigate to invoice creation form
    window.location.href = "/admin/invoices/create";
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-gray-600 mt-2">Manage client invoices and payment tracking.</p>
        </div>
        <Button onClick={handleCreateInvoice} className="bg-blue-600 hover:bg-blue-700">
          <DollarSign className="w-4 h-4 mr-2" />
          Create Invoice
        </Button>
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
            Invoice action completed successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        <Button
          variant={filter === null ? "default" : "outline"}
          onClick={() => setFilter(null)}
        >
          All
        </Button>
        {["DRAFT", "GENERATED", "SENT", "VIEWED", "PAID", "OVERDUE"].map(
          (status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              onClick={() => setFilter(status)}
            >
              {status}
            </Button>
          )
        )}
      </div>

      {/* Invoices Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : invoices.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600 mb-4">No invoices found.</p>
          <Button onClick={handleCreateInvoice} className="bg-blue-600 hover:bg-blue-700">
            Create First Invoice
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <Card key={invoice.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="font-semibold text-lg">
                      {invoice.invoiceNumber}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusColors[invoice.status] || statusColors.DRAFT
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <p className="font-medium">Client:</p>
                      <p>{invoice.client.name || "Unknown"}</p>
                      <p className="text-xs">{invoice.client.email}</p>
                    </div>
                    <div>
                      <p className="font-medium">Amount:</p>
                      <p className="text-lg font-semibold">
                        {invoice.currency} {invoice.totalAmount.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Created:</p>
                      <p>{new Date(invoice.createdAt).toLocaleDateString()}</p>
                    </div>
                    {invoice.dueAt && (
                      <div>
                        <p className="font-medium">Due Date:</p>
                        <p>{new Date(invoice.dueAt).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 ml-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewInvoice(invoice.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Invoice Details</DialogTitle>
                      </DialogHeader>
                      {selectedInvoice && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">Invoice #</p>
                              <p>{selectedInvoice.invoiceNumber}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Status</p>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  statusColors[selectedInvoice.status] ||
                                  statusColors.DRAFT
                                }`}
                              >
                                {selectedInvoice.status}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Client</p>
                              <p>{selectedInvoice.client.name}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Amount</p>
                              <p className="text-lg font-semibold">
                                {selectedInvoice.currency}{" "}
                                {selectedInvoice.totalAmount.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          {selectedInvoice.servicesData && (
                            <div>
                              <p className="text-sm font-medium mb-2">
                                Services:
                              </p>
                              <ul className="space-y-1 text-sm">
                                {selectedInvoice.servicesData.map(
                                  (service: any, idx: number) => (
                                    <li key={idx}>
                                      {service.title}: {service.price}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  {invoice.status !== "SENT" &&
                    invoice.status !== "PAID" &&
                    invoice.status !== "VIEWED" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendInvoice(invoice.id)}
                        disabled={
                          actionLoading === `send-${invoice.id}`
                        }
                      >
                        {actionLoading === `send-${invoice.id}` ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Mail className="w-4 h-4" />
                        )}
                      </Button>
                    )}

                  {invoice.status !== "PAID" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMarkAsPaid(invoice.id)}
                      disabled={
                        actionLoading === `paid-${invoice.id}`
                      }
                    >
                      {actionLoading === `paid-${invoice.id}` ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                    </Button>
                  )}

                  <Link href={`/admin/invoices/${invoice.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
