/**
 * Support Ticket Types
 */

export type TicketStatus =
  | "OPEN"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "WAITING"
  | "RESOLVED"
  | "CLOSED"
  | "REOPENED";

export type TicketPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export type TicketCategory = "BILLING" | "TECHNICAL" | "GENERAL" | "FEATURE" | "OTHER";

export interface TicketUser {
  id: string;
  name: string | null;
  email: string | null;
  image?: string | null;
}

export interface TicketComment {
  id: string;
  content: string;
  author: TicketUser;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  isInternal: boolean;
  attachments?: TicketAttachment[];
}

export interface TicketAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  number: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  customerId: string;
  customer: TicketUser;
  assignedToId?: string | null;
  assignedTo?: TicketUser | null;
  resolutionNotes?: string | null;
  createdAt: string;
  updatedAt: string;
  assignedAt?: string | null;
  resolvedAt?: string | null;
  closedAt?: string | null;
  comments: TicketComment[];
  attachments: TicketAttachment[];
  _count?: {
    comments: number;
    attachments: number;
  };
}

export interface TicketListResponse {
  success: boolean;
  data: Ticket[];
  count: number;
}

export interface TicketDetailResponse {
  success: boolean;
  data: Ticket;
}

export interface TicketCreateRequest {
  title: string;
  description: string;
  category?: TicketCategory;
  priority?: TicketPriority;
}

export interface TicketUpdateRequest {
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedToId?: string | null;
  resolutionNotes?: string;
}

export interface TicketCommentRequest {
  content: string;
  isInternal?: boolean;
}

export const TICKET_STATUSES: Record<TicketStatus, { label: string; color: string; textColor: string }> = {
  OPEN: { label: "Open", color: "bg-red-100", textColor: "text-red-700" },
  ASSIGNED: { label: "Assigned", color: "bg-yellow-100", textColor: "text-yellow-700" },
  IN_PROGRESS: { label: "In Progress", color: "bg-blue-100", textColor: "text-blue-700" },
  WAITING: { label: "Waiting", color: "bg-purple-100", textColor: "text-purple-700" },
  RESOLVED: { label: "Resolved", color: "bg-green-100", textColor: "text-green-700" },
  CLOSED: { label: "Closed", color: "bg-gray-100", textColor: "text-gray-700" },
  REOPENED: { label: "Reopened", color: "bg-orange-100", textColor: "text-orange-700" },
};

export const TICKET_PRIORITIES: Record<TicketPriority, { label: string; color: string; textColor: string }> = {
  LOW: { label: "Low", color: "bg-gray-100", textColor: "text-gray-700" },
  NORMAL: { label: "Normal", color: "bg-blue-100", textColor: "text-blue-700" },
  HIGH: { label: "High", color: "bg-orange-100", textColor: "text-orange-700" },
  URGENT: { label: "Urgent", color: "bg-red-100", textColor: "text-red-700" },
};

export const TICKET_CATEGORIES: Record<TicketCategory, { label: string }> = {
  BILLING: { label: "Billing & Payment" },
  TECHNICAL: { label: "Technical Issue" },
  GENERAL: { label: "General Inquiry" },
  FEATURE: { label: "Feature Request" },
  OTHER: { label: "Other" },
};
