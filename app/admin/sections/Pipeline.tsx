'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { Plus, Filter, TrendingUp } from 'lucide-react';
import InquiryForm from '../components/InquiryForm';
import ProposalForm from '../components/ProposalForm';

interface InquiryData {
  id: string;
  name: string;
  email: string;
  status: string;
  inquirySource?: string;
  subject?: string;
  createdAt: string;
}

interface ProposalData {
  id: string;
  status: string;
  title?: string;
  totalAmount?: number;
  sentAt?: string;
  acceptedAt?: string;
  booking: {
    clientName: string;
    clientEmail: string;
  };
}

interface PipelineStats {
  total: number;
  byStatus: {
    new: number;
    qualified: number;
    disqualified: number;
    converted: number;
  };
  conversionRate: number;
  qualificationRate: number;
}

interface ProposalStats {
  total: number;
  byStatus: {
    draft: number;
    sent: number;
    viewed: number;
    accepted: number;
    rejected: number;
  };
  acceptanceRate: number;
  viewRate: number;
}

const PipelineSection = () => {
  const [inquiries, setInquiries] = useState<InquiryData[]>([]);
  const [proposals, setProposals] = useState<ProposalData[]>([]);
  const [inquiryStats, setInquiryStats] = useState<PipelineStats | null>(null);
  const [proposalStats, setProposalStats] = useState<ProposalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'inquiries' | 'proposals'>('overview');
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [selectedBookingName, setSelectedBookingName] = useState('');
  const [inquiryFilter, setInquiryFilter] = useState<string>('');
  const [proposalFilter, setProposalFilter] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [inquiriesRes, proposalsRes, inquiryStatsRes, proposalStatsRes] = await Promise.all([
        fetch('/api/inquiries?limit=20'),
        fetch('/api/proposals?limit=20'),
        fetch('/api/inquiries?stats=true'),
        fetch('/api/proposals?stats=true'),
      ]);

      if (inquiriesRes.ok) {
        const data = await inquiriesRes.json();
        setInquiries(data.data || []);
      }

      if (proposalsRes.ok) {
        const data = await proposalsRes.json();
        setProposals(data.data || []);
      }

      if (inquiryStatsRes.ok) {
        setInquiryStats(await inquiryStatsRes.json());
      }

      if (proposalStatsRes.ok) {
        setProposalStats(await proposalStatsRes.json());
      }
    } catch (error) {
      console.error('Error fetching pipeline data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInquiryQualify = async (id: string) => {
    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'qualify' }),
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error qualifying inquiry:', error);
    }
  };

  const handleInquiryDisqualify = async (id: string) => {
    const reason = prompt('Enter disqualification reason:');
    if (!reason) return;

    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'disqualify', reason }),
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error disqualifying inquiry:', error);
    }
  };

  const handleProposalSend = async (id: string) => {
    try {
      const response = await fetch(`/api/proposals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send' }),
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error sending proposal:', error);
    }
  };

  const handleProposalAccept = async (id: string) => {
    try {
      const response = await fetch(`/api/proposals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'accept' }),
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error accepting proposal:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      NEW: 'bg-blue-100 text-blue-700',
      QUALIFIED: 'bg-yellow-100 text-yellow-700',
      DISQUALIFIED: 'bg-red-100 text-red-700',
      CONVERTED: 'bg-green-100 text-green-700',
      DRAFT: 'bg-gray-100 text-gray-700',
      SENT: 'bg-blue-100 text-blue-700',
      VIEWED: 'bg-purple-100 text-purple-700',
      ACCEPTED: 'bg-green-100 text-green-700',
      REJECTED: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const inquiryFunnelData = inquiryStats
    ? [
        { name: 'New', value: inquiryStats.byStatus.new },
        { name: 'Qualified', value: inquiryStats.byStatus.qualified },
        { name: 'Converted', value: inquiryStats.byStatus.converted },
        { name: 'Disqualified', value: inquiryStats.byStatus.disqualified },
      ]
    : [];

  const proposalFunnelData = proposalStats
    ? [
        { name: 'Draft', value: proposalStats.byStatus.draft },
        { name: 'Sent', value: proposalStats.byStatus.sent },
        { name: 'Viewed', value: proposalStats.byStatus.viewed },
        { name: 'Accepted', value: proposalStats.byStatus.accepted },
      ]
    : [];

  const COLORS = ['#12ccda', '#f762be', '#10b981', '#f59e0b'];

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Sales Pipeline</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-200 h-32 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Sales Pipeline</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowInquiryForm(true)}
            className="bg-cyan-500 text-white hover:bg-cyan-600 flex items-center gap-2"
          >
            <Plus size={18} />
            New Inquiry
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'overview'
              ? 'border-b-2 border-cyan-500 text-cyan-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'inquiries'
              ? 'border-b-2 border-cyan-500 text-cyan-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Inquiries {inquiryStats && `(${inquiryStats.total})`}
        </button>
        <button
          onClick={() => setActiveTab('proposals')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'proposals'
              ? 'border-b-2 border-cyan-500 text-cyan-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Proposals {proposalStats && `(${proposalStats.total})`}
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inquiry Funnel */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Inquiry Funnel</h3>
              {inquiryStats && (
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp size={18} />
                  <span className="text-sm font-medium">
                    {inquiryStats.conversionRate.toFixed(1)}% Convert
                  </span>
                </div>
              )}
            </div>
            {inquiryFunnelData.length > 0 && (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={inquiryFunnelData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {inquiryFunnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>

          {/* Proposal Funnel */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Proposal Funnel</h3>
              {proposalStats && (
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp size={18} />
                  <span className="text-sm font-medium">
                    {proposalStats.acceptanceRate.toFixed(1)}% Accept
                  </span>
                </div>
              )}
            </div>
            {proposalFunnelData.length > 0 && (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={proposalFunnelData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {proposalFunnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>
      )}

      {/* Inquiries Tab */}
      {activeTab === 'inquiries' && (
        <Card className="p-6 overflow-x-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Inquiries</h3>
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Name</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Email</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Source</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Status</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Date</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{inquiry.name}</td>
                  <td className="px-4 py-3 text-gray-600">{inquiry.email}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {inquiry.inquirySource || 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {inquiry.status === 'NEW' && (
                      <div className="flex gap-1">
                        <Button
                          onClick={() => handleInquiryQualify(inquiry.id)}
                          className="bg-green-500 text-white hover:bg-green-600 text-xs py-1 px-2"
                        >
                          Qualify
                        </Button>
                        <Button
                          onClick={() => handleInquiryDisqualify(inquiry.id)}
                          className="bg-red-500 text-white hover:bg-red-600 text-xs py-1 px-2"
                        >
                          Disqualify
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Proposals Tab */}
      {activeTab === 'proposals' && (
        <Card className="p-6 overflow-x-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Proposals</h3>
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Client</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Amount</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Status</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Sent</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {proposals.map((proposal) => (
                <tr key={proposal.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {proposal.booking.clientName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {proposal.totalAmount
                      ? `₦${proposal.totalAmount.toLocaleString()}`
                      : 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(proposal.status)}`}>
                      {proposal.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {proposal.sentAt
                      ? new Date(proposal.sentAt).toLocaleDateString()
                      : 'Not sent'}
                  </td>
                  <td className="px-4 py-3">
                    {proposal.status === 'DRAFT' && (
                      <Button
                        onClick={() => handleProposalSend(proposal.id)}
                        className="bg-blue-500 text-white hover:bg-blue-600 text-xs py-1 px-2"
                      >
                        Send
                      </Button>
                    )}
                    {proposal.status === 'SENT' && (
                      <Button
                        onClick={() => handleProposalAccept(proposal.id)}
                        className="bg-green-500 text-white hover:bg-green-600 text-xs py-1 px-2"
                      >
                        Accept
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Forms */}
      {showInquiryForm && (
        <InquiryForm
          onClose={() => setShowInquiryForm(false)}
          onSuccess={() => {
            fetchData();
            setShowInquiryForm(false);
          }}
        />
      )}

      {showProposalForm && (
        <ProposalForm
          bookingId={selectedBookingId}
          clientName={selectedBookingName}
          onClose={() => setShowProposalForm(false)}
          onSuccess={() => {
            fetchData();
            setShowProposalForm(false);
          }}
        />
      )}
    </div>
  );
};

export default PipelineSection;
