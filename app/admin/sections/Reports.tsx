'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, TrendingUp, Users, DollarSign, BookOpen } from 'lucide-react';
import { DateRangePicker } from '@/components/admin/DateRangePicker';

interface ReportData {
  acquisitionSources?: any;
  conversionFunnel?: any;
  clientMetrics?: any;
  serviceRevenue?: any;
  bookingMetrics?: any;
}

interface DateRange {
  startDate: Date;
  endDate: Date;
}

export default function ReportsHub() {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date(),
  });
  const [activeReport, setActiveReport] = useState<
    'acquisition' | 'funnel' | 'clients' | 'services' | 'bookings'
  >('acquisition');
  const [data, setData] = useState<ReportData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString(),
      });

      // Fetch all reports in parallel
      const [acquisitionRes, funnelRes, clientRes, serviceRes, bookingRes] = await Promise.all(
        [
          fetch(`/api/admin/reports/acquisition-sources?${params}`),
          fetch(`/api/admin/reports/conversion-funnel?${params}`),
          fetch(`/api/admin/reports/client-metrics?${params}`),
          fetch(`/api/admin/reports/service-revenue?${params}`),
          fetch(`/api/admin/reports/booking-metrics?${params}`),
        ]
      );

      if (
        !acquisitionRes.ok ||
        !funnelRes.ok ||
        !clientRes.ok ||
        !serviceRes.ok ||
        !bookingRes.ok
      ) {
        throw new Error('Failed to fetch report data');
      }

      const [acq, funnel, client, service, booking] = await Promise.all([
        acquisitionRes.json(),
        funnelRes.json(),
        clientRes.json(),
        serviceRes.json(),
        bookingRes.json(),
      ]);

      setData({
        acquisitionSources: acq.data,
        conversionFunnel: funnel.data,
        clientMetrics: client.data,
        serviceRevenue: service.data,
        bookingMetrics: booking.data,
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="mt-1 text-gray-600">
          Comprehensive reporting dashboard for business metrics and performance analysis
        </p>
      </div>

      {/* Date Range Picker */}
      <DateRangePicker onDateRangeChange={setDateRange} initialRange={dateRange} />

      {/* Error Alert */}
      {error && (
        <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Report Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-4 overflow-x-auto">
          {[
            { id: 'acquisition', label: 'Acquisition Sources', icon: TrendingUp },
            { id: 'funnel', label: 'Conversion Funnel', icon: DollarSign },
            { id: 'clients', label: 'Client Analytics', icon: Users },
            { id: 'services', label: 'Service Metrics', icon: BookOpen },
            { id: 'bookings', label: 'Booking Analytics', icon: BookOpen },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveReport(id as any)}
              className={`flex items-center gap-2 border-b-2 px-4 py-2 font-medium transition-colors ${
                activeReport === id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Report Content */}
      {loading ? (
        <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-12">
          <p className="text-gray-500">Loading report data...</p>
        </div>
      ) : (
        <>
          {activeReport === 'acquisition' && data.acquisitionSources && (
            <AcquisitionReport data={data.acquisitionSources} />
          )}
          {activeReport === 'funnel' && data.conversionFunnel && (
            <ConversionFunnelReport data={data.conversionFunnel} />
          )}
          {activeReport === 'clients' && data.clientMetrics && (
            <ClientMetricsReport data={data.clientMetrics} />
          )}
          {activeReport === 'services' && data.serviceRevenue && (
            <ServiceRevenueReport data={data.serviceRevenue} />
          )}
          {activeReport === 'bookings' && data.bookingMetrics && (
            <BookingMetricsReport data={data.bookingMetrics} />
          )}
        </>
      )}
    </div>
  );
}

// Acquisition Report Component
function AcquisitionReport({ data }: { data: any[] }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Source</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Inquiries</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Bookings</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Paid Clients</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Revenue</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Conversion %</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Revenue/Inquiry</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-3 text-sm text-gray-900">{row.source}</td>
                <td className="px-6 py-3 text-right text-sm text-gray-900">{row.inquiries}</td>
                <td className="px-6 py-3 text-right text-sm text-gray-900">{row.bookings}</td>
                <td className="px-6 py-3 text-right text-sm text-gray-900">{row.paidClients}</td>
                <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                  ${row.revenue.toFixed(2)}
                </td>
                <td className="px-6 py-3 text-right text-sm text-gray-900">
                  {row.conversionRate.toFixed(1)}%
                </td>
                <td className="px-6 py-3 text-right text-sm text-gray-900">
                  ${row.revenuePerInquiry.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Conversion Funnel Component
function ConversionFunnelReport({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Overall Conversion Rate</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {data.overallConversionRate.toFixed(1)}%
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Avg Time to Payment</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {(data.averageTimeToPaymentMs / (1000 * 60 * 60 * 24)).toFixed(0)} days
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">Total Inquiries to Paid</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {data.stages[0].count} → {data.stages[5].count}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Conversion Funnel</h3>
        <div className="space-y-3">
          {data.stages.map((stage: any, idx: number) => (
            <div key={idx}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium text-gray-900">{stage.stage}</span>
                <span className="text-gray-600">
                  {stage.count} ({stage.percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-blue-600"
                  style={{ width: `${stage.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Client Metrics Component
function ClientMetricsReport({ data }: { data: any }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-600">New Clients This Period</p>
        <p className="mt-2 text-4xl font-bold text-gray-900">{data.newClientsCount}</p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-600">Returning Clients</p>
        <p className="mt-2 text-4xl font-bold text-gray-900">{data.returningClientsCount}</p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-600">Active Clients (30 days)</p>
        <p className="mt-2 text-4xl font-bold text-gray-900">{data.activeClientsCount}</p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-600">Client Retention Rate</p>
        <p className="mt-2 text-4xl font-bold text-gray-900">{data.retentionRate.toFixed(1)}%</p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-600">Avg Client Lifetime Value</p>
        <p className="mt-2 text-4xl font-bold text-gray-900">
          ${data.clientLifetimeValue.average.toFixed(2)}
        </p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-600">Churn Rate</p>
        <p className="mt-2 text-4xl font-bold text-gray-900">{data.churnRate.toFixed(1)}%</p>
      </div>
    </div>
  );
}

// Service Revenue Component
function ServiceRevenueReport({ data }: { data: any[] }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Service</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Base Price</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actual Revenue</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Estimated Revenue</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Variance</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Conversion %</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Profit Margin</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-3 text-sm text-gray-900">{row.serviceName}</td>
                <td className="px-6 py-3 text-right text-sm text-gray-900">
                  ${row.basePrice?.toFixed(2) || 'N/A'}
                </td>
                <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                  ${row.actualRevenue.toFixed(2)}
                </td>
                <td className="px-6 py-3 text-right text-sm text-gray-900">
                  ${row.estimatedRevenue.toFixed(2)}
                </td>
                <td className="px-6 py-3 text-right text-sm text-gray-900">
                  <span
                    className={
                      row.revenueVariance > 0
                        ? 'text-green-600'
                        : row.revenueVariance < 0
                          ? 'text-red-600'
                          : ''
                    }
                  >
                    ${row.revenueVariance.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-3 text-right text-sm text-gray-900">
                  {row.conversionRate.toFixed(1)}%
                </td>
                <td className="px-6 py-3 text-right text-sm text-gray-900">
                  {row.profitMargin.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Booking Metrics Component
function BookingMetricsReport({ data }: { data: any }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-600">Total Booked</p>
        <p className="mt-2 text-4xl font-bold text-gray-900">{data.totalBooked}</p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-600">Completed</p>
        <p className="mt-2 text-4xl font-bold text-gray-900">{data.totalCompleted}</p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-600">Cancelled</p>
        <p className="mt-2 text-4xl font-bold text-gray-900">{data.totalCancelled}</p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-600">Completion Rate</p>
        <p className="mt-2 text-4xl font-bold text-gray-900">{data.completionRate.toFixed(1)}%</p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-600">No-Show Rate</p>
        <p className="mt-2 text-4xl font-bold text-gray-900">{data.noShowRate.toFixed(1)}%</p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-600">Avg Booking Value</p>
        <p className="mt-2 text-4xl font-bold text-gray-900">${data.averageBookingValue.toFixed(2)}</p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-6 col-span-3">
        <p className="text-sm text-gray-600">Booking to Payment Conversion</p>
        <p className="mt-2 text-4xl font-bold text-gray-900">
          {data.conversionToPaymentRate.toFixed(1)}%
        </p>
      </div>
    </div>
  );
}
