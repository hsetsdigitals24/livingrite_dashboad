"use client";

import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";

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

interface TicketTableProps {
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "URGENT":
      return "bg-red-100 text-red-800";
    case "HIGH":
      return "bg-orange-100 text-orange-800";
    case "NORMAL":
      return "bg-blue-100 text-blue-800";
    case "LOW":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "OPEN":
      return "bg-red-100 text-red-800";
    case "ASSIGNED":
      return "bg-yellow-100 text-yellow-800";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-800";
    case "WAITING":
      return "bg-purple-100 text-purple-800";
    case "RESOLVED":
      return "bg-green-100 text-green-800";
    case "CLOSED":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function TicketTable({ tickets, onSelectTicket }: TicketTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              #
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Title
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Status
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Priority
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Assigned To
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Created
            </th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {tickets.map((ticket) => (
            <tr
              key={ticket.id}
              className="hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                #{ticket.number}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                {ticket.title}
              </td>
              <td className="px-6 py-4">
                <Badge className={getStatusColor(ticket.status)}>
                  {ticket.status}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <Badge className={getPriorityColor(ticket.priority)}>
                  {ticket.priority}
                </Badge>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {ticket.customer.name}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {ticket.assignedTo?.name || "-"}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(ticket.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => onSelectTicket(ticket)}
                  className="text-teal-600 hover:text-teal-700 p-2"
                >
                  <ArrowUpRight className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {tickets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No tickets found</p>
        </div>
      )}
    </div>
  );
}
