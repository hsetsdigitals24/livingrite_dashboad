"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AlertCircle, Download, CreditCard } from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  totalAmount: number;
  currency: string;
  status: string;
  createdAt: string;
  dueAt: string | null;
  paidAt: string | null;
  bookingId: string;
}

function InvoicesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "unpaid" | "paid">("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, [filter]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const url =
        filter === "all"
          ? "/api/invoices/my-invoices"
          : `/api/invoices/my-invoices?status=${
              filter === "paid" ? "PAID" : "SENT"
            }`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch invoices");

      const data = await response.json();
      setInvoices(data);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch invoices"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePay = (invoiceId: string, bookingId: string) => {
    router.push(`/client/booking/payment?bookingId=${bookingId}`);
  };

  const downloadInvoice = async (invoiceId: string, invoiceNumber: string) => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${invoiceNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("Failed to download invoice");
      }
    } catch (err) {
      alert("Error downloading invoice");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-100 text-gray-800";
      case "SENT":
        return "bg-orange-100 text-orange-800";
      case "PAID":
        return "bg-green-100 text-green-800";
      case "OVERDUE":
        return "bg-red-100 text-red-800";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Invoices</h1>
        <p className="text-gray-600">View and manage your invoices</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {(["all", "unpaid", "paid"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === f
                ? "bg-teal-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {f === "unpaid" ? "Unpaid" : f === "paid" ? "Paid" : "All"} Invoices
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Total Invoices</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {invoices.length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Amount Due</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">
            ₦
            {invoices
              .filter((i) => i.status !== "PAID")
              .reduce((sum, inv) => sum + inv.totalAmount, 0)
              .toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Amount Paid</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            ₦
            {invoices
              .filter((i) => i.status === "PAID")
              .reduce((sum, inv) => sum + inv.totalAmount, 0)
              .toLocaleString()}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex gap-2 mb-6">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Invoices List */}
      {loading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full"></div>
          <p className="text-gray-600 mt-4">Loading invoices...</p>
        </div>
      ) : invoices.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">No invoices found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {invoice.invoiceNumber}
                    </h3>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        invoice.status
                      )}`}
                    >
                      {invoice.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mt-3">
                    <div>
                      <p className="text-xs text-gray-500">Created</p>
                      <p className="font-medium">
                        {new Date(invoice.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Due Date</p>
                      <p className="font-medium">
                        {invoice.dueAt
                          ? new Date(invoice.dueAt).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Amount</p>
                      <p className="font-bold text-gray-900">
                        ₦{invoice.totalAmount.toLocaleString()}
                      </p>
                    </div>
                    {invoice.paidAt && (
                      <div>
                        <p className="text-xs text-gray-500">Paid On</p>
                        <p className="font-medium text-green-600">
                          {new Date(invoice.paidAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 items-center flex-shrink-0">
                  <button
                    onClick={() =>
                      downloadInvoice(invoice.id, invoice.invoiceNumber)
                    }
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
                    title="Download Invoice"
                  >
                    <Download className="w-5 h-5" />
                  </button>

                  {invoice.status !== "PAID" && (
                    <button
                      onClick={() =>
                        handlePay(invoice.id, invoice.bookingId)
                      }
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium flex items-center gap-2"
                    >
                      <CreditCard className="w-5 h-5" />
                      Pay Now
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedInvoice(invoice)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Invoice Details</h3>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Invoice Number</p>
                  <p className="font-semibold text-gray-900">
                    {selectedInvoice.invoiceNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      selectedInvoice.status
                    )}`}
                  >
                    {selectedInvoice.status}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-gray-600">Amount:</p>
                    <p className="font-semibold">
                      {selectedInvoice.currency}
                      {selectedInvoice.amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex justify-between pt-2 border-t font-bold text-lg">
                    <p>Total:</p>
                    <p className="text-green-600">
                      ₦{selectedInvoice.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Created</p>
                    <p className="font-semibold">
                      {new Date(selectedInvoice.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Due Date</p>
                    <p className="font-semibold">
                      {selectedInvoice.dueAt
                        ? new Date(selectedInvoice.dueAt).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>

              {selectedInvoice.paidAt && (
                <div className="border-t pt-4">
                  <p className="text-gray-600">Paid On</p>
                  <p className="font-semibold text-green-600">
                    {new Date(selectedInvoice.paidAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              {selectedInvoice.status !== "PAID" && (
                <button
                  onClick={() => {
                    handlePay(selectedInvoice.id, selectedInvoice.bookingId);
                    setSelectedInvoice(null);
                  }}
                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  Pay Now
                </button>
              )}
              <button
                onClick={() =>
                  downloadInvoice(
                    selectedInvoice.id,
                    selectedInvoice.invoiceNumber
                  )
                }
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download
              </button>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InvoicesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <InvoicesContent />
    </Suspense>
  );
}
