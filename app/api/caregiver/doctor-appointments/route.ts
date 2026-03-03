import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET - upcoming doctor appointments for patients assigned to caregiver
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'CAREGIVER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // get patient ids assigned to this caregiver
    const assignments = await prisma.patientCaregiverAssignment.findMany({
      where: { caregiverId: session.user.id, unassignedAt: null },
      select: { patientId: true },
    });
    const patientIds = assignments.map((a) => a.patientId);

    const appointments = await prisma.medicalAppointment.findMany({
      where: {
        patientId: { in: patientIds },
        date: { gte: new Date() },
      },
      orderBy: { date: 'asc' },
      include: {
        patient: { select: { firstName: true, lastName: true } },
      },
    });

    return NextResponse.json({ success: true, data: appointments });
  } catch (err) {
    console.error('Failed to fetch doctor appointments', err);
    return NextResponse.json({ success: false, error: 'Could not load appointments' }, { status: 500 });
  }
}

// POST - caregiver schedules a doctor appointment for a patient
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'CAREGIVER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { patientId, date, provider, reason, notes } = await req.json();
    if (!patientId || !date || !provider || !reason) {
      return NextResponse.json({ error: 'patientId, date, provider and reason are required' }, { status: 400 });
    }

    // verify caregiver assignment
    const assignment = await prisma.patientCaregiverAssignment.findFirst({
      where: { caregiverId: session.user.id, patientId, unassignedAt: null },
    });
    if (!assignment) {
      return NextResponse.json({ error: 'Patient not assigned to you' }, { status: 403 });
    }

    const appointment = await prisma.medicalAppointment.create({
      data: {
        patientId,
        date: new Date(date),
        provider,
        reason,
        notes: notes || '',
      },
    });

    return NextResponse.json({ success: true, data: appointment });
  } catch (err) {
    console.error('Error creating doctor appointment', err);
    return NextResponse.json({ success: false, error: 'Failed to create appointment' }, { status: 500 });
  }
}
