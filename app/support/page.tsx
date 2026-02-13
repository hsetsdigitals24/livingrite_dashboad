import Link from "next/link";
import { HelpCircle, Plus, Search, MessageSquare } from "lucide-react";

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-teal-100 p-4 rounded-full">
                <HelpCircle className="w-12 h-12 text-teal-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How Can We Help?
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're here to support you. Submit a ticket and our team will assist
              you as soon as possible.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* New Ticket */}
          <Link
            href="/support/new"
            className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-8 block group"
          >
            <div className="flex items-start gap-4">
              <div className="bg-teal-100 p-3 rounded-lg group-hover:bg-teal-200 transition-colors">
                <Plus className="w-6 h-6 text-teal-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                  Create New Ticket
                </h2>
                <p className="text-gray-600">
                  Report an issue or request help from our support team
                </p>
              </div>
            </div>
          </Link>

          {/* Track Ticket */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Track Your Ticket
                </h2>
                <p className="text-gray-600 mb-4">
                  Have a ticket number? Check its status here:
                </p>
                <input
                  type="text"
                  placeholder="Enter ticket number or ID..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Support Info */}
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Support Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-teal-600" />
                Response Time
              </h3>
              <p className="text-gray-700">
                We aim to respond to all tickets within <strong>24 hours</strong>. Urgent tickets receive faster responses.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-teal-600" />
                Available 24/7
              </h3>
              <p className="text-gray-700">
                Submit tickets anytime. Our support team works around the clock to help you.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Plus className="w-5 h-5 text-teal-600" />
                Multiple Channels
              </h3>
              <p className="text-gray-700">
                Get help via support tickets, email, or chat with our support team.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "What should I include in my ticket?",
                a: "Please provide a clear title, detailed description of the issue, what category it falls into, and the priority level. This helps us resolve your issue faster.",
              },
              {
                q: "Can I attach files to my ticket?",
                a: "Yes! You can add files and screenshots to your tickets to help us understand the issue better. Attach them via comments after creating your ticket.",
              },
              {
                q: "What do the priority levels mean?",
                a: "Low = non-urgent issues, Normal = standard requests, High = important matters, Urgent = critical issues affecting your service.",
              },
              {
                q: "Will I get notifications about my ticket?",
                a: "Yes! You'll receive email notifications when your ticket is assigned, updated, or resolved.",
              },
            ].map((item, idx) => (
              <details
                key={idx}
                className="bg-white border border-gray-200 rounded-lg p-4 group"
              >
                <summary className="font-semibold text-gray-900 cursor-pointer hover:text-teal-600 transition-colors">
                  {item.q}
                </summary>
                <p className="text-gray-700 mt-3 text-sm">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
