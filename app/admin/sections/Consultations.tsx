"use client";

import { useState, useEffect } from "react";
import { AlertCircle, Search, X, ChevronLeft, ChevronRight, Loader, Calendar, Clock } from "lucide-react";
import { ResponsiveTable } from "@/components/admin/ResponsiveTable";

interface Booking {
  id: string;
  calcomId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  timezone: string;
  eventTitle?: string;
  note?: string;
  scheduledAt: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
  confirmationSent: boolean;
  reminderSent: boolean;
  thankYouSent: boolean;
  followUpSent: boolean;
}

interface PaginationInfo {
  total: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  SCHEDULED:   "bg-blue-100 text-blue-800",
  RESCHEDULED: "bg-indigo-100 text-indigo-800",
  COMPLETED:   "bg-green-100 text-green-800",
  CANCELLED:   "bg-red-100 text-red-800",
  NO_SHOW:     "bg-orange-100 text-orange-800",
  PROPOSAL:    "bg-purple-100 text-purple-800",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[status] ?? "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}

function EmailFlag({ sent, label }: { sent: boolean; label: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${sent ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>
      {label}
    </span>
  );
}

export default function ConsultationsSection() {
  const [consultations, setConsultations] = useState<Booking[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0, pageSize: 10, currentPage: 1, totalPages: 0, hasNextPage: false, hasPreviousPage: false,
  });
  const [selected, setSelected] = useState<Booking | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings(1);
  }, [filterStatus]);

  const fetchBookings = async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pagination.pageSize.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(filterStatus !== "all" && { status: filterStatus }),
      });
      const res = await fetch(`/api/admin/bookings?${params}`);
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const result = await res.json();
      setConsultations(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    fetchBookings(1);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" }),
      time: date.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const STATUS_FILTERS = ["all", "SCHEDULED", "COMPLETED", "CANCELLED", "RESCHEDULED", "NO_SHOW"];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Consultations & Bookings</h2>
        <p className="text-gray-500 mt-1 text-sm">All consultation bookings from Cal.com</p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === s ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {s === "all" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {error && (
          <div className="bg-red-50 border-b border-red-200 px-5 py-3 flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Loader className="w-7 h-7 animate-spin mb-3" />
            <p className="text-sm">Loading consultations...</p>
          </div>
        ) : (
          <>
            <ResponsiveTable
              columns={[
                {
                  label: "Client",
                  key: "clientName",
                  render: (_, row) => (
                    <div>
                      <p className="font-medium text-gray-900">{row.clientName}</p>
                      <p className="text-xs text-gray-500">{row.clientEmail}</p>
                    </div>
                  ),
                },
                {
                  label: "Event",
                  key: "eventTitle",
                  render: (val) => val || "—",
                },
                {
                  label: "Scheduled",
                  key: "scheduledAt",
                  render: (val) => {
                    const { date, time } = formatDateTime(val);
                    return (
                      <div>
                        <div className="flex items-center gap-1.5 text-gray-700">
                          <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span>{date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500 mt-0.5">
                          <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="text-xs">{time}</span>
                        </div>
                      </div>
                    );
                  },
                },
                {
                  label: "Status",
                  key: "status",
                  render: (val) => <StatusBadge status={val} />,
                },
                {
                  label: "Intake",
                  key: "confirmationSent",
                  render: (_, row) => (
                    <div className="flex flex-wrap gap-1">
                      <EmailFlag sent={row.confirmationSent} label="Conf" />
                      <EmailFlag sent={row.reminderSent} label="Remind" />
                      <EmailFlag sent={row.thankYouSent} label="Thanks" />
                      <EmailFlag sent={row.followUpSent} label="Follow" />
                    </div>
                  ),
                },
              ]}
              data={consultations}
              isLoading={false}
              emptyMessage="No consultations found"
              rowActions={(row) => (
                <button
                  onClick={() => setSelected(row)}
                  className="px-3 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-medium hover:bg-teal-700 transition-colors"
                >
                  View
                </button>
              )}
            />

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="bg-gray-50 border-t border-gray-200 px-5 py-3 flex items-center justify-between text-sm">
                <p className="text-gray-500">
                  Showing{" "}
                  <span className="font-semibold">{(pagination.currentPage - 1) * pagination.pageSize + 1}</span>
                  {" – "}
                  <span className="font-semibold">{Math.min(pagination.currentPage * pagination.pageSize, pagination.total)}</span>
                  {" of "}
                  <span className="font-semibold">{pagination.total}</span>
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => fetchBookings(pagination.currentPage - 1)}
                    disabled={!pagination.hasPreviousPage}
                    className="p-1.5 rounded border border-gray-300 text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => fetchBookings(p)}
                      className={`px-3 py-1 rounded border text-xs font-medium ${
                        pagination.currentPage === p
                          ? "bg-teal-600 text-white border-teal-600"
                          : "border-gray-300 text-gray-700 hover:bg-white"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => fetchBookings(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="p-1.5 rounded border border-gray-300 text-gray-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-teal-600 rounded-t-xl">
              <h3 className="text-lg font-bold text-white">Consultation Details</h3>
              <button onClick={() => setSelected(null)} className="text-white/80 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-sm">
              {/* Client */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Client</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="font-semibold text-gray-900">{selected.clientName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{selected.clientEmail}</p>
                  </div>
                  {selected.clientPhone && (
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{selected.clientPhone}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-500">Timezone</p>
                    <p className="font-medium text-gray-900">{selected.timezone || "—"}</p>
                  </div>
                </div>
              </div>

              {/* Consultation */}
              <div className="border-t pt-4">
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Consultation</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Event</p>
                    <p className="font-medium text-gray-900">{selected.eventTitle || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <div className="mt-1"><StatusBadge status={selected.status} /></div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">{formatDateTime(selected.scheduledAt).date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="font-medium text-gray-900">{formatDateTime(selected.scheduledAt).time}</p>
                  </div>
                  {selected.cancelledAt && (
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500">Cancelled At</p>
                      <p className="font-medium text-red-600">{formatDateTime(selected.cancelledAt).date}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Email Flags */}
              <div className="border-t pt-4">
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Email Notifications</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Confirmation", sent: selected.confirmationSent },
                    { label: "Reminder",     sent: selected.reminderSent },
                    { label: "Thank You",    sent: selected.thankYouSent },
                    { label: "Follow Up",    sent: selected.followUpSent },
                  ].map(({ label, sent }) => (
                    <div key={label} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                      <span className="text-gray-600">{label}</span>
                      <span className={`text-xs font-semibold ${sent ? "text-green-600" : "text-gray-400"}`}>
                        {sent ? "✓ Sent" : "Not sent"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selected.note && (
                <div className="border-t pt-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Notes</p>
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-3">{selected.note}</p>
                </div>
              )}

              {/* Booking metadata */}
              <div className="border-t pt-4">
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Metadata</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div><span className="text-gray-400">Booking ID: </span>{selected.id.slice(0, 12)}…</div>
                  <div><span className="text-gray-400">Cal ID: </span>{selected.calcomId?.slice(0, 12)}…</div>
                  <div><span className="text-gray-400">Created: </span>{formatDateTime(selected.createdAt).date}</div>
                  <div><span className="text-gray-400">Updated: </span>{formatDateTime(selected.updatedAt).date}</div>
                </div>
              </div>
            </div>

            <div className="px-6 pb-5">
              <button
                onClick={() => setSelected(null)}
                className="w-full py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm"
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
