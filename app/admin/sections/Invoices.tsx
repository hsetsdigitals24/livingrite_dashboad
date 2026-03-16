"use client";

import { useState, useEffect } from "react";
import { AlertCircle, Download, Eye, Plus, CheckCircle2 } from "lucide-react";
import { GenerateInvoiceForm } from "../components/GenerateInvoiceForm";

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  totalAmount: number;
  currency: string;
  status: string;
  booking: {
    clientName: string;
    clientEmail: string;
  };
  createdAt: string;
  dueAt: string | null;
  paidAt: string | null;
}

export default function InvoicesSection() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filter, setFilter] = useState<"all" | "sent" | "paid" | "draft">("all");
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchInvoices(page);
  };

  const fetchInvoices = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const url =
        filter === "all"
          ? `/api/invoices?page=${page}`
          : `/api/invoices?status=${filter.toUpperCase()}&page=${page}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch invoices");

      const data = await response.json();

      const invoiceList = Array.isArray(data.invoices) ? data.invoices : [];
      setInvoices(invoiceList);
      setTotalPages(data.pagination?.pages || 1);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch invoices"
      );
      setInvoices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsPaid = async (invoiceId: string) => {
    try {
      setActionError("");
      setMarkingAsPaid(invoiceId);

      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "markPaid" }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to mark invoice as paid");
      }

      // Refresh invoice list
      await fetchInvoices(currentPage);
      
      // Update selected invoice if it's currently selected
      if (selectedInvoice?.id === invoiceId) {
        const updated = await fetch(`/api/invoices/${invoiceId}`);
        if (updated.ok) {
          const data = await updated.json();
          setSelectedInvoice(data);
        }
      }
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to mark invoice as paid"
      );
    } finally {
      setMarkingAsPaid(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-100 text-gray-800";
      case "SENT":
        return "bg-blue-100 text-blue-800";
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Invoices</h2>
          <p className="text-gray-600 mt-1">Manage and track client invoices</p>
        </div>
        <button
          onClick={() => setIsGenerateFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
        >
          <Plus className="w-5 h-5" />
          Generate Invoice
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "draft", "sent", "paid"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === f
                ? "bg-teal-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} Invoices
          </button>
        ))}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Total Invoices</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {invoices.length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Paid Invoices</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {invoices.filter((i) => i.status === "PAID").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Pending</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">
            {invoices.filter((i) => i.status === "SENT").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-600 text-sm">Total Amount</p>
          <p className="text-3xl font-bold text-teal-600 mt-2">
            ₦{invoices
              .reduce((sum, inv) => sum + inv.totalAmount, 0)
              .toLocaleString()}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {actionError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Invoices Table */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full"></div>
          <p className="text-gray-600 mt-4">Loading invoices...</p>
        </div>
      ) : invoices.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">No invoices found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Invoice #
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div>{invoice.booking.clientName}</div>
                      <div className="text-xs text-gray-500">
                        {invoice.booking.clientEmail}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      ₦{invoice.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          invoice.status
                        )}`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {invoice.dueAt
                        ? new Date(invoice.dueAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        {/* Mark as Paid Button */}
                        {invoice.status !== "PAID" && (
                          <button
                            onClick={() => handleMarkAsPaid(invoice.id)}
                            disabled={markingAsPaid === invoice.id}
                            className="text-green-600 hover:text-green-700 p-1 inline-block disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Mark as Paid"
                          >
                            {markingAsPaid === invoice.id ? (
                              <div className="w-5 h-5 rounded-full border-2 border-green-600 border-t-transparent animate-spin" />
                            ) : (
                              <CheckCircle2 className="w-5 h-5" />
                            )}
                          </button>
                        )}\n                        {/* View Details Button */}\n                        <button
                          onClick={() => setSelectedInvoice(invoice)}
                          className="text-teal-600 hover:text-teal-700 p-1 inline-block"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page <span className="font-semibold">{currentPage}</span> of{" "}
              <span className="font-semibold">{totalPages}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded border ${
                    currentPage === page
                      ? "bg-teal-600 text-white border-teal-600"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Invoice Details</h3>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-gray-500 hover:text-gray-700"
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
                <p className="text-sm text-gray-600">Client</p>
                <p className="font-semibold text-gray-900">
                  {selectedInvoice.booking.clientName}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedInvoice.booking.clientEmail}
                </p>
              </div>

              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-gray-600">Amount:</p>
                    <p className="font-semibold">
                      ₦{selectedInvoice.amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <p className="font-semibold">Total:</p>
                    <p className="font-bold text-lg text-green-600">
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
                    handleMarkAsPaid(selectedInvoice.id);
                    setSelectedInvoice(null);
                  }}
                  disabled={markingAsPaid === selectedInvoice.id}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                >
                  {markingAsPaid === selectedInvoice.id ? "Marking as Paid..." : "Mark as Paid"}
                </button>
              )}
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

      {/* Generate Invoice Form Modal */}
      <GenerateInvoiceForm
        isOpen={isGenerateFormOpen}
        onClose={() => setIsGenerateFormOpen(false)}
        onSuccess={() => {
          setIsGenerateFormOpen(false);
          fetchInvoices(1);
        }}
      />
    </div>
  );
}
