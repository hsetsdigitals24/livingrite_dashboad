'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AllowListEntry {
  id: string;
  email: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  addedAt: string;
  addedBy: string;
  notes?: string;
}

interface ApiResponse {
  items: AllowListEntry[];
  total: number;
  page: number;
  limit: number;
}

interface BulkImportResponse {
  success: number;
  skipped: number;
  duplicates: string[];
  message: string;
}

export default function CaregiverAllowList() {
  const [entries, setEntries] = useState<AllowListEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'APPROVED' | 'PENDING' | 'REJECTED'>('ALL');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const [addingEmail, setAddingEmail] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const LIMIT = limit;

  // Fetch allow list entries
  const fetchEntries = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: LIMIT.toString(),
        ...(searchEmail && { email: searchEmail }),
        ...(filterStatus !== 'ALL' && { status: filterStatus }),
      });

      const res = await fetch(`/api/admin/caregiver-allow-list?${params}`);
      const data: ApiResponse = await res.json();
      setEntries(data.items);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching allow list:', error);
      setMessage({ type: 'error', text: 'Failed to load allow list' });
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and whenever page/filters change
  useEffect(() => {
    fetchEntries();
  }, [page, searchEmail, filterStatus]);

  // Handle add single email
  const handleAddEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!addingEmail.trim()) {
      setMessage({ type: 'error', text: 'Please enter an email' });
      return;
    }

    setAddLoading(true);
    try {
      const res = await fetch('/api/admin/caregiver-allow-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: addingEmail.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Failed to add email' });
      } else {
        setMessage({ type: 'success', text: 'Email added to allow list' });
        setAddingEmail('');
        setPage(1); // Reset to first page
        await fetchEntries();
      }
    } catch (error) {
      console.error('Error adding email:', error);
      setMessage({ type: 'error', text: 'Failed to add email' });
    } finally {
      setAddLoading(false);
    }
  };

  // Handle remove email
  const handleRemoveEmail = async (email: string) => {
    if (!confirm(`Remove ${email} from allow list?`)) return;

    try {
      const encodedEmail = encodeURIComponent(email);
      const res = await fetch(`/api/admin/caregiver-allow-list/${encodedEmail}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to remove email' });
      } else {
        setMessage({ type: 'success', text: 'Email removed from allow list' });
        await fetchEntries();
      }
    } catch (error) {
      console.error('Error removing email:', error);
      setMessage({ type: 'error', text: 'Failed to remove email' });
    }
  };

  // Handle CSV file upload
  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setBulkLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/caregiver-allow-list/bulk', {
        method: 'POST',
        body: formData,
      });

      const data: BulkImportResponse = await res.json();

      if (!res.ok) {
        setMessage({ type: 'error', text: data.message || 'Failed to import file' });
      } else {
        setMessage({
          type: 'success',
          text: `Import successful: ${data.success} added, ${data.skipped} skipped`,
        });
        setPage(1);
        await fetchEntries();
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage({ type: 'error', text: 'Failed to upload file' });
    } finally {
      setBulkLoading(false);
    }
  };

  // Handle export CSV
  const handleExportCSV = async () => {
    try {
      const res = await fetch('/api/admin/caregiver-allow-list/bulk');
      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `caregiver-allow-list-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setMessage({ type: 'success', text: 'CSV exported successfully' });
    } catch (error) {
      console.error('Error exporting CSV:', error);
      setMessage({ type: 'error', text: 'Failed to export CSV' });
    }
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Caregiver Allow List</h2>
        <p className="text-gray-600">Manage the list of approved caregivers for signup</p>
      </div>

      {/* Message Alert */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Add Single Email Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Add Email to Allow List</h3>
        <form onSubmit={handleAddEmail} className="flex gap-2">
          <Input
            type="email"
            placeholder="caregiver@example.com"
            value={addingEmail}
            onChange={(e) => setAddingEmail(e.target.value)}
            disabled={addLoading}
          />
          <Button type="submit" disabled={addLoading}>
            {addLoading ? 'Adding...' : 'Add Email'}
          </Button>
        </form>
      </div>

      {/* Bulk Operations Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Bulk Operations</h3>
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Import from CSV
            </label>
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt"
                onChange={handleBulkUpload}
                disabled={bulkLoading}
                className="block text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              {bulkLoading && <span className="text-sm text-gray-500">Uploading...</span>}
            </div>
            <p className="text-xs text-gray-500 mt-2">One email per line</p>
          </div>

          <div className="flex items-end">
            <Button onClick={handleExportCSV} variant="outline">
              Export to CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Email
            </label>
            <Input
              type="email"
              placeholder="Search by email..."
              value={searchEmail}
              onChange={(e) => {
                setSearchEmail(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value as any);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Entries Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Added Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Loading entries...
                  </td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No entries found
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {entry.email}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          entry.status === 'APPROVED'
                            ? 'bg-green-100 text-green-800'
                            : entry.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(entry.addedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveEmail(entry.email)}
                        className="text-xs"
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {page} of {totalPages} ({total} total entries)
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">How it works:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Add caregiver emails individually or import from CSV</li>
          <li>• Only caregivers on this list can signup and choose a title (RN or DR)</li>
          <li>• Remove emails to prevent signup access</li>
          <li>• Export the current list for backup or sharing</li>
        </ul>
      </div>
    </div>
  );
}
