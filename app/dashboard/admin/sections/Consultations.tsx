import { useState, useEffect } from "react";
import { AlertCircle, Search, X, ChevronLeft, ChevronRight, Loader } from "lucide-react";


interface Booking {
  id: string;
  calcomId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientTimezone: string;
  eventTitle?: string;
  note?: string;
  scheduledAt: string;
  duration: number;
  status: string;
  paymentStatus: string;
  paymentAmount?: number;
  invoiceNumber?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  total: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Consultations Section
function ConsultationsSection() {
  const [consultations, setConsultations] = useState<Booking[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [selectedConsultation, setSelectedConsultation] = useState<Booking | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch bookings with pagination
  useEffect(() => {
    fetchBookings(pagination.currentPage);
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

      const response = await fetch(`/api/admin/bookings?${params}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const result = await response.json();
      setConsultations(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    // Reset to page 1 when searching
    if (pagination.currentPage !== 1) {
      setPagination(prev => ({ ...prev, currentPage: 1 }));
      fetchBookings(1);
    } else {
      fetchBookings(1);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchBookings(newPage);
    }
  };

  // Format date and time for display
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Consultations & Bookings</h2>
        <p className="text-gray-600 mt-2">Manage all consultation requests and bookings</p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, email, or service..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {["all", "PENDING", "CONFIRMED", "PAID", "COMPLETED", "CANCELLED"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterStatus === status
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status === "all" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Consultations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {error && (
          <div className="bg-red-50 border-b border-red-200 px-6 py-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
              <p className="text-gray-600 font-medium">Loading consultations...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Client</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Service</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Date & Time</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Payment</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Amount</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {consultations.map((consultation) => {
                    const { date, time } = formatDateTime(consultation.scheduledAt);
                    return (
                      <tr key={consultation.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{consultation.clientName}</span>
                            <span className="text-xs text-gray-500">{consultation.clientEmail}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-600">{consultation.eventTitle || "N/A"}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{date}</span>
                            <span className="text-xs text-gray-500">{time}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              consultation.status === "CONFIRMED"
                                ? "bg-blue-100 text-blue-800"
                                : consultation.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : consultation.status === "COMPLETED"
                                ? "bg-green-100 text-green-800"
                                : consultation.status === "PAID"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {consultation.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              consultation.paymentStatus === "PAID"
                                ? "bg-green-100 text-green-800"
                                : consultation.paymentStatus === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {consultation.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          {consultation.paymentAmount ? `₦${consultation.paymentAmount.toLocaleString()}` : "N/A"}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedConsultation(consultation)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {consultations.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No consultations found</p>
              </div>
            )}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{(pagination.currentPage - 1) * pagination.pageSize + 1}</span> to{" "}
                  <span className="font-semibold">
                    {Math.min(pagination.currentPage * pagination.pageSize, pagination.total)}
                  </span>{" "}
                  of <span className="font-semibold">{pagination.total}</span> results
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPreviousPage}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      pagination.hasPreviousPage
                        ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        : "bg-gray-100 border border-gray-300 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        className={`px-3 py-2 rounded-lg font-medium transition-all ${
                          pagination.currentPage === p
                            ? "bg-indigo-600 text-white"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      pagination.hasNextPage
                        ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        : "bg-gray-100 border border-gray-300 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Details Modal */}
      {selectedConsultation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Consultation Details</h3>
              <button
                onClick={() => setSelectedConsultation(null)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Client Info */}
              <div className="border-b border-gray-200 pb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium text-gray-900">{selectedConsultation.clientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{selectedConsultation.clientEmail}</p>
                  </div>
                  {selectedConsultation.clientPhone && (
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900">{selectedConsultation.clientPhone}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Timezone</p>
                    <p className="font-medium text-gray-900">{selectedConsultation.clientTimezone}</p>
                  </div>
                </div>
              </div>

              {/* Consultation Details */}
              <div className="border-b border-gray-200 pb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Consultation Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Service</p>
                    <p className="font-medium text-gray-900">{selectedConsultation.eventTitle || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Consultation ID</p>
                    <p className="font-medium text-gray-900 truncate">{selectedConsultation.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium text-gray-900">{formatDateTime(selectedConsultation.scheduledAt).date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-medium text-gray-900">{formatDateTime(selectedConsultation.scheduledAt).time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium text-gray-900">{selectedConsultation.duration} minutes</p>
                  </div>
                </div>
              </div>

              {/* Status & Payment */}
              <div className="border-b border-gray-200 pb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Status & Payment</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Consultation Status</p>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                        selectedConsultation.status === "CONFIRMED"
                          ? "bg-blue-100 text-blue-800"
                          : selectedConsultation.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : selectedConsultation.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedConsultation.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Status</p>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                        selectedConsultation.paymentStatus === "PAID"
                          ? "bg-green-100 text-green-800"
                          : selectedConsultation.paymentStatus === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedConsultation.paymentStatus}
                    </span>
                  </div>
                  {selectedConsultation.paymentAmount && (
                    <div>
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="font-bold text-indigo-600 text-lg">
                        ₦{selectedConsultation.paymentAmount.toLocaleString()}
                      </p>
                    </div>
                  )}
                  {selectedConsultation.invoiceNumber && (
                    <div>
                      <p className="text-sm text-gray-600">Invoice</p>
                      <p className="font-medium text-gray-900">{selectedConsultation.invoiceNumber}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedConsultation.note && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Notes</h4>
                  <p className="text-gray-600">{selectedConsultation.note}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                  Send Reminder
                </button>
                <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                  Mark Complete
                </button>
                <button className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                  Reschedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default ConsultationsSection;