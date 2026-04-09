"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Eye, Building2, Copy, CheckCheck } from "lucide-react";

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
  service: { id: string; title: string } | null;
  notes: string | null;
  createdAt: string;
  dueAt: string | null;
  paidAt: string | null;
  sentAt: string | null;
}

interface PaymentSettings {
  bankName: string;
  accountName: string;
  accountNumber: string;
  bankCode: string;
  additionalInfo: string;
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-600",
  GENERATED: "bg-blue-100 text-blue-700",
  SENT: "bg-orange-100 text-orange-700",
  VIEWED: "bg-purple-100 text-purple-700",
  PAID: "bg-green-100 text-green-700",
  OVERDUE: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-100 text-gray-500",
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="ml-2 text-teal-600 hover:text-teal-700" title="Copy">
      {copied ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function InvoicesContent() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "unpaid" | "paid">("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, [filter]);

  useEffect(() => {
    fetchPaymentSettings();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const statusParam = filter === "paid" ? "?status=PAID" : filter === "unpaid" ? "?status=SENT" : "";
      const res = await fetch(`/api/invoices/my-invoices${statusParam}`);
      if (!res.ok) throw new Error("Failed to fetch invoices");
      const data = await res.json();
      setInvoices(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch invoices");
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentSettings = async () => {
    try {
      const res = await fetch("/api/payment-settings");
      if (res.ok) setPaymentSettings(await res.json());
    } catch {}
  };

  const getServicesSummary = (invoice: Invoice) => {
    if (invoice.services && Array.isArray(invoice.services) && invoice.services.length > 0) {
      return invoice.services.map((s: any) => s.title).filter(Boolean).join(", ");
    }
    return invoice.service?.title || "—";
  };

  const isUnpaid = (status: string) => !["PAID", "CANCELLED"].includes(status);

  const stats = {
    total: invoices.length,
    amountDue: invoices.filter((i) => isUnpaid(i.status)).reduce((s, i) => s + i.totalAmount, 0),
    amountPaid: invoices.filter((i) => i.status === "PAID").reduce((s, i) => s + i.totalAmount, 0),
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Invoices</h1>
        <p className="text-gray-500 text-sm mt-1">View invoices and payment information</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-5">
        {(["all", "unpaid", "paid"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg font-medium text-sm transition-colors ${
              filter === f ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {f === "unpaid" ? "Unpaid" : f === "paid" ? "Paid" : "All"}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-xs text-gray-500">Total Invoices</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-xs text-gray-500">Amount Due</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">₦{stats.amountDue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-xs text-gray-500">Amount Paid</p>
          <p className="text-2xl font-bold text-green-600 mt-1">₦{stats.amountPaid.toLocaleString()}</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex gap-2 text-sm mb-5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Payment Instructions Banner */}
      {paymentSettings?.accountNumber && invoices.some((i) => isUnpaid(i.status)) && (
        <div className="mb-5 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-emerald-100 rounded-lg flex-shrink-0">
              <Building2 className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-emerald-800 text-sm mb-2">Payment Account Details</p>
              <div className="space-y-1 text-sm">
                <div className="flex gap-2">
                  <span className="text-gray-500 w-28">Bank:</span>
                  <span className="font-medium text-gray-800">{paymentSettings.bankName}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-500 w-28">Account Name:</span>
                  <span className="font-medium text-gray-800">{paymentSettings.accountName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 w-28">Account No.:</span>
                  <span className="font-bold text-emerald-700 tracking-wider">{paymentSettings.accountNumber}</span>
                  <CopyButton text={paymentSettings.accountNumber} />
                </div>
                {paymentSettings.bankCode && (
                  <div className="flex gap-2">
                    <span className="text-gray-500 w-28">Sort Code:</span>
                    <span className="font-medium text-gray-800">{paymentSettings.bankCode}</span>
                  </div>
                )}
              </div>
              {paymentSettings.additionalInfo && (
                <p className="mt-2 text-xs text-gray-500">{paymentSettings.additionalInfo}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Invoice List */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="animate-spin inline-block w-7 h-7 border-4 border-teal-600 border-t-transparent rounded-full"></div>
          <p className="text-gray-500 mt-3 text-sm">Loading invoices...</p>
        </div>
      ) : invoices.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
          <p className="text-gray-500 font-medium">No invoices found</p>
          <p className="text-gray-400 text-sm mt-1">Invoices will appear here once generated by our team</p>
        </div>
      ) : (
        <div className="space-y-3">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900">{invoice.invoiceNumber}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[invoice.status] || STATUS_COLORS.DRAFT}`}>
                      {invoice.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{getServicesSummary(invoice)}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span>Issued: {new Date(invoice.createdAt).toLocaleDateString()}</span>
                    {invoice.dueAt && <span>Due: {new Date(invoice.dueAt).toLocaleDateString()}</span>}
                    {invoice.paidAt && <span className="text-green-600">Paid: {new Date(invoice.paidAt).toLocaleDateString()}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-900">₦{invoice.totalAmount.toLocaleString()}</p>
                    {isUnpaid(invoice.status) && (
                      <p className="text-xs text-orange-600 font-medium">Payment pending</p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedInvoice(invoice)}
                    className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg border border-teal-200 transition"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
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
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedInvoice.invoiceNumber}</h3>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[selectedInvoice.status] || STATUS_COLORS.DRAFT}`}>
                  {selectedInvoice.status}
                </span>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="space-y-4 text-sm">
              {/* Services */}
              {selectedInvoice.services && Array.isArray(selectedInvoice.services) && selectedInvoice.services.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-2">Services</p>
                  <div className="space-y-1">
                    {(selectedInvoice.services as InvoiceService[]).map((s, i) => (
                      <div key={i} className="flex justify-between">
                        <span className="text-gray-700">{s.title}</span>
                        <span className="font-medium">₦{s.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Totals */}
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
                <div className="flex justify-between font-bold text-base border-t pt-2">
                  <span>Total</span>
                  <span className="text-teal-600">₦{selectedInvoice.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-gray-500">Issued</p>
                  <p className="font-medium">{new Date(selectedInvoice.createdAt).toLocaleDateString()}</p>
                </div>
                {selectedInvoice.dueAt && (
                  <div>
                    <p className="text-gray-500">Due</p>
                    <p className="font-medium">{new Date(selectedInvoice.dueAt).toLocaleDateString()}</p>
                  </div>
                )}
                {selectedInvoice.paidAt && (
                  <div>
                    <p className="text-gray-500">Paid On</p>
                    <p className="font-medium text-green-600">{new Date(selectedInvoice.paidAt).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              {selectedInvoice.notes && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600 font-medium mb-1">Notes from LivingRite</p>
                  <p className="text-gray-700">{selectedInvoice.notes}</p>
                </div>
              )}

              {/* Bank details if unpaid */}
              {isUnpaid(selectedInvoice.status) && paymentSettings?.accountNumber && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="w-4 h-4 text-emerald-700" />
                    <p className="font-semibold text-emerald-800 text-xs uppercase">Payment Details</p>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex gap-2"><span className="text-gray-500 w-24">Bank:</span><span className="font-medium">{paymentSettings.bankName}</span></div>
                    <div className="flex gap-2"><span className="text-gray-500 w-24">Account:</span><span className="font-medium">{paymentSettings.accountName}</span></div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 w-24">Number:</span>
                      <span className="font-bold text-emerald-700 tracking-wider">{paymentSettings.accountNumber}</span>
                      <CopyButton text={paymentSettings.accountNumber} />
                    </div>
                    {paymentSettings.bankCode && <div className="flex gap-2"><span className="text-gray-500 w-24">Sort Code:</span><span className="font-medium">{paymentSettings.bankCode}</span></div>}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">Use <strong>{selectedInvoice.invoiceNumber}</strong> as your payment reference.</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedInvoice(null)}
              className="mt-5 w-full py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm"
            >
              Close
            </button>
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
        <div className="p-6 max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-gray-200 rounded"></div>)}
          </div>
        </div>
      }
    >
      <InvoicesContent />
    </Suspense>
  );
}
