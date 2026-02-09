import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

// GET: Fetch patients with pagination, search, and sorting
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    const skip = (page - 1) * limit;

    // Build search filter
    const searchFilter = search
      ? {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' as const } },
            { lastName: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
            { phone: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    // Fetch patients with caregivers
    const patients = await prisma.patient.findMany({
      where: searchFilter,
      include: {
        caregivers: {
          include: {
            caregiver: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                image: true,
                caregiverProfile: {
                  select: {
                    specialization: true,
                    yearsOfExperience: true,
                  },
                },
              },
            },
          },
        },
        vitals: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        dailyLogs: {
          orderBy: { date: 'desc' },
          take: 1,
        },
        medicalAppointments: {
          orderBy: { date: 'desc' },
          take: 1,
        },
        bookings: {
          orderBy: { scheduledAt: 'desc' },
          take: 1,
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    });

    // Get total count for pagination
    const total = await prisma.patient.count({
      where: searchFilter,
    });

    return NextResponse.json({
      patients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('[PATIENTS_GET]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: Create new patient
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      biologicalGender,
      heightCm,
      weightKg,
      timezone,
      medicalConditions,
      medications,
      emergencyContact,
      emergencyPhone,
      caregiverId,
      caregiverNotes,
      familyMemberId,
      familyMemberRelationship,
      familyMemberAccessLevel,
    } = body;

    // Validate required fields
    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      );
    }

    if (!caregiverId) {
      return NextResponse.json(
        { error: 'Caregiver assignment is required' },
        { status: 400 }
      );
    }

    // Verify caregiver exists and has CAREGIVER role
    const caregiver = await prisma.user.findFirst({
      where: {
        id: caregiverId,
        role: 'CAREGIVER',
      },
    });

    if (!caregiver) {
      return NextResponse.json(
        { error: 'Invalid caregiver selection' },
        { status: 400 }
      );
    }

    // Create patient with caregiver assignment
    const patient = await prisma.patient.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        biologicalGender,
        heightCm: heightCm ? parseFloat(heightCm) : null,
        weightKg: weightKg ? parseFloat(weightKg) : null,
        timezone,
        medicalConditions: medicalConditions || [],
        medications,
        emergencyContact,
        emergencyPhone,
        caregivers: {
          create: {
            caregiverId,
            notes: caregiverNotes,
          },
        },
        familyMembers: familyMemberId
          ? {
              create: {
                clientId: familyMemberId,
                relationshipType: familyMemberRelationship || 'family member',
                accessLevel: familyMemberAccessLevel || 'VIEW',
              },
            }
          : undefined,
      },
      include: {
        caregivers: {
          include: {
            caregiver: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                image: true,
              },
            },
          },
        },
        familyMembers: {
          include: {
            client: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    console.error('[PATIENTS_POST]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
