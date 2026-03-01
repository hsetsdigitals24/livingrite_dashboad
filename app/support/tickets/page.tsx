"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  AlertCircle,
  Clock,
  CheckCircle,
  AlertTriangle,
  Filter,
} from "lucide-react";

interface Ticket {
  id: string;
  number: number;
  title: string;
  status: string;
  priority: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  customer: {
    name: string;
    email: string;
  };
  assignedTo?: {
    name: string;
  };
  _count?: {
    comments: number;
    attachments: number;
  };
}

const STATUS_CONFIG = {
  OPEN: { color: "bg-red-100", textColor: "text-red-700", label: "Open" },
  ASSIGNED: { color: "bg-yellow-100", textColor: "text-yellow-700", label: "Assigned" },
  IN_PROGRESS: {
    color: "bg-blue-100",
    textColor: "text-blue-700",
    label: "In Progress",
  },
  WAITING: {
    color: "bg-purple-100",
    textColor: "text-purple-700",
    label: "Waiting",
  },
  RESOLVED: {
    color: "bg-green-100",
    textColor: "text-green-700",
    label: "Resolved",
  },
  CLOSED: { color: "bg-gray-100", textColor: "text-gray-700", label: "Closed" },
  REOPENED: {
    color: "bg-orange-100",
    textColor: "text-orange-700",
    label: "Reopened",
  },
};

const PRIORITY_CONFIG = {
  LOW: { color: "bg-gray-100", textColor: "text-gray-700", icon: "●" },
  NORMAL: { color: "bg-blue-100", textColor: "text-blue-700", icon: "●" },
  HIGH: { color: "bg-orange-100", textColor: "text-orange-700", icon: "●" },
  URGENT: { color: "bg-red-100", textColor: "text-red-700", icon: "●" },
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTickets();
  }, [filterStatus, filterPriority, filterCategory]);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();

      if (filterStatus) params.append("status", filterStatus);
      if (filterPriority) params.append("priority", filterPriority);
      if (filterCategory) params.append("category", filterCategory);
      if (searchTerm) params.append("search", searchTerm);

      const response = await fetch(`/api/tickets?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to load tickets");
      }

      const data = await response.json();
      setTickets(Array.isArray(data) ? data : data.data || []);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tickets");
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTickets();
  };

  const filteredTickets = searchTerm
    ? tickets.filter(
        (ticket) =>
          ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.number.toString().includes(searchTerm)
      )
    : tickets;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Support Tickets</h1>
              <p className="text-gray-600 mt-2">
                View and manage your support tickets
              </p>
            </div>
            <Link
              href="/support/new"
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Ticket
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="Search by title or ticket number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Search
              </button>
            </form>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Status:</span>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">All</option>
                <option value="OPEN">Open</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="WAITING">Waiting</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>

              <span className="text-sm font-medium text-gray-700 ml-2">Priority:</span>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">All</option>
                <option value="LOW">Low</option>
                <option value="NORMAL">Normal</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>

              <span className="text-sm font-medium text-gray-700 ml-2">Category:</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">All</option>
                <option value="BILLING">Billing</option>
                <option value="TECHNICAL">Technical</option>
                <option value="GENERAL">General</option>
                <option value="FEATURE">Feature Request</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-600">Loading tickets...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-6">No tickets found</p>
            <Link
              href="/support/new"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Your First Ticket
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTickets.map((ticket) => {
              const statusConfig =
                STATUS_CONFIG[ticket.status as keyof typeof STATUS_CONFIG] ||
                STATUS_CONFIG.OPEN;
              const priorityConfig =
                PRIORITY_CONFIG[ticket.priority as keyof typeof PRIORITY_CONFIG] ||
                PRIORITY_CONFIG.NORMAL;

              return (
                <Link
                  key={ticket.id}
                  href={`/support/tickets/${ticket.id}`}
                  className="block bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          #{ticket.number} - {ticket.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600">{ticket.category}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.color} ${statusConfig.textColor}`}
                      >
                        {statusConfig.label}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Priority</p>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mt-1 ${priorityConfig.color} ${priorityConfig.textColor}`}
                      >
                        {ticket.priority}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-600">Created</p>
                      <p className="font-medium text-gray-900">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Updated</p>
                      <p className="font-medium text-gray-900">
                        {new Date(ticket.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Assigned To</p>
                      <p className="font-medium text-gray-900">
                        {ticket.assignedTo?.name || "Unassigned"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Comments</p>
                      <p className="font-medium text-gray-900">
                        {ticket._count?.comments || 0}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
