import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

// POST: Create or update daily log for a patient
export async function POST(
  req: Request,
  { params }: { params: { patientId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'CAREGIVER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { patientId } = params;
    const { date, notes, ...logData } = await req.json();

    // Verify caregiver has access to this patient
    const assignment = await prisma.patientCaregiverAssignment.findFirst({
      where: {
        patientId,
        caregiverId: session.user.id,
        unassignedAt: null,
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: 'Patient not assigned to you' },
        { status: 403 }
      );
    }

    // Validate input
    if (!date) {
      return NextResponse.json(
        { error: 'Date is required' },
        { status: 400 }
      );
    }

    const logDate = new Date(date);
    logDate.setHours(0, 0, 0, 0);

    // Check if daily log already exists for this date
    const existingLog = await prisma.dailyLog.findUnique({
      where: {
        patientId_date: {
          patientId,
          date: logDate,
        },
      },
    });

    if (existingLog) {
      // Update existing log
      const dailyLog = await prisma.dailyLog.update({
        where: { id: existingLog.id },
        data: {
          ...logData,
        },
      });
      return NextResponse.json(dailyLog);
    } else {
      // Create new log
      const dailyLog = await prisma.dailyLog.create({
        data: {
          patientId,
          date: logDate,
          ...logData,
        },
      });
      return NextResponse.json(dailyLog, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating/updating daily log:', error);
    return NextResponse.json(
      { error: 'Failed to create/update daily log' },
      { status: 500 }
    );
  }
}
