'use client';

import React, { useEffect, useState } from 'react';

interface RevenueStats {
  totalRevenue: number;
  totalPending: number;
  totalPaid: number;
  totalRefunded: number;
  successRate: number;
  averageOrderValue: number;
  invoiceCount: number;
  paymentCount: number;
  revenueByService: Array<{
    service: string;
    revenue: number;
    count: number;
  }>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    paid: number;
    pending: number;
  }>;
  topClients: Array<{
    name: string;
    email: string;
    totalSpent: number;
    bookingCount: number;
  }>;
}

export function RevenueSection() {
  const [stats, setStats] = useState<RevenueStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRevenueStats();
  }, []);

  const fetchRevenueStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard/revenue');
      if (!response.ok) {
        throw new Error('Failed to fetch revenue stats');
      }
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading revenue data...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }

  if (!stats) {
    return <div className="p-6 text-center text-gray-500">No data available</div>;
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600 mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-900">
            ${stats.totalRevenue.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {stats.paymentCount} payments
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600 mb-2">Paid</p>
          <p className="text-3xl font-bold text-green-600">
            ${stats.totalPaid.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Success Rate: {stats.successRate.toFixed(1)}%
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600 mb-2">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">
            ${stats.totalPending.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Average Order: ${stats.averageOrderValue.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600 mb-2">Refunded</p>
          <p className="text-3xl font-bold text-red-600">
            ${stats.totalRefunded.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {stats.invoiceCount} invoices
          </p>
        </div>
      </div>

      {/* Revenue by Service */}
      {stats.revenueByService.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Service</h3>
          <div className="space-y-3">
            {stats.revenueByService.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.service}</p>
                  <p className="text-sm text-gray-600">{item.count} bookings</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ${item.revenue.toFixed(2)}
                  </p>
                  <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(item.revenue / stats.totalRevenue) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revenue Trend */}
      {stats.revenueByMonth.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <div className="space-y-3">
            {stats.revenueByMonth.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-1">
                  <p className="font-medium text-gray-900">{item.month}</p>
                  <p className="font-semibold text-gray-900">
                    ${item.revenue.toFixed(2)}
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div className="flex h-full">
                    <div
                      className="bg-green-600"
                      style={{
                        width: `${item.paid > 0 ? (item.paid / item.revenue) * 100 : 0}%`,
                      }}
                      title={`Paid: $${item.paid.toFixed(2)}`}
                    />
                    <div
                      className="bg-yellow-500"
                      style={{
                        width: `${
                          item.pending > 0 ? (item.pending / item.revenue) * 100 : 0
                        }%`,
                      }}
                      title={`Pending: $${item.pending.toFixed(2)}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Clients */}
      {stats.topClients.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Clients</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 font-semibold text-gray-600">Name</th>
                  <th className="text-left py-2 font-semibold text-gray-600">Email</th>
                  <th className="text-right py-2 font-semibold text-gray-600">
                    Total Spent
                  </th>
                  <th className="text-right py-2 font-semibold text-gray-600">
                    Bookings
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.topClients.map((client, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 font-medium text-gray-900">{client.name}</td>
                    <td className="py-3 text-gray-600">{client.email}</td>
                    <td className="py-3 text-right font-semibold text-gray-900">
                      ${client.totalSpent.toFixed(2)}
                    </td>
                    <td className="py-3 text-right text-gray-600">
                      {client.bookingCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
