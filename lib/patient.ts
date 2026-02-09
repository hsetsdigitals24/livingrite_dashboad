import { prisma } from '@/lib/prisma';

export interface CreatePatientInput {
  name: string;
  email: string;
  phone?: string | null;
  dateOfBirth?: Date | null;
  biologicalGender?: string | null;
  heightCm?: number | null;
  weightKg?: number | null;
  timezone?: string | null;
  medicalConditions?: string[];
  medications?: any;
  emergencyContact?: string | null;
  emergencyPhone?: string | null;
}

/**
 * Create a new patient
 * @param data - Patient data
 * @returns Created patient
 */
export async function createPatient(data: CreatePatientInput) {
  // Check if patient email already exists
  const existingPatient = await prisma.patient.findUnique({
    where: { email: data.email },
  });

  if (existingPatient) {
    throw new Error('Email already in use');
  }

  // Create patient record
  const patient = await prisma.patient.create({
    data: {
      firstName: data.name.split(' ')[0] || '',
      lastName: data.name.split(' ').slice(1).join(' ') || '',
      email: data.email,
      phone: data.phone || null,
      dateOfBirth: data.dateOfBirth || null,
      biologicalGender: data.biologicalGender || null,
      heightCm: data.heightCm || null,
      weightKg: data.weightKg || null,
      timezone: data.timezone || 'UTC',
      medicalConditions: data.medicalConditions || [],
      medications: data.medications || null,
      emergencyContact: data.emergencyContact || null,
      emergencyPhone: data.emergencyPhone || null,
    },
  });

  return patient;
}

/**
 * Get patients with pagination and search
 * @param page - Page number (1-indexed)
 * @param limit - Items per page
 * @param search - Search term for name or email
 * @returns Paginated list of patients
 */
export async function getPatients(page: number = 1, limit: number = 10, search: string = '') {
  const skip = (page - 1) * limit;

  // Build search filter
  const searchFilter = search
    ? {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' as const } },
          { lastName: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  // Fetch patients
  const patients = await prisma.patient.findMany({
    where: searchFilter,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      createdAt: true,
      biologicalGender: true,
    },
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  // Get total count
  const total = await prisma.patient.count({
    where: searchFilter,
  });

  return {
    data: patients,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
