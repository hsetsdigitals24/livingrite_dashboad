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
  Plus,
  Search,
  Edit2,
  Eye,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import AddPatientForm from '../components/AddPatientForm';
import EditPatientForm from '../components/EditPatientForm';
import PatientDetailsModal from '../components/PatientDetailsModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  biologicalGender?: string;
  dateOfBirth?: string;
  caregivers: Array<{
    id: string;
    caregiver: {
      id: string;
      name?: string;
      email?: string;
    };
  }>;
  vitals: Array<{ createdAt: string }>;
  dailyLogs: Array<{ date: string }>;
  medicalAppointments: Array<{ date: string }>;
  bookings: Array<{ scheduledAt: string }>;
}

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
        `/api/admin/patients?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}&sortBy=${sortBy}&sortOrder=${sortOrder}`
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

  const handleAddPatient = () => {
    setShowAddForm(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowEditForm(true);
  };

  const handleViewDetails = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowDetailsModal(true);
  };

  const handleDeletePatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedPatient) return;

    try {
      const response = await fetch(`/api/admin/patients/${selectedPatient.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete patient');
      }

      setShowDeleteModal(false);
      setSelectedPatient(null);
      fetchPatients();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600 text-sm mt-1">Manage patient records and caregiver assignments</p>
        </div>
        <Button
          onClick={handleAddPatient}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Patient
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="bg-red-50 border-red-200 p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">Error</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </Card>
      )}

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="createdAt">Date Created</option>
            <option value="firstName">First Name</option>
            <option value="lastName">Last Name</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total Patients</p>
          <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">With Caregivers</p>
          <p className="text-2xl font-bold text-gray-900">
            {patients.filter((p) => p.caregivers.length > 0).length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Recent Appointments</p>
          <p className="text-2xl font-bold text-gray-900">
            {patients.filter((p) => p.medicalAppointments.length > 0).length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Upcoming Bookings</p>
          <p className="text-2xl font-bold text-gray-900">
            {patients.filter((p) => p.bookings.length > 0).length}
          </p>
        </Card>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading patients...</div>
        ) : patients.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No patients found. Create one to get started.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Caregiver</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => {
                    const age = patient.dateOfBirth
                      ? new Date().getFullYear() -
                        new Date(patient.dateOfBirth).getFullYear()
                      : '-';

                    return (
                      <TableRow
                        key={patient.id}
                        className="hover:bg-gray-50 border-b"
                      >
                        <TableCell className="font-medium">
                          {patient.firstName} {patient.lastName}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {patient.email || '-'}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {patient.phone || '-'}
                        </TableCell>
                        <TableCell className="text-sm">
                          {patient.biologicalGender || '-'}
                        </TableCell>
                        <TableCell className="text-sm">{age}</TableCell>
                        <TableCell className="text-sm">
                          {patient.caregivers.length > 0 ? (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              {patient.caregivers[0].caregiver.name ||
                                patient.caregivers[0].caregiver.email}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">Unassigned</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleViewDetails(patient)}
                              className="p-2 hover:bg-blue-100 rounded text-blue-600"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditPatient(patient)}
                              className="p-2 hover:bg-yellow-100 rounded text-yellow-600"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePatient(patient)}
                              className="p-2 hover:bg-red-100 rounded text-red-600"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage(Math.max(1, currentPage - 1))
                  }
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={
                        page === currentPage
                          ? 'bg-blue-600 text-white'
                          : ''
                      }
                    >
                      {page}
                    </Button>
                  )
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Modals */}
      {showAddForm && (
        <AddPatientForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
            fetchPatients();
          }}
        />
      )}

      {showEditForm && selectedPatient && (
        <EditPatientForm
          patient={selectedPatient}
          onClose={() => {
            setShowEditForm(false);
            setSelectedPatient(null);
          }}
          onSuccess={() => {
            setShowEditForm(false);
            setSelectedPatient(null);
            fetchPatients();
          }}
        />
      )}

      {showDetailsModal && selectedPatient && (
        <PatientDetailsModal
          patientId={selectedPatient.id}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedPatient(null);
          }}
        />
      )}

      {showDeleteModal && selectedPatient && (
        <DeleteConfirmModal
          patientName={`${selectedPatient.firstName} ${selectedPatient.lastName}`}
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedPatient(null);
          }}
        />
      )}
    </div>
  );
}
