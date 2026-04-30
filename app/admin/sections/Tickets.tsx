"use client";

import { useState, useEffect } from "react";
import { TicketTable } from "@/components/tickets/TicketTable";
import { TicketDetailModal } from "@/components/tickets/TicketDetailModal";
import { AlertCircle } from "lucide-react";

interface Ticket {
  id: string;
  number: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  customer: { name: string; email: string; image?: string };
  assignedTo?: { id: string; name: string } | null;
  createdAt: string;
  updatedAt: string;
  resolutionNotes?: string;
}

export default function TicketsSection() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [filter, setFilter] = useState<"all" | "open" | "assigned" | "resolved">(
    "all"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTickets();
  }, [filter]);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const url =
        filter === "all"
          ? "/api/tickets"
          : `/api/tickets?status=${filter.toUpperCase()}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch tickets");

      const data = await response.json();
      setTickets(data.data);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch tickets"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (status: string, notes?: string) => {
    if (!selectedTicket) return;

    try {
      const response = await fetch(`/api/tickets/${selectedTicket.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, resolutionNotes: notes }),
      });

      if (!response.ok) throw new Error("Failed to update ticket");

      await fetchTickets();
      setSelectedTicket(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update ticket");
    }
  };

  const openCount = tickets.filter((t) => t.status === "OPEN").length;
  const inProgressCount = tickets.filter(
    (t) => t.status === "IN_PROGRESS"
  ).length;
  const resolvedCount = tickets.filter((t) => t.status === "RESOLVED").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
        <p className="text-gray-600 mt-2">Manage customer support requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Open</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{openCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">In Progress</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {inProgressCount}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 font-medium">Resolved</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {resolvedCount}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["all", "open", "assigned", "resolved"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === f
                ? "bg-teal-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <p className="text-gray-600">Loading tickets...</p>
          </div>
        ) : (
          <TicketTable tickets={tickets} onSelectTicket={(ticket) => setSelectedTicket(ticket)} />
        )}
      </div>

      {/* Detail Modal */}
      <TicketDetailModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onStatusChange={handleStatusChange}
        isAdmin={true}
      />
    </div>
  );
}
