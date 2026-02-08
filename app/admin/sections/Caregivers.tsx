'use client';

import { useEffect, useState } from 'react';

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
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                License
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Specialization
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Experience
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Patients
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Joined
              </th>
            </tr>
          </thead>
          <tbody>
            {caregivers.length > 0 ? (
              caregivers.map((caregiver) => (
                <tr
                  key={caregiver.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {caregiver.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {caregiver.email || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {caregiver.caregiverProfile?.licenseNumber || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {caregiver.caregiverProfile?.specialization?.length ? (
                      <div className="flex flex-wrap gap-1">
                        {caregiver.caregiverProfile.specialization.slice(0, 2).map((spec, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs"
                          >
                            {spec}
                          </span>
                        ))}
                        {caregiver.caregiverProfile.specialization.length > 2 && (
                          <span className="inline-block px-2 py-1 text-gray-600 text-xs">
                            +{caregiver.caregiverProfile.specialization.length - 2} more
                          </span>
                        )}
                      </div>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {caregiver.caregiverProfile?.yearsOfExperience
                      ? `${caregiver.caregiverProfile.yearsOfExperience} yrs`
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {caregiver.patientsAsCaregiver.length}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(caregiver.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No caregivers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
