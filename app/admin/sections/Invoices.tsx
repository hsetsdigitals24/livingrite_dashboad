"use client";

import { useState, useEffect } from "react";
import { AlertCircle, Eye, Plus, CheckCircle2, Mail } from "lucide-react";
import { ResponsiveTable } from "@/components/admin/ResponsiveTable";
import { GenerateInvoiceForm } from "../components/GenerateInvoiceForm";

interface InvoiceService {
  serviceId: string;
  title: string;
  amount: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  totalAmount: number;
  tax: number;
  discount: number;
  currency: string;
  status: string;
  services: InvoiceService[] | null;
  notes: string | null;
  client: { id: string; name: string | null; email: string | null } | null;
  booking: { clientName: string; clientEmail: string } | null;
  service: { title: string } | null;
  createdAt: string;
  dueAt: string | null;
  paidAt: string | null;
  sentAt: string | null;
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  GENERATED: "bg-blue-100 text-blue-700",
  SENT: "bg-orange-100 text-orange-700",
  VIEWED: "bg-purple-100 text-purple-700",
  PAID: "bg-green-100 text-green-700",
  OVERDUE: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-100 text-gray-500",
};

export default function InvoicesSection() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filter, setFilter] = useState<"all" | "sent" | "viewed" | "paid" | "overdue">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isGenerateFormOpen, setIsGenerateFormOpen] = useState(false);
  const [markingAsPaid, setMarkingAsPaid] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    setCurrentPage(1);
    fetchInvoices(1);
  }, [filter]);

  const fetchInvoices = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const statusParam = filter !== "all" ? `&status=${filter.toUpperCase()}` : "";
      const res = await fetch(`/api/invoices?page=${page}${statusParam}`);
      if (!res.ok) throw new Error("Failed to fetch invoices");
      const data = await res.json();
      setInvoices(Array.isArray(data.invoices) ? data.invoices : []);
      setTotalPages(data.pagination?.pages || 1);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch invoices");
      setInvoices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsPaid = async (invoiceId: string) => {
    try {
      setActionError("");
      setMarkingAsPaid(invoiceId);
      const res = await fetch(`/api/invoices/${invoiceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "markPaid" }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to mark invoice as paid");
      }
      await fetchInvoices(currentPage);
      if (selectedInvoice?.id === invoiceId) {
        const updated = await fetch(`/api/invoices/${invoiceId}`);
        if (updated.ok) setSelectedInvoice(await updated.json());
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to mark invoice as paid");
    } finally {
      setMarkingAsPaid(null);
    }
  };

  const getClientName = (invoice: Invoice) =>
    invoice.client?.name || invoice.booking?.clientName || "—";
  const getClientEmail = (invoice: Invoice) =>
    invoice.client?.email || invoice.booking?.clientEmail || "";

  const getServicesSummary = (invoice: Invoice) => {
    if (invoice.services && Array.isArray(invoice.services) && invoice.services.length > 0) {
      const names = invoice.services.map((s: any) => s.title).filter(Boolean);
      return names.length > 0 ? names.join(", ") : invoice.service?.title || "—";
    }
    return invoice.service?.title || "—";
  };

  const stats = {
    total: invoices.length,
    paid: invoices.filter((i) => i.status === "PAID").length,
    pending: invoices.filter((i) => ["SENT", "VIEWED"].includes(i.status)).length,
    totalAmount: invoices.reduce((sum, i) => sum + i.totalAmount, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Invoices</h2>
          <p className="text-gray-600 mt-1">Generate and manage client invoices</p>
        </div>
        <button
          onClick={() => setIsGenerateFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          Generate Invoice
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "sent", "viewed", "paid", "overdue"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg font-medium text-sm transition-colors ${
              filter === f
                ? "bg-teal-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Invoices", value: stats.total, color: "text-gray-900" },
          { label: "Paid", value: stats.paid, color: "text-green-600" },
          { label: "Pending", value: stats.pending, color: "text-orange-600" },
          { label: "Total Billed", value: `₦${stats.totalAmount.toLocaleString()}`, color: "text-teal-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-4 rounded-xl border border-gray-200">
            <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex gap-2 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}
      {actionError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex gap-2 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          {actionError}
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="animate-spin inline-block w-7 h-7 border-4 border-teal-600 border-t-transparent rounded-full"></div>
          <p className="text-gray-500 mt-3 text-sm">Loading invoices...</p>
        </div>
      ) : invoices.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
          <Mail className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No invoices found</p>
          <p className="text-gray-400 text-sm mt-1">Generate an invoice to get started</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <ResponsiveTable
            columns={[
              {
                label: "Invoice #",
                key: "invoiceNumber",
                render: (val) => <span className="font-semibold">{val}</span>,
              },
              {
                label: "Client",
                key: "client",
                render: (_, row) => (
                  <div>
                    <div className="font-medium text-gray-900">{getClientName(row)}</div>
                    <div className="text-xs text-gray-500">{getClientEmail(row)}</div>
                  </div>
                ),
              },
              {
                label: "Services",
                key: "services",
                render: (_, row) => (
                  <span className="text-gray-600 text-xs line-clamp-2">
                    {getServicesSummary(row)}
                  </span>
                ),
              },
              {
                label: "Amount",
                key: "totalAmount",
                render: (val) => (
                  <span className="font-semibold">₦{val.toLocaleString()}</span>
                ),
              },
              {
                label: "Status",
                key: "status",
                render: (val) => (
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                      STATUS_COLORS[val] || STATUS_COLORS.DRAFT
                    }`}
                  >
                    {val}
                  </span>
                ),
              },
              {
                label: "Created",
                key: "createdAt",
                render: (val) => new Date(val).toLocaleDateString(),
              },
              {
                label: "Due",
                key: "dueAt",
                render: (val) => (val ? new Date(val).toLocaleDateString() : "—"),
              },
            ]}
            data={invoices}
            isLoading={isLoading}
            emptyMessage="No invoices found"
            rowActions={(invoice) => (
              <div className="flex gap-1">
                {invoice.status !== "PAID" && invoice.status !== "CANCELLED" && (
                  <button
                    onClick={() => handleMarkAsPaid(invoice.id)}
                    disabled={markingAsPaid === invoice.id}
                    className="p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg disabled:opacity-50 transition"
                    title="Mark as Paid"
                  >
                    {markingAsPaid === invoice.id ? (
                      <div className="w-4 h-4 rounded-full border-2 border-green-600 border-t-transparent animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                  </button>
                )}
                <button
                  onClick={() => setSelectedInvoice(invoice)}
                  className="p-1.5 text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            )}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t bg-gray-50 flex items-center justify-between text-sm">
              <span className="text-gray-500">Page {currentPage} of {totalPages}</span>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setCurrentPage((p) => p - 1);
                    fetchInvoices(currentPage - 1);
                  }}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-white disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => {
                    setCurrentPage((p) => p + 1);
                    fetchInvoices(currentPage + 1);
                  }}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded border border-gray-300 text-gray-600 hover:bg-white disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedInvoice.invoiceNumber}</h3>
                <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[selectedInvoice.status] || STATUS_COLORS.DRAFT}`}>
                  {selectedInvoice.status}
                </span>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className="p-1 text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="space-y-4 text-sm">
              {/* Client */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 font-medium uppercase mb-1">Client</p>
                <p className="font-semibold text-gray-900">{getClientName(selectedInvoice)}</p>
                <p className="text-gray-500">{getClientEmail(selectedInvoice)}</p>
              </div>

              {/* Services */}
              {selectedInvoice.services && Array.isArray(selectedInvoice.services) && selectedInvoice.services.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase mb-2">Services</p>
                  <table className="w-full">
                    <tbody>
                      {(selectedInvoice.services as InvoiceService[]).map((s, i) => (
                        <tr key={i}>
                          <td className="py-1 text-gray-700">{s.title}</td>
                          <td className="py-1 text-right font-medium">₦{s.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Amount Breakdown */}
              <div className="border-t pt-3 space-y-1.5">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₦{selectedInvoice.amount.toLocaleString()}</span>
                </div>
                {selectedInvoice.tax > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>₦{selectedInvoice.tax.toLocaleString()}</span>
                  </div>
                )}
                {selectedInvoice.discount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount</span>
                    <span>-₦{selectedInvoice.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base pt-1 border-t">
                  <span>Total</span>
                  <span className="text-teal-600">₦{selectedInvoice.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="font-medium">{new Date(selectedInvoice.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Due Date</p>
                  <p className="font-medium">{selectedInvoice.dueAt ? new Date(selectedInvoice.dueAt).toLocaleDateString() : "—"}</p>
                </div>
                {selectedInvoice.sentAt && (
                  <div>
                    <p className="text-xs text-gray-500">Sent</p>
                    <p className="font-medium">{new Date(selectedInvoice.sentAt).toLocaleDateString()}</p>
                  </div>
                )}
                {selectedInvoice.paidAt && (
                  <div>
                    <p className="text-xs text-gray-500">Paid On</p>
                    <p className="font-medium text-green-600">{new Date(selectedInvoice.paidAt).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              {selectedInvoice.notes && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600 font-medium mb-1">Notes</p>
                  <p className="text-gray-700 text-sm">{selectedInvoice.notes}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-2">
              {selectedInvoice.status !== "PAID" && selectedInvoice.status !== "CANCELLED" && (
                <button
                  onClick={() => { handleMarkAsPaid(selectedInvoice.id); setSelectedInvoice(null); }}
                  disabled={markingAsPaid === selectedInvoice.id}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium text-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Mark as Paid
                </button>
              )}
              <button
                onClick={() => setSelectedInvoice(null)}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <GenerateInvoiceForm
        isOpen={isGenerateFormOpen}
        onClose={() => setIsGenerateFormOpen(false)}
        onSuccess={() => { setIsGenerateFormOpen(false); fetchInvoices(1); }}
      />
    </div>
  );
}
