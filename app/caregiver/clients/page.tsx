
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Eye,
  AlertCircle,
  Users,
  Heart,
} from 'lucide-react';
import CaregiverPatientDetailsModal from '@/app/admin/components/CaregiverPatientDetailsModal';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  biologicalGender?: string;
  dateOfBirth?: string;
  createdAt: string;
  caregivers: Array<{
    id: string;
    assignedAt: string;
    notes?: string;
  }>;
  vitals: Array<{
    createdAt: string;
  }>;
  dailyLogs: Array<{
    date: string;
  }>;
  medicalAppointments: Array<{
    date: string;
  }>;
  bookings: Array<{
    id: string;
    status: string;
  }>;
}

export default function CaregiverClients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [error, setError] = useState('');

  // Fetch patients
  useEffect(() => {
    fetchPatients();
  }, [currentPage, searchQuery, sortBy, sortOrder]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(
        `/api/caregiver/patients?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}&sortBy=${sortBy}&sortOrder=${sortOrder}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch patients');
      }

      const data = await response.json();
      setPatients(data.patients);
      setTotalItems(data.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowDetailsModal(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  if (error && !loading) {
    return (
      <div className="p-6 w-[80%] mx-auto py-6">
        <Card className="p-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button
                onClick={() => fetchPatients()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-[80%] relative mx-auto py-6">
      {/* Header */}
      <div>
        <button className='flex items-center justify-start gap-2 cursor-pointer px-4 my-2' onClick={() => window.history.back()}>
        <ChevronLeft className="w-5 h-5 text-gray-600 hover:text-gray-900 transition" /> Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Your Patients</h1>
        <p className="text-gray-600 mt-1">
          View and manage all patients assigned to you
        </p>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 outline-none bg-transparent text-gray-900 placeholder-gray-500"
          />
        </div>
      </Card>

      {/* Table */}
      <Card>
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : patients.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No patients assigned yet</p>
            <p className="text-gray-400 text-sm mt-1">
              {searchQuery
                ? 'Try adjusting your search criteria'
                : 'Contact your administrator to get assigned to patients'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 border-b">
                    <TableHead
                      className="cursor-pointer hover:bg-gray-100 transition"
                      onClick={() => handleSort('firstName')}
                    >
                      <div className="flex items-center gap-2">
                        Name
                        {sortBy === 'firstName' && (
                          <span className="text-blue-600">
                            {sortOrder === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead className="text-center">Age</TableHead>
                    <TableHead className="text-center">Vitals</TableHead>
                    <TableHead className="text-center">Daily Logs</TableHead>
                    <TableHead className="text-center">Appointments</TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-gray-100 transition"
                      onClick={() => handleSort('createdAt')}
                    >
                      <div className="flex items-center gap-2">
                        Assigned
                        {sortBy === 'createdAt' && (
                          <span className="text-blue-600">
                            {sortOrder === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => {
                    const assignmentDate = patient.caregivers[0]?.assignedAt;
                    const age = patient.dateOfBirth
                      ? Math.floor(
                          (new Date().getTime() -
                            new Date(patient.dateOfBirth).getTime()) /
                            (365.25 * 24 * 60 * 60 * 1000)
                        )
                      : null;

                    return (
                      <TableRow
                        key={patient.id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">
                              {patient.firstName} {patient.lastName}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm">
                          {patient.email || 'N/A'}
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm">
                          {patient.phone || 'N/A'}
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm capitalize">
                          {patient.biologicalGender || 'N/A'}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {age !== null ? `${age} yrs` : 'N/A'}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium flex items-center justify-center gap-1 inline-flex">
                            <Heart className="w-3 h-3" />
                            {patient.vitals.length}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            {patient.dailyLogs.length}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                            {patient.medicalAppointments.length}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm">
                          {assignmentDate
                            ? new Date(assignmentDate).toLocaleDateString()
                            : 'N/A'}
                        </TableCell>
                        <TableCell className="text-right">
                          <button
                            onClick={() => handleViewDetails(patient)}
                            className="p-2 hover:bg-blue-50 rounded-lg transition text-blue-600 hover:text-blue-700"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="border-t px-6 py-4 flex items-center justify-between bg-gray-50">
              <div className="text-sm text-gray-600">
                Showing <span className="font-medium">{startIndex}</span> to{' '}
                <span className="font-medium">{endIndex}</span> of{' '}
                <span className="font-medium">{totalItems}</span> patients
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1 || loading}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-lg font-medium transition ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  {totalPages > 5 && (
                    <>
                      <span className="text-gray-400">...</span>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className={`w-8 h-8 rounded-lg font-medium transition ${
                          currentPage === totalPages
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages || loading}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Details Modal */}
      {showDetailsModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <CaregiverPatientDetailsModal
          
          patientId={selectedPatient.id}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedPatient(null);
          }}
        /></div>
      )}
    </div>
  );
}