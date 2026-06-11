"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { TicketForm } from "@/components/tickets/TicketForm";
import { HelpCircle } from "lucide-react";

export default function NewTicketPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: {
    title: string;
    description: string;
    category: string;
    priority: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create ticket");
      }

      const result = await response.json();

      // Redirect to ticket status page
      router.push(`/support/tickets/${result.data.id}`);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="w-8 h-8 text-teal-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Create Support Ticket
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Need help? Tell us what's wrong and we'll get back to you as soon as
            possible.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <TicketForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                How long will it take to get a response?
              </h3>
              <p className="text-gray-700">
                We aim to respond to all tickets within 24 hours. Urgent tickets
                may receive faster responses.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                What's the difference between priorities?
              </h3>
              <p className="text-gray-700">
                Low = non-urgent issues, Normal = standard requests, High =
                important matters, Urgent = critical issues affecting your
                service.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I track my ticket?
              </h3>
              <p className="text-gray-700">
                Yes! After creating a ticket, you'll receive a link to track its
                status in real-time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
