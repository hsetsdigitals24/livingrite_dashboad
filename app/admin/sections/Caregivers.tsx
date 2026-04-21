'use client';

import { useEffect, useState } from 'react';
import { ResponsiveTable } from '@/components/admin/ResponsiveTable';

interface Caregiver {
  id: string;
  name: string | null;
  email: string | null;
  createdAt: string;
  caregiverProfile: {
    licenseNumber: string | null;
    specialization: string[];
    yearsOfExperience: number | null;
  } | null;
  patientsAsCaregiver: Array<{ id: string }>;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function CaregiversSection() {
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchCaregivers = async (page: number, searchTerm: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search: searchTerm,
      });

      const response = await fetch(`/api/admin/caregivers?${params}`);
      const result = await response.json();

      if (result.success) {
        setCaregivers(result.data);
        setPagination(result.pagination);
        setError(null);
      } else {
        setError('Failed to load caregivers');
      }
    } catch (err) {
      setError('An error occurred while fetching caregivers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaregivers(1, '');
  }, []);

  const handleSearch = (value: string) => {
    setSearch(value);
    fetchCaregivers(1, value);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchCaregivers(newPage, search);
    }
  };

  if (loading && caregivers.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading caregivers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Caregivers</h1>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {/* Table */}
      <ResponsiveTable
        columns={[
          { label: 'Name', key: 'name', render: (val) => val || 'N/A' },
          { label: 'Email', key: 'email', render: (val) => val || 'N/A' },
          {
            label: 'License',
            key: 'caregiverProfile',
            render: (_, row) => row.caregiverProfile?.licenseNumber || 'N/A',
          },
          {
            label: 'Specialization',
            key: 'caregiverProfile',
            render: (_, row) => {
              const specs = row.caregiverProfile?.specialization;
              if (specs && specs.length > 0) {
                return (
                  <div className="flex flex-wrap gap-1">
                    {specs.slice(0, 2).map((spec: string, idx: number) => (
                      <span
                        key={idx}
                        className="inline-block px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs"
                      >
                        {spec}
                      </span>
                    ))}
                    {specs.length > 2 && (
                      <span className="inline-block px-2 py-1 text-gray-600 text-xs">
                        +{specs.length - 2} more
                      </span>
                    )}
                  </div>
                );
              }
              return 'N/A';
            },
          },
          {
            label: 'Experience',
            key: 'caregiverProfile',
            render: (_, row) => {
              const years = row.caregiverProfile?.yearsOfExperience;
              return years ? `${years} yrs` : 'N/A';
            },
          },
          {
            label: 'Patients',
            key: 'patientsAsCaregiver',
            render: (val) => (
              <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {val?.length || 0}
              </span>
            ),
          },
          {
            label: 'Joined',
            key: 'createdAt',
            render: (val) => new Date(val).toLocaleDateString(),
          },
        ]}
        data={caregivers}
        isLoading={loading}
        emptyMessage="No caregivers found"
      />

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {caregivers.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0} to{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
          {pagination.total} caregivers
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
          >
            Previous
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .slice(
                Math.max(0, pagination.page - 2),
                Math.min(pagination.totalPages, pagination.page + 1)
              )
              .map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    pagination.page === page
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
          </div>

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
