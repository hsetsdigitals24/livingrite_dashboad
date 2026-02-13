"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { AlertCircle, MessageSquare, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Ticket {
  id: string;
  number: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  resolutionNotes?: string;
  comments: Array<{
    id: string;
    content: string;
    author: { name: string };
    createdAt: string;
    isInternal: boolean;
  }>;
}

export default function TicketStatusPage() {
  const params = useParams();
  const ticketId = params.id as string;
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [isCommentLoading, setIsCommentLoading] = useState(false);

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  const fetchTicket = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/tickets/${ticketId}`);
      if (!response.ok) throw new Error("Ticket not found");

      const data = await response.json();
      setTicket(data.data);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load ticket"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !ticket) return;

    setIsCommentLoading(true);
    try {
      const response = await fetch(`/api/tickets/${ticket.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: comment }),
      });

      if (!response.ok) throw new Error("Failed to add comment");

      setComment("");
      await fetchTicket();
    } catch (err) {
      console.error(err);
      alert("Failed to add comment");
    } finally {
      setIsCommentLoading(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading ticket...</p>
      </main>
    );
  }

  if (error || !ticket) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full flex gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div>
            <h2 className="font-semibold text-red-900">Error</h2>
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  const getStatusIcon = (status: string) => {
    if (status === "RESOLVED") return <CheckCircle className="w-5 h-5 text-green-600" />;
    return <AlertCircle className="w-5 h-5 text-blue-600" />;
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Ticket #{ticket.number}
              </h1>
              <p className="text-gray-600 mt-2">{ticket.title}</p>
            </div>
            <div className="flex gap-2">
              <Badge>{ticket.status}</Badge>
              <Badge>{ticket.priority}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {getStatusIcon(ticket.status)}
            {ticket.status === "RESOLVED"
              ? "This ticket has been resolved"
              : "We're working on this issue"}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Details */}
        <div className="bg-white rounded-lg shadow mb-8 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 font-medium">Category</p>
              <p className="text-gray-900 mt-1">{ticket.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Created</p>
              <p className="text-gray-900 mt-1">
                {new Date(ticket.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-gray-600 font-medium mb-2">Description</p>
            <p className="text-gray-700 whitespace-pre-wrap">
              {ticket.description}
            </p>
          </div>

          {ticket.resolutionNotes && (
            <div className="mt-6 pt-6 border-t bg-green-50 p-4 rounded">
              <p className="text-sm text-green-700 font-medium mb-2">
                Resolution
              </p>
              <p className="text-green-900 whitespace-pre-wrap">
                {ticket.resolutionNotes}
              </p>
            </div>
          )}
        </div>

        {/* Comments */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Comments ({ticket.comments.length})
          </h2>

          {/* Comments list */}
          <div className="space-y-6 mb-8">
            {ticket.comments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No comments yet. Check back soon for updates!
              </p>
            ) : (
              ticket.comments.map((cmt) => (
                <div key={cmt.id} className="border-l-4 border-teal-500 pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900">
                      {cmt.author.name}
                    </p>
                    <span className="text-sm text-gray-500">
                      {new Date(cmt.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {cmt.content}
                  </p>
                  {cmt.isInternal && (
                    <span className="inline-block text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded mt-2">
                      Internal note
                    </span>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Add comment form */}
          {ticket.status !== "CLOSED" && (
            <form onSubmit={handleAddComment} className="border-t pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Add an update
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share any additional information or ask questions..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={isCommentLoading}
                className="mt-3 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
              >
                {isCommentLoading ? "Posting..." : "Post Comment"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
