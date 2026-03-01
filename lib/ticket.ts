/**
 * Support Ticket Utilities
 */

import { TicketStatus, TicketPriority } from "@/types/ticket";

/**
 * Format a ticket status for display
 */
export function formatTicketStatus(status: TicketStatus): string {
  const statusMap: Record<TicketStatus, string> = {
    OPEN: "Open",
    ASSIGNED: "Assigned",
    IN_PROGRESS: "In Progress",
    WAITING: "Waiting",
    RESOLVED: "Resolved",
    CLOSED: "Closed",
    REOPENED: "Reopened",
  };
  return statusMap[status] || status;
}

/**
 * Format a ticket priority for display
 */
export function formatTicketPriority(priority: TicketPriority): string {
  const priorityMap: Record<TicketPriority, string> = {
    LOW: "Low Priority",
    NORMAL: "Normal Priority",
    HIGH: "High Priority",
    URGENT: "Urgent",
  };
  return priorityMap[priority] || priority;
}

/**
 * Get color classes for a ticket status
 */
export function getStatusColor(
  status: TicketStatus
): { bg: string; text: string } {
  const colorMap: Record<
    TicketStatus,
    { bg: string; text: string }
  > = {
    OPEN: { bg: "bg-red-100", text: "text-red-700" },
    ASSIGNED: { bg: "bg-yellow-100", text: "text-yellow-700" },
    IN_PROGRESS: { bg: "bg-blue-100", text: "text-blue-700" },
    WAITING: { bg: "bg-purple-100", text: "text-purple-700" },
    RESOLVED: { bg: "bg-green-100", text: "text-green-700" },
    CLOSED: { bg: "bg-gray-100", text: "text-gray-700" },
    REOPENED: { bg: "bg-orange-100", text: "text-orange-700" },
  };
  return colorMap[status] || { bg: "bg-gray-100", text: "text-gray-700" };
}

/**
 * Get color classes for a ticket priority
 */
export function getPriorityColor(
  priority: TicketPriority
): { bg: string; text: string } {
  const colorMap: Record<
    TicketPriority,
    { bg: string; text: string }
  > = {
    LOW: { bg: "bg-gray-100", text: "text-gray-700" },
    NORMAL: { bg: "bg-blue-100", text: "text-blue-700" },
    HIGH: { bg: "bg-orange-100", text: "text-orange-700" },
    URGENT: { bg: "bg-red-100", text: "text-red-700" },
  };
  return colorMap[priority] || { bg: "bg-blue-100", text: "text-blue-700" };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Check if a ticket can be commented on
 */
export function canCommentOnTicket(status: TicketStatus): boolean {
  return status !== "CLOSED";
}

/**
 * Check if a ticket is resolved
 */
export function isTicketResolved(status: TicketStatus): boolean {
  return status === "RESOLVED" || status === "CLOSED";
}

/**
 * Get ticket priority level for sorting (higher = more urgent)
 */
export function getPriorityLevel(priority: TicketPriority): number {
  const priorityLevels: Record<TicketPriority, number> = {
    URGENT: 4,
    HIGH: 3,
    NORMAL: 2,
    LOW: 1,
  };
  return priorityLevels[priority] || 0;
}

/**
 * Parse ticket error messages
 */
export function parseTicketError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  return "An unexpected error occurred";
}
