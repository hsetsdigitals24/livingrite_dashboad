"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

interface TicketDetailModalProps {
  ticket: Ticket | null;
  onClose: () => void;
  onStatusChange?: (status: string, notes?: string) => Promise<void>;
  onAssign?: (userId: string) => Promise<void>;
  isAdmin?: boolean;
}

const statusOptions = [
  "OPEN",
  "ASSIGNED",
  "IN_PROGRESS",
  "WAITING",
  "RESOLVED",
  "CLOSED",
];

export function TicketDetailModal({
  ticket,
  onClose,
  onStatusChange,
  onAssign,
  isAdmin = false,
}: TicketDetailModalProps) {
  const [newStatus, setNewStatus] = useState(ticket?.status || "OPEN");
  const [resolutionNotes, setResolutionNotes] = useState(
    ticket?.resolutionNotes || ""
  );
  const [isUpdating, setIsUpdating] = useState(false);

  if (!ticket) return null;

  const handleStatusChange = async () => {
    if (!onStatusChange) return;
    setIsUpdating(true);
    try {
      await onStatusChange(newStatus, resolutionNotes);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-50 border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Ticket #{ticket.number}
            </h2>
            <p className="text-sm text-gray-600 mt-1">{ticket.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Status
              </label>
              {isAdmin ? (
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              ) : (
                <Badge className="inline-block">{ticket.status}</Badge>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Priority
              </label>
              <Badge className="inline-block">{ticket.priority}</Badge>
            </div>
          </div>

          {/* Customer Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Customer</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium text-gray-900">{ticket.customer.name}</p>
              <p className="text-sm text-gray-600">{ticket.customer.email}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {ticket.description}
            </p>
          </div>

          {/* Resolution Notes (if admin and status is RESOLVED) */}
          {isAdmin && newStatus === "RESOLVED" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resolution Notes
              </label>
              <textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Explain how this issue was resolved..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
          )}

          {/* Dates */}
          <div className="border-t pt-4">
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>Created:</strong>{" "}
                {new Date(ticket.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Last Updated:</strong>{" "}
                {new Date(ticket.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        {isAdmin && (
          <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleStatusChange}
              disabled={isUpdating}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
            >
              {isUpdating ? "Updating..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
