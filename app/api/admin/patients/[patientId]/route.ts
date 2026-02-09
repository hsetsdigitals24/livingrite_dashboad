import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

// GET: Fetch single patient with all associated records
export async function GET(
  req: Request,
  { params }: { params: { patientId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const patient = await prisma.patient.findUnique({
      where: { id: params.patientId },
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
                    bio: true,
                  },
                },
              },
            },
          },
        },
        vitals: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        dailyLogs: {
          orderBy: { date: 'desc' },
          take: 30,
          include: {
            sleepData: true,
            morningVitals: true,
            eveningVitals: true,
            physicalActivity: true,
            nutritionData: true,
            mentalHealthData: true,
          },
        },
        labResults: {
          orderBy: { date: 'desc' },
          take: 10,
        },
        medicalAppointments: {
          orderBy: { date: 'desc' },
          take: 10,
        },
        bookings: {
          orderBy: { scheduledAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error('[PATIENT_GET]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH: Update patient details
export async function PATCH(
  req: Request,
  { params }: { params: { patientId: string } }
) {
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
    } = body;

    const updateData: any = {};

    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
    if (biologicalGender !== undefined) updateData.biologicalGender = biologicalGender;
    if (heightCm !== undefined) updateData.heightCm = heightCm ? parseFloat(heightCm) : null;
    if (weightKg !== undefined) updateData.weightKg = weightKg ? parseFloat(weightKg) : null;
    if (timezone !== undefined) updateData.timezone = timezone;
    if (medicalConditions !== undefined) updateData.medicalConditions = medicalConditions;
    if (medications !== undefined) updateData.medications = medications;
    if (emergencyContact !== undefined) updateData.emergencyContact = emergencyContact;
    if (emergencyPhone !== undefined) updateData.emergencyPhone = emergencyPhone;

    const patient = await prisma.patient.update({
      where: { id: params.patientId },
      data: updateData,
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
      },
    });

    return NextResponse.json(patient);
  } catch (error) {
    console.error('[PATIENT_PATCH]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: Delete patient
export async function DELETE(
  req: Request,
  { params }: { params: { patientId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await prisma.patient.delete({
      where: { id: params.patientId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[PATIENT_DELETE]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
